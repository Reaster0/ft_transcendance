import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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


@WebSocketGateway({ namespace: '/chat', cors: { origin: process.env.FRONTEND, credentials: true } }) //maybe chage origin
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private readonly chatServices: ChatServices,
    private readonly chanServices: ChanServices,
    private readonly connectService: ConnectService,
    private readonly messageServices: MessageService,
    private readonly authServices: AuthService,
    private readonly userServices: UsersService,

  ) { }

  @WebSocketServer() server: Server
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload);
  }

  /******* Connection ********/
  async handleConnection(client: Socket) {
    console.log('connection');
    try {
      const user: User = await this.authServices.getUserBySocket(client);
      client.data.user = user; //important
      this.connectService.connectUser(client, user);
      this.updateUsersStatus();
    } catch {
      return client.disconnect()
    }
    this.logger.log(`Client connected: ${client.id}`);
  }

  /******* Disconection ********/
  async handleDisconnect(client: Socket) {
    //there may have a better way (perf) to handle this
    /*
    try {
      const user: User = await this.authServices.getUserBySocket(client);
      await this.userServices.changeStatus(user, Status.OFFLINE);
      this.updateUsersStatus();
      this.logger.log(`Client disconnected: ${client.id}`);
    } catch { return client.disconnect(); }
  */
    
    await this.connectService.disconnectUser(client.id)
    this.logger.log(`Client disconnected: ${client.id}`);
    this.updateUsersStatus();
    client.disconnect();
  }

  /*********** .  . Create Channel **************** */
  @UseGuards(AuthChat)
  @SubscribeMessage('createChannel')
  async onChannelCreation(client: Socket, channel: ChanI): Promise<boolean> {
    console.log('create channel');
      const createChannel: ChanI = await this.chanServices.createChannel(channel, client.data.user);
      if (!createChannel)
          return false;
      await this.emitChannels();
      return true;
  }
  
  /************* . . Delete Channel **************** */
  @UseGuards(AuthChat)
    @SubscribeMessage('deleteChannel')
    async onDeleteChannel(client: Socket, channel: ChanI) {
        console.log('delet chan');
        await this.chanServices.deleteChannel(channel);
        await this.emitChannels();
    }

    @UseGuards(AuthChat)
    @SubscribeMessage('message')
    async onSendMessage(client: Socket, message: MessageI) {
        const chanUser: ChanUserI = await this.chanServices.findUserByChannel(message.channel, client.data.user.userId);
        let date = new Date;
        if (chanUser && (chanUser.mute >= date || chanUser.ban >= date)) // User cannot send message !
            return;
        const createMessage: MessageI = await this.messageServices.create({...message, user: client.data.user});
        const channel: ChanI = await this.chanServices.getChan(createMessage.channel.id);
        const connectedSocket : JoinedSocketI[] = await this.chanServices.findSocketByChannel(channel);

        const originalMessage = createMessage.content;
        for (const socket of connectedSocket) {
            createMessage.content = originalMessage;

            const blockedUser: number = socket.user.blockedUID.find(element => element === createMessage.user.id)
            if (blockedUser) {
                createMessage.content= "... 🛑 ...";
            }
            const target = await this.chanServices.findUserByChannel(message.channel, socket.user.id);
            let date = new Date;
            if (!target || target.ban < date || target.ban === null || target.mute >= date)
              this.server.to(socket.socketID).emit('messageSended', createMessage); //target cannot recive message
        }
      }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

    /************** . Join Channel *************/
    @UseGuards(AuthChat)
    @SubscribeMessage('joinChannel')
    async handleJoinChannel(client: Socket, channel: ChanI) {
        const channelFound = await this.chanServices.getChan(channel.id);
        // privacy ------
        const messages = await this.messageServices.findMessagesForChannel(channelFound, client.data.user)
        await this.chanServices.addSocket({socketID: client.id, user: client.data.user, chan: channel})
        this.server.to(client.id).emit('previousMessages', messages);
    }

    /********************* Leave Channel ********************/
    @UseGuards(AuthChat)
    @SubscribeMessage('leaveChannel')
    async handleLeaveChannel(client: Socket) {
        await this.chanServices.removeSocket(client.id);
    }

    /********************* Block user *********************/
    @UseGuards(AuthChat)
    @SubscribeMessage('blockUser')
    async blockOrDefiUser(client: Socket, data: any): Promise<User> {
        const { user, block } = data;
        const userUpdate = this.userServices.updateBlockedUser(block, client.data.user, user);
        return userUpdate;
    }

  /****** Emit Service ******/
  async updateUsersStatus() {
    const connectedUsers : User[] = await this.userServices.getConnectedUser();
    //return this.server.emit('connectedUsers', connectedUsers); // user or user.id ?
    let connectUsersID: number[] = [];
    for ( const user of connectedUsers)
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
