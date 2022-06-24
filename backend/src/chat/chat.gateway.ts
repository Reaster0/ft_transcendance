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
import { FrontChannelI } from './interfaces/front.interface';
import * as bcrypt from 'bcrypt';
import { Status } from '../users/enums/status.enum';
import { ChannelType } from 'src/users/enums/channelType.enum';

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
      await this.userServices.changeStatus(client.data.user, Status.ONLINE, client.id);
      this.logger.log(`Client connected: ${client.data.user.username}`);
    } catch {
      this.logger.log('Failed to retrieve user from client');
      return client.disconnect();
    }
  }

  /******* Disconection ********/
  @SubscribeMessage('disconnect')
  async handleDisconnect(client: Socket) {
    try {
      if (!client.data.user) {
        return client.disconnect();
      }
      this.logger.log(`Client disconnected: ${client.data.user.username}`);
      await this.userServices.changeStatus(client.data.user, Status.OFFLINE, null);
    } catch (e) {
      this.logger.log(e);
      client.disconnect();
    }
  }

  /*********** Channel management ************ */
  @SubscribeMessage('createChannel')
  async handleCreateChannel(client: Socket, channel: ChannelI): Promise<boolean> {
    if (!client.data.user) {
      client.disconnect();
      return false;
    }
    const createChannel: {channel: string, error: string} = await this.chanServices.createChannel(channel, client.data.user);
    if (!createChannel.channel) {
      this.logger.log(`ERROR: ${createChannel.error}`);
      client.emit('errorChannelCreation', `${createChannel.error}` );
      return false;
    }
    this.logger.log(`new Channel: ${createChannel.channel} created`);
    client.emit('channelCreated', `${createChannel.channel}`);
    return true;
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(client: Socket, channel: ChannelI) {
    const channelFound = await this.chanServices.findChannelWithUsers(channel.id);
    if (!channelFound) {
      return ;
    }
    if (channelFound.password) {
      if (!channel.password) {
        client.emit('wrongPassword');
        return ;
      } else if (await bcrypt.compare(channel.password, channelFound.password) === false) {
        client.emit('wrongPassword');
        return ;
      }
    }
    // how this is supposed to happen ? : with the link for private channels....
    const index = channelFound.banned.indexOf(client.data.user.id);
    if (index !== -1) {
      client.emit('youAreBanned');
      return ;
    }
    await this.chanServices.pushUserToChan(channelFound, client.data.user);
    this.logger.log(`${client.data.user.username} joined ${channelFound.name}`);
    client.emit('joinAccepted', { id: channelFound.id, isPm: false });
    this.handleEmitMyChannels(client);
    const connectedUsers: User[] = await this.chanServices.getAllChanUser(channelFound.id);
    for (const user of connectedUsers) {
      this.server.to(user.chatSocket).emit('userChannelModif', { id: channelFound.id });
    }
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(client: Socket, params: { id: string }) {
    try {
      if ((await this.chanServices.isOwner(params.id, client.data.user.id)) === true) {
        const connectedUsers: User[] = await this.chanServices.getAllChanUser(params.id);
        for (const user of connectedUsers) {
          this.server.to(user.chatSocket).emit('channelDestruction', { id: params.id });
        }
        this.chanServices.deleteChannel(client.data.user.id, params.id);
      } else {
        await this.chanServices.removeUserFromChan(params.id, client.data.user);
        this.logger.log(`${client.data.user.username} leave a channel`);
        client.emit('leftChannel', { id: params.id });
        const connectedUsers: User[] = await this.chanServices.getAllChanUser(params.id);
        for (const user of connectedUsers) {
          this.server.to(user.chatSocket).emit('userChannelModif', { id: params.id });
        }
      }
    } catch (e) {
      this.logger.log(e);
    }
  }

  @SubscribeMessage('editChannel')
  async handleEditChannel(client: Socket, input:
    { channelId: string, type: ChannelType, password: string, avatar: null | Buffer }): Promise<void> {
    const { channelId, type, password, avatar} = input;
    const channelFound = await this.chanServices.findChannelWithUsers(channelId);
    const ret: Boolean = await this.chanServices.updateChannel(channelFound, {type, password, avatar});
    if (ret === true) {
      this.server.emit('channelEdited', { id: channelId })
    }
  }

  @SubscribeMessage('createPrivateConversation')
  async handleCreatePrivateConversation(client: Socket, targetId: string) {
    try {
      const user1 = client.data.user;
      const user2 = await this.userServices.findUserById(targetId);
      const channel = await this.chanServices.privateConversation(user1, user2);
      if (channel != null) {
        client.emit('joinAccepted', { id: channel.id, isPm: true });
        this.server.to(user2.chatSocket).emit('joinAccepted', { id: channel.id, isPm: true });
      } else {
        client.emit('alreadyInPm', { name: user2.nickname });
      }
    } catch (e) {
      client.disconnect();
      this.logger.log(e);
    }
  }

  /******* Message management ********/

  @SubscribeMessage('message')
  async handleMessage(client: Socket, params: { channelId: string, content: string}) {
    this.logger.log('sending message');
    const channel = await this.chanServices.getChannelFromId(params.channelId);
    const user: RolesI = await this.chanServices.getUserOnChannel(channel, client.data.user.id);
    if (!user) {
      return;
    }
    let date = new Date;
    if (user.muteDate >= date) {
      client.emit('youAreMuted', { channelId: channel.id,
        limitdate: user.muteDate.toUTCString() });
      return;
    }
    const message: MessageI = await this.messageServices.create({ channel, date, content: params.content, user: client.data.user });
    const originalMessage = message.content;
    const sender = message.user;
    const connectedUsers: User[] = await this.chanServices.getAllChanUser(params.channelId);
    for (const user of connectedUsers) {
      const blockedUser: number = user.blockedIds.find(element => element === sender.id)
      if (blockedUser) {
        if (channel.type === ChannelType.PM) {
          continue ;
        }
        message.content = "... 🛑 ...";
      }
      else {
        message.content = originalMessage;
      }
      const frontMessage = { content: message.content, date: message.date.toUTCString(), userId: message.user.id };
      this.server.to(user.chatSocket).emit('newMessage', { id: params.channelId, message: frontMessage });
    }
  }

  /********************* User Management *********************/

  @SubscribeMessage('blockUserControl')
  async handleBlockUserControl(client: Socket, data: { targetId: number, block: boolean }): Promise<void>{
    try {
      const { targetId, block } = data;
      const change = await this.userServices.updateBlockedUser(client.data.user.id, block, targetId);
      if (change) {
        client.emit('blockChange', { targetId: targetId });
      }
    } catch (e) {
      this.logger.log(e);
    }
  }

  @SubscribeMessage('muteUser')
  async handleMuteUser(client: Socket, data: any): Promise<void> {
    try {
      const {channelId, targetId, time} = data;
      if ((await this.chanServices.isAdmin(channelId, client.data.user.id)) === false) {
        return ;
      } else if ((await this.chanServices.isOwner(channelId, targetId)) === true) {
        return ;
      }
      await this.chanServices.muteUser(channelId, targetId, time);
      const user = await this.userServices.findUserById(targetId);
      this.server.to(user.chatSocket)
        .emit('muted', { channelId: channelId, time: time });
    } catch (e) {
      this.logger.log(e);
    }
  }

  @SubscribeMessage('banUser')
  async handleBanUser(client: Socket, data: any): Promise<void> {
    try {
      const {channelId, userId} = data;
      if ((await this.chanServices.isAdmin(channelId, client.data.user.id)) === false) {
        return ;
      } else if ((await this.chanServices.isOwner(channelId, userId)) === true) {
        return ;
      }
      const user = await this.userServices.findUserById(userId + '');
      if (!user) {
        return ;
      }
      const channel = await this.chanServices.banUser(channelId, user);
      const connectedUsers: User[] = await this.chanServices.getAllChanUser(channelId);
      for (const coUser of connectedUsers) {
        this.server.to(coUser.chatSocket).emit('userChannelModif', { id: channelId });
      }
      this.server.to(user.chatSocket).emit('newlyBanned', { id: channelId, name: channel.name });
    } catch (e) {
      this.logger.log(e);
    }
  }

  @SubscribeMessage('giveAdminRights')
  async handleGiveAdminRights(client: Socket, data: any): Promise<void> {
    try {
      const {channelId, userId} = data;
      if ((await this.chanServices.isAdmin(channelId, client.data.user.id)) === false) {
        return ;
      } 
      const res = await this.chanServices.addAdmin(channelId, userId);
      if (!res) {
        return;
      }
      const user = await this.userServices.findUserById(userId);
      this.server.to(user.chatSocket).emit('newlyAdmin', { channelId: channelId });
      const connectedUsers: User[] = await this.chanServices.getAllChanUser(channelId);
      for (const coUser of connectedUsers) {
        this.server.to(coUser.chatSocket).emit('userChannelModif', { id: channelId });
      }
    } catch (e) {
      this.logger.log(e);
    }

  }

  /****** Emit alone functions ******/

  async emitChannelModif(channelId: string) {
    const connectedUsers: User[] = await this.chanServices.getAllChanUser(channelId);
    for (const user of connectedUsers) {
      console.log(user.chatSocket);
      this.server.to(user.chatSocket).emit('userChannelModif', { id: channelId });
    }
  }

  async sendUsersList() {
    const users = await this.userServices.getUsers();
    this.server.emit('usersList', users);
  }

  @SubscribeMessage('getUsersList')
  async sendUsersListToOne(client: Socket) {
    const users = await this.userServices.getUsers();
    client.emit('usersList', users);
  }

  /******* Emit service ********/

  @SubscribeMessage('emitMyChannels')
  async handleEmitMyChannels(client: Socket) {
    this.logger.log('Get channels joined by user');
    const channels: FrontChannelI[] = await this.chanServices.getChannelsFromUser(client.data.user.id);
    for (let channel of channels) {
      channel.blocked = false;
      if (channel.type === ChannelType.PM) {
        let user: User = client.data.user;
        let usersId = channel.name.split('/').map(Number);
        let targetId = usersId[0];
        if (usersId[0] === user.id) {
          targetId = usersId[1];
        }
        let index = user.blockedIds.indexOf(targetId);
        if (index !== -1) {
          channel.blocked = true;
        }
      }
    }
    client.emit('channelList', channels);
  }

  @SubscribeMessage('getChannelUsers')
  async handleGetChannelUsers(client: Socket, params: any): Promise<any> {
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
  async handleGetChannelMessages(client: Socket, params: any) {
    const user = await this.userServices.findUserById(client.data.user.id);
    this.logger.log('Get channel messages');
    if (!await this.chanServices.userIsInChannel(user, params.id)) {
      return;
    }
    const messages = await this.messageServices.findMessagesForChannel(params.id, user);
    client.emit('channelMessages', { id: params.id, messages: messages });
  }

  @SubscribeMessage('getJoinableChannels')
  async handleGetJoinableChannels(client: Socket, targetId: number) {
    try {
      this.logger.log('retrieving Joinable Channels');
      const channels: FrontChannelI[] = await this.chanServices.filterJoinableChannel(targetId);
      client.emit('joinableChannels', channels);
    } catch (e) {
      client.disconnect();
      this.logger.log(e);
    }
  }

  @SubscribeMessage('getConnectedUsers')
  async handleGetConnectedUsers(client: Socket) {
    try {
      let connectedUsers = await this.userServices.getConnectedUsers();
      const clientId = client.data.user.id;
      for (const [i, value] of connectedUsers.entries()) {
        if (value.id === clientId) {
          connectedUsers.splice(i, 1);
          break ;
        }
    }
      client.emit('connectedUsers', connectedUsers);
    } catch(e) {
      client.disconnect();
      this.logger.log(e);
    } 
  }

  /*** Game invitation system ***/

  @SubscribeMessage('sendGameInvit')
  async handleSendGameInvit(client: Socket, params: { channelId: string }) {
    try {
      const socket = await this.chanServices.retrieveOtherSocket(client.data.user.id, params.channelId);
      if (socket === null) { 
        client.emit('userAbsent');
        return;
      }
      this.server.to(socket).emit('gameInvitation', { id: client.data.user.id });
    } catch (e) {
      this.logger.log(e);
    }
  } 

  @SubscribeMessage('endGameInvit')
  async handleEndGameInvit(client: Socket, params: { channelId: string }) {
    try {
      const socket = await this.chanServices.retrieveOtherSocket(client.data.user.id, params.channelId);
      if (socket === null) { 
        return;
      }
      this.server.to(socket).emit('endGameInvit', { id: client.data.user.id });
    } catch (e) {
      this.logger.log(e);
    }
  } 

  @SubscribeMessage('acceptGameInvit')
  async handleAcceptGameInvit(client: Socket, params: { inviter: number, socketId: any}) {
    try {
      const user = await this.userServices.findUserById('' + params.inviter);
      if (!user || user.chatSocket === null) {
        return ;
      }
      this.server.to(user.chatSocket).emit('gameAccepted', { inviter: params.inviter, socketId: params.socketId });
    } catch (e) {
      this.logger.log(e);
    }

  }
}
