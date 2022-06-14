import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { ChannelI} from './interfaces/channel.interface';
import { MessageI } from './interfaces/message.interface';
import { ConnectService } from './services/connect.service';
import { ChanServices } from './services/chan.service';
import { ChanUserI } from './interfaces/channelUser.interface';
import { MessageService } from './services/message.service';
import { ChanUserService } from './services/chanUser.service';
import { FrontChannelI } from './interfaces/frontChannel.interface';
import { Channel } from './entities/channel.entity';


@WebSocketGateway({ cors: { origin: '*', credentials: true }, credentials: true, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private readonly chanUserServices: ChanUserService,
    private readonly chanServices: ChanServices,
    private readonly connectService: ConnectService,
    private readonly messageServices: MessageService,
    private readonly authServices: AuthService,
    private readonly userServices: UsersService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload);
  }

  /******* Connection ********/
  async handleConnection(client: Socket) {
    try {
      const user: User = await this.authServices.getUserBySocket(client);
      client.data.user = user;
      this.connectService.connectUser(client, user);
      this.updateUsersStatus();
      client.emit('connectedToChat');
    } catch {
      this.logger.log('Failed to retrive user from client');
      return client.disconnect();
    }
    this.logger.log(`Client connected: ${client.id}`);
  }

  /******* Disconection ********/
  @SubscribeMessage('disconnect')
  async handleDisconnect(client: Socket) {
    if (!client.data.user) {
      return client.disconnect();
    }
    await this.connectService.disconnectUser(client.data.user);
    this.updateUsersStatus();
    client.disconnect();
    this.logger.log(`Client disconnected: ${client}`);
  }

  /*********** .  . Create Channel **************** */
  //@UseGuards(AuthChat)
  @SubscribeMessage('createChannel')
  async onChannelCreation(client: Socket, channel: ChannelI): Promise<boolean> {

    if (!client.data.user) {
      console.log('didnt got the time to get the user :(');
      client.disconnect();
      return false;
    }
    const createChannel: Channel = await this.chanServices.createChannel(channel, client.data.user);

    if (!createChannel) {
      this.logger.log(`ERROR will creating: ${channel.channelName}`);
      return false;
    }
    console.log(createChannel)

    const chanUser = await this.chanUserServices.addAdminToChan(createChannel, client.data.user);
    console.log('--->', chanUser);


    await this.emitChannels();
    this.logger.log(`new Channel: ${createChannel.channelName} created`);
    return true;
  }

  /************* . . Delete Channel **************** */
  // @UseGuards(AuthChat)
  @SubscribeMessage('deleteChannel')
  async onDeleteChannel(client: Socket, channel: ChannelI) {

    await this.chanServices.deleteChannel(channel);
    await this.emitChannels();
    this.logger.log(`delete Channel: ${channel.channelName}`);
  }

  //  @UseGuards(AuthChat)
  @SubscribeMessage('message')
  async onSendMessage(client: Socket, message: MessageI) {

    this.logger.log('sending message');
    console.log(message);
    //1) get the sender role
    const chanUser: ChanUserI = await this.chanUserServices.findUserOnChannel(message.channel, client.data.user.id);
    console.log(chanUser);
    let date = new Date;
    //2) accordingly to the sender role the sender is unable to send message => return ;
    if (chanUser && (chanUser.mute >= date || chanUser.isBan)) // User cannot send message !
      return;
    // greate a new message (save it on the message repo)
    const createMessage: MessageI = await this.messageServices.create({ ...message, user: client.data.user });
    const originalMessage = createMessage.content;
    const sender = createMessage.user;
    // retrive channel from channel.id
    const channel: ChannelI = await this.chanServices.getChan(createMessage.channel.id);
    // get all the socket connete to that channel
//    const connectedSocket: string[] = this.chanServices.findSocketByChannel(channel);
    
    const connectedUsers: User[] = await this.chanServices.getAllChanUser(channel);

    for (const user of connectedUsers) {
      createMessage.content = originalMessage;
      // check if the user associeted whit that soket as blocket the sender
      const blockedUser: number = user.blockedUID.find(element => element === sender.id)
      if (blockedUser)
        createMessage.content = "... 🛑 ..."; // if it is the case blur the message
      // get the user associeted to the soket (target of the message)
//      const target = await this.chanServices.findUserByChannel(message.channel, socket.user.id);
      /*
      const target = await this.chanUserServices.findUserOnChannel(message.channel, chanUser.user)
      let date = new Date;
      if (!target || target.ban < date || target.ban === null) //<--------- Not sure
      */
        this.server.to(user.chatSocket).emit('messageSended', createMessage); //send message (show)
    }
  }

  afterInit(server: Server) {
    this.logger.log('Chat is Init 🙏');
  }

  /************** . Join Channel *************/
  //  @UseGuards(AuthChat)
  @SubscribeMessage('joinChannel')
  async handleJoinChannel(client: Socket, channel: ChannelI) {
    const channelFound = await this.chanServices.getChan(channel.id);
    if (! channelFound) return ; // better handel in get chan and catch
    // privacy ------
    if (channelFound.password) {
      if (!channel.password)
        return ;
      console.log(channel.password)
      // will be handel soon
    }
    const messages = await this.messageServices.findMessagesForChannel(channelFound, client.data.user)

    // mmmhhhh
    await this.chanServices.pushUserToChan(channel, client.data.user);
    await this.chanUserServices.addUserToChan(channel, client.data.user);
    //emit all previous message on the channel
    this.server.to(client.id).emit('previousMessages', messages);
    this.logger.log(`${client.data.user.username} joinned ${channel.channelName}`);
  }

  /********************* Leave Channel ********************/
  // @UseGuards(AuthChat)
  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(client: Socket, channel: ChannelI) {
    await this.chanServices.removeUserToChan(channel, client.data.user);
    await this.chanUserServices.deletChanUser(channel, client.data.user);
    this.logger.log(`${client.data.user.username} leave a channel`);
  }

  
  /* Owner can edit the channel */
  @SubscribeMessage('editChannel')
  async updateChannel(client: Socket, input: any): Promise<boolean> {
      const { channel } = input;
      const channelFound = await this.chanServices.getChan(channel.id);

      const ret: Boolean = await this.chanServices.updateChannel(channelFound, input.info)
      if (ret === true){
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
  async updateUsersStatus() {
    const connectedUsers: User[] = await this.userServices.getConnectedUsers();
    return this.server.emit('connectedUsers', connectedUsers); // user or user.id ?
    /*
    let connectUsersID: number[] = [];
    for (const user of connectedUsers)
      connectUsersID.push(user.id);
    return this.server.emit('connectedUsers', connectUsersID); // user or user.id ?
    */
  }

  @SubscribeMessage('emitChannels')
  async emitChannels() {
    console.log('we emit all the chan for that user');
    const connections: User[] = await this.userServices.getConnectedUsers();
    console.log(connections);
    for (const connection of connections) {
      const channels: FrontChannelI[] = await this.chanServices.getChannelsFromUser(connection.id);
      this.server.to(connection.chatSocket).emit('channelList', channels);
    }
  }

  @SubscribeMessage('emitMyChannels')
  async emitMyChannels(client: Socket) {
    const channels: FrontChannelI[] = await this.chanServices.getChannelsFromUser(client.data.user.id);
    client.emit('channelList', channels);
  }

  @SubscribeMessage('retrieveUsers')
  async retrieveUsersTest(client: Socket, param: { id: string }) {
    client.emit('channelUsers', { id: param.id, users: [] });
  }

  @SubscribeMessage('retrieveMessages')
  async retrieveMessagesTest(client: Socket, param: { id: string }) {
    client.emit('channelMessages', { id: param.id, messages: [] });
  }
}
