import { Logger, UseGuards } from '@nestjs/common';
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
import { ChatServices } from './services/chat.service';
import { Status } from 'src/common/enums/status.enum';
import { AuthChat } from './Guards/ChatAuth.guard';
import { ChanI } from './interfaces/channel.interface';
import { MessageI } from './interfaces/message.interface';
import { ConnectService } from './services/connect.service';
import { connectedSocketI } from './interfaces/connectSocket.interface';
import { ChanServices } from './services/chan.service';
import { ChanUserI } from './interfaces/chanUser.interface';
import { MessageService } from './services/message.service';
import { JoinedSocketI } from './interfaces/joinedSocket.interface';


@WebSocketGateway({ cors: { origin: '*', credentials: true }, credentials: true, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private readonly chatServices: ChatServices,
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
    } catch {
      this.logger.log('Failed to retrive user from client');
      return client.disconnect();
    }
    this.logger.log(`Client connected: ${client.id}`);
  }

  /******* Disconection ********/
  async handleDisconnect(client: Socket) {
    await this.connectService.disconnectUser(client.id, client.data.user);
    this.updateUsersStatus();
    client.disconnect();
    this.logger.log(`Client disconnected: ${client}`);
  }

  /*********** .  . Create Channel **************** */
  //@UseGuards(AuthChat)
  @SubscribeMessage('createChannel')
  async onChannelCreation(client: Socket, channel: ChanI): Promise<boolean> {
    this.logger.log(channel);

    if (!client.data.user) {
      console.log('didnt got the time to get the user :(');
      client.disconnect();
      return false;
    }
    const createChannel: ChanI = await this.chanServices.createChannel(channel, client.data.user);

    if (!createChannel) {
      this.logger.log(`ERROR will creating: ${channel.chanName}`);
      return false;
    }

    await this.emitChannels();
    this.logger.log(`new Channel: ${createChannel.chanName} created`);
    return true;
  }

  /************* . . Delete Channel **************** */
  // @UseGuards(AuthChat)
  @SubscribeMessage('deleteChannel')
  async onDeleteChannel(client: Socket, channel: ChanI) {

    await this.chanServices.deleteChannel(channel);
    await this.emitChannels();
    this.logger.log(`delete Channel: ${channel.chanName}`);
  }

  //  @UseGuards(AuthChat)
  @SubscribeMessage('message')
  async onSendMessage(client: Socket, message: MessageI) {

    this.logger.log('sending message');
    console.log(message);
    //1) get the sender role
    const chanUser: ChanUserI = await this.chanServices.findUserByChannel(message.channel, client.data.user.id);
    console.log(chanUser);
    let date = new Date;
    //2) accordingly to the sender role the sender is unable to send message => return ;
    if (chanUser && (chanUser.mute >= date || chanUser.ban >= date)) // User cannot send message !
      return;
    // greate a new message (save it on the message repo)
    const createMessage: MessageI = await this.messageServices.create({ ...message, user: client.data.user });
    // retrive channel from channel.id
    const channel: ChanI = await this.chanServices.getChan(createMessage.channel.id);
    // get all the socket connete to that channel
    const connectedSocket: JoinedSocketI[] = await this.chanServices.findSocketByChannel(channel);
    const originalMessage = createMessage.content;

    // for each socket connected 
    for (const socket of connectedSocket) {
      createMessage.content = originalMessage;
      // check if the user associeted whit that soket as blocket the sender
      const blockedUser: number = socket.user.blockedUID.find(element => element === createMessage.user.id)
      if (blockedUser)
        createMessage.content = "... 🛑 ..."; // if it is the case blur the message
      // get the user associeted to the soket (target of the message)
      const target = await this.chanServices.findUserByChannel(message.channel, socket.user.id);
      let date = new Date;
      if (!target || target.ban < date || target.ban === null) //<--------- Not sure
        this.server.to(socket.socketID).emit('messageSended', createMessage); //send message (show)
    }
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  /************** . Join Channel *************/
  //  @UseGuards(AuthChat)
  @SubscribeMessage('joinChannel')
  async handleJoinChannel(client: Socket, channel: ChanI) {
    const channelFound = await this.chanServices.getChan(channel.id);
    // privacy ------
    const messages = await this.messageServices.findMessagesForChannel(channelFound, client.data.user)
    await this.chanServices.addSocket({ socketID: client.id, user: client.data.user, chan: channel })
    this.server.to(client.id).emit('previousMessages', messages);
    this.logger.log(`${client.data.user.username} join ${channel.chanName}`);
  }

  /********************* Leave Channel ********************/
  // @UseGuards(AuthChat)
  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(client: Socket) {
    await this.chanServices.removeSocket(client.id);
    this.logger.log(`${client.data.user.username} leave a channel`);
  }

  /********************* Block user *********************/
  //@UseGuards(AuthChat)
  @SubscribeMessage('blockUser')
  async blockOrDefiUser(client: Socket, data: any): Promise<User> {
    const { user, block } = data;
    const userUpdate = this.userServices.updateBlockedUser(block, client.data.user, user);
    this.logger.log(`${client.data.user} block ${user.username}`);
    return userUpdate;
  }

  /****** Emit Service ******/
  async updateUsersStatus() {
    const connectedUsers: User[] = await this.userServices.getConnectedUser();
    //return this.server.emit('connectedUsers', connectedUsers); // user or user.id ?
    let connectUsersID: number[] = [];
    for (const user of connectedUsers)
      connectUsersID.push(user.id);
    return this.server.emit('connectedUsers', connectUsersID); // user or user.id ?
  }

  async emitChannels() {
    console.log('we emit all the chan for that user');
    const connections: connectedSocketI[] = await this.connectService.findAll();
    for (const connection of connections) {
      const channels: ChanI[] = await this.chanServices.getChannelsFromUser(connection.user.id);
      this.server.to(connection.socketID).emit('channel', channels);
    }
  }
}
