import { Inject, Logger, forwardRef } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
  SubscribeMessage, WebSocketGateway, WebSocketServer,
  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { ChannelI} from './interfaces/back.interface';
import { MessageI } from './interfaces/back.interface';
import { ChanServices } from './services/chan.service';
import { MutedI } from './interfaces/back.interface';
import { MessageService } from './services/message.service';
import { FrontChannelI, FrontUserGlobalI, FrontUserChannelI } from './interfaces/front.interface';
import { Channel } from './entities/channel.entity';


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
    const createChannel: Channel = await this.chanServices.createChannel(channel, client.data.user);
    if (!createChannel) {
      this.logger.log(`ERROR will creating: ${channel.name}`);
      return false;
    }
    // add owner to chanUser ?
    await this.emitChannels();
    this.logger.log(`new Channel: ${createChannel.name} created`);
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
  async onSendMessage(client: Socket, params: { channelId: string, message: MessageI }) {
    this.logger.log('sending message');
//    console.log(params.message);
//    //1) get the sender role
//    const User: ChanUserI = await this.chanUserServices.findUserOnChannel(params.channelId, client.data.user.id);
//    console.log(chanUser);
//    let date = new Date;
//    //2) accordingly to the sender role the sender is unable to send message => return ;
//    if (chanUser && (chanUser.mute >= date )) // User cannot send message !
//      return;
//    // greate a new message (save it on the message repo)
//    const createMessage: MessageI = await this.messageServices.create({ ...params.message, user: client.data.user });
//    const originalMessage = createMessage.content;
//    const sender = createMessage.user;
//    // retrive channel from channel.id
//    const channel: ChannelI = await this.chanServices.getChan(createMessage.channel.id);
//    // get all the socket connete to that channel
////    const connectedSocket: string[] = this.chanServices.findSocketByChannel(channel);
    
//    const connectedUsers: User[] = await this.chanServices.getAllChanUser(channel.id);

//    for (const user of connectedUsers) {
//      createMessage.content = originalMessage;
//      // check if the user associeted whit that soket as blocket the sender
//      const blockedUser: number = user.blockedId.find(element => element === sender.id)
//      if (blockedUser)
//        createMessage.content = "... 🛑 ..."; // if it is the case blur the message
//      // get the user associeted to the soket (target of the message)
////      const target = await this.chanServices.findUserByChannel(message.channel, socket.user.id);
//      /*
//      const target = await this.chanUserServices.findUserOnChannel(message.channel, chanUser.user)
//      let date = new Date;
//      if (!target || target.ban < date || target.ban === null) //<--------- Not sure
//      */
//        this.server.to(user.chatSocket).emit('messageSended', createMessage); //send message (show)
//    }
  }

  /************** . Join Channel *************/
  //  @UseGuards(AuthChat)
  @SubscribeMessage('joinChannel')
  async handleJoinChannel(client: Socket, channel: ChannelI) {
    const channelFound = await this.chanServices.findChannelWithUsers(channel.id);
    if (! channelFound) return ; // better handel in get chan and catch
    if (channelFound.password) {
      if (!channel.password)
        return ;
    }
    await this.chanServices.pushUserToChan(channel, client.data.user);
    this.logger.log(`${client.data.user.username} joinned ${channel.name}`);
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
    const channel = await this.chanServices.findChannelWithUsersAndMuted(params.id);
    let isMember = false;
    let res = [] as any[];
    for (let user of channel.users) {
      let role = '' as string;
      if (user.id === client.data.user.id) {
        isMember = true;
      }
      if (user.id === channel.owner) {
        role = 'owner';
      } else if (channel.admins.includes(user.id)) {
        role = 'admin';
      } // TODO else if check for muted user (may be a little more complicated)
      res.push({ 'id': user.id, 'role': role })
    }
    if (isMember === false) {
      this.logger.log('Access Refused');
      client.emit('AccessRefused');
      return;
    }
    client.emit('channelUsers', { id: params.id, users: res });
  }

  @SubscribeMessage('getChannelMessages')
  async getChannelMessage(client: Socket, channelId: string) {
    this.logger.log('Get channel messages');
    if (!await this.chanServices.userIsInChannel(client.data.user, channelId))
      return;
    const message = await this.messageServices.findMessagesForChannel(channelId, client.data.user);
    client.emit('channelMessages', message);
  }

  @SubscribeMessage('getJoinnableChannels')
  async getJoinnableChannels(client: Socket, name: string) {
    const channels: FrontChannelI[] = await this.chanServices.filterJoinableChannel(name);
    client.emit('joinnableChannel', channels); // only for client
  }
}
