import { Inject, Logger, forwardRef } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
  SubscribeMessage, WebSocketGateway, WebSocketServer,
  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { ChannelI, RolesI} from './interfaces/back.interface';
import { MessageI } from './interfaces/back.interface';
import { ChanServices } from './services/chan.service';
import { MessageService } from './services/message.service';
import { FrontChannelI, FrontUserGlobalI, FrontUserChannelI } from './interfaces/front.interface';
import { Channel } from './entities/channel.entity';
import * as bcrypt from 'bcrypt';

@WebSocketGateway({ cors: { origin: '*', credentials: true }, credentials: true, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private readonly chanServices: ChanServices,
    private readonly messageServices: MessageService,
    private readonly authServices: AuthService,
    @Inject(forwardRef(() => UsersService))
    private readonly userServices: UsersService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log('Chat is Init 🙏');
  }

  /******* Connection ********/
  async handleConnection(client: Socket) {
    try {
      const user: User = await this.authServices.getUserBySocket(client);
      client.data.user = user;
      await this.userServices.connectUserToChat(user, client.id);
      this.sendUsersList();
      this.logger.log(`Client connected: ${client.id}`);
    } catch {
      this.logger.log('Failed to retrieve user from client');
      return client.disconnect();
    }
  }

  /******* Disconection ********/
  @SubscribeMessage('disconnect')
  async handleDisconnect(client: Socket) {
    if (!client.data.user) {
      return client.disconnect();
    }
    await this.userServices.disconnectUserToChat(client.data.user)
    client.disconnect();
    this.sendUsersList();
    this.logger.log(`Client disconnected: ${client}`);
  }

  /*********** .  . Create Channel **************** */
  //@UseGuards(AuthChat)
  @SubscribeMessage('createChannel')
  async onChannelCreation(client: Socket, channel: ChannelI): Promise<boolean> {
    if (!client.data.user) {
      client.disconnect();
      return false;
    }
    const createChannel: {channel: string, error: string} = await this.chanServices.createChannel(channel, client.data.user);
    if (!createChannel.channel) {
      this.logger.log(`ERROR: ${createChannel.error}`);
      client.emit('errorChannelCreation', `Failed on creating channel: ${createChannel.error}`);
      return false;
    }
    await this.emitChannels();
    this.logger.log(`new Channel: ${createChannel.channel} created`);
      client.emit('channelCreation', `${createChannel.channel}`);
    return true;
  }

  /************* . . Delete Channel **************** */
  // @UseGuards(AuthChat)
  @SubscribeMessage('deleteChannel')
  async onDeleteChannel(client: Socket, channel: ChannelI) {
    await this.chanServices.deleteChannel(channel);
    await this.emitChannels();
    this.logger.log(`delete Channel: ${channel.name}`);
  }

  //  @UseGuards(AuthChat)
  @SubscribeMessage('message')
  async onSendMessage(client: Socket, params: { channelId: string, content: string}) {
    this.logger.log('sending message');
    const channel = await this.chanServices.getChannelFromId(params.channelId); // maybe useless
    const user: RolesI = await this.chanServices.getUserOnChannel(channel, client.data.user.id);

    if (!user) return;
    let date = new Date;
    if (user.muteDate >= date) return;

    const createMessage: MessageI = await this.messageServices.create({ channel, date, content: params.content, user: client.data.user });
    const originalMessage = createMessage.content;
    const sender = createMessage.user;

    const connectedUsers: User[] = await this.chanServices.getAllChanUser(params.channelId);
    for (const user of connectedUsers) {
      const blockedUser: number = user.blockedIds.find(element => element === sender.id)
      if (blockedUser)
        createMessage.content = "... 🛑 ..."; // if it is the case blur the message
      else
        createMessage.content = originalMessage;
      this.server.to(user.chatSocket).emit('messageSended', createMessage); //send message (show)
    }
  }

  /************** . Join Channel *************/
  //  @UseGuards(AuthChat)
  @SubscribeMessage('joinChannel')
  async handleJoinChannel(client: Socket, channel: ChannelI) {
    const channelFound = await this.chanServices.getChannelFromId(channel.id);
    if (!channelFound) return false; // better handel in get chan and catch

    if (channelFound.password) {
      if (!channel.password)
        return false;
      if (await bcrypt.compare(channel.password, channelFound.password) === false)
        return false;
    }
    await this.chanServices.pushUserToChan(channel, client.data.user);
    this.logger.log(`${client.data.user.username} joinned ${channel.name}`);
    return true;
  }


  /********************* Leave Channel ********************/
  // @UseGuards(AuthChat)
  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(client: Socket, channel: ChannelI) {
    await this.chanServices.removeUserFromChan(channel, client.data.user);
    //await this.chanServices.unmuteUser(channel.id, client.data.user);
    this.logger.log(`${client.data.user.username} leave a channel`);
  }


  /* Owner can edit the channel */
  @SubscribeMessage('editChannel')
  async updateChannel(client: Socket, input: any): Promise<boolean> {
    const { channel } = input;
    const channelFound = await this.chanServices.findChannelWithUsers(channel.id);

    const ret: Boolean = await this.chanServices.updateChannel(channelFound, input.info)
    if (ret === true) {
      await this.emitChannels();
      return true;
    }
    return false;
  }

  /********************* Block user *********************/
  //@UseGuards(AuthChat)
  @SubscribeMessage('blockUser')
  async blockOrDefiUser(client: Socket, data: any): Promise<User> {
    const { user, block } = data;
    const userUpdate = this.userServices.updateBlockedUser(client.data.user, block, user);
    this.logger.log(`${client.data.user} block ${user.username}`);
    return userUpdate;
  }

  /****** Emit Service ******/
  async sendUsersList() {
    const users = await this.userServices.getUsers();
    this.server.emit('usersList', users);
  }

  @SubscribeMessage('emitChannels')
  async emitChannels() {
    const connections: User[] = await this.userServices.getConnectedUsers();
    for (const connection of connections) {
      const channels: FrontChannelI[] = await this.chanServices.getChannelsFromUser(connection.id);
      this.server.to(connection.chatSocket).emit('channelList', channels);
    }
  }

  @SubscribeMessage('emitMyChannels')
  async emitMyChannels(client: Socket) {
    this.logger.log('Get channels joined by user');
    const channels: FrontChannelI[] = await this.chanServices.getChannelsFromUser(client.data.user.id);
    client.emit('channelList', channels);
  }

  @SubscribeMessage('getChannelUsers')
  async getChanneUsers(client: Socket, params: any): Promise<any> {
    this.logger.log('Get channel users');
    const channelUsers: RolesI[] = await this.chanServices.getChannelUsers(params.id);
    let isMember = false;
    let res = [] as any[];

    for (let user of channelUsers) {
      if (user.userId === client.data.user.id) {
        isMember = true;
      }
      res.push({ 'id': user.userId, 'role': user.role }) //better changeThis
    }
    if (isMember === false) {
      this.logger.log('Access Refused');
      client.emit('AccessRefused');
      return;
    }
    client.emit('channelUsers', { id: params.id, users: res });
  }

  @SubscribeMessage('getChannelMessages')
  async getChannelMessage(client: Socket, params: any) {
    this.logger.log('Get channel messages');
    if (!await this.chanServices.userIsInChannel(client.data.user, params.id))
      return;
    const messages = await this.messageServices.findMessagesForChannel(params.id, client.data.user);
    client.emit('channelMessages', { id: params.id, messages: messages });
  }

  @SubscribeMessage('getJoinnableChannels')
  async getJoinnableChannels(client: Socket, name: string) {
    const channels: FrontChannelI[] = await this.chanServices.filterJoinableChannel(name);
    client.emit('joinnableChannel', channels); // only for client
  }
}
