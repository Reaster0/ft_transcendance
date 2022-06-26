import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection,
  OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UsersService } from '../users/services/users.service';
import { AuthService } from '../auth/auth.service';
import { Status } from '../users/enums/status.enum';
import { GamesService } from './games.service';
import { Match, State } from './interfaces/match.interface';
import { v4 as uuid } from 'uuid';
import { Logger } from '@nestjs/common';
import { Features } from './interfaces/match.interface';

const queue: Array<Socket> = []; // Array of clients waiting for opponent
const features: Array<Features> = []; // Array of features for ball size and speed
const matchs: Map<string, Match> = new Map(); // Array of current match identified by uid
const watchers: Array<Socket> = []; // Array of clients waiting to 
const fromChat: Array<string> = [];

@WebSocketGateway({ cors: { origin: '*', credentials: true }, credentials: true, namespace: '/game'})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect 
{
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly gamesService: GamesService,
  ) {}

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('GameGateway');

  afterInit(server: any) {
    this.logger.log('Init game gateway');
  }

  async handleConnection(client: Socket) {
    try {
      this.logger.log('Connection establishing for game');
      const user = await this.authService.getUserBySocket(client);
      if (!user) {
        this.logger.log('User not retrieved');
        return client.disconnect();
      }
      client.data.user = user;
      this.logger.log('User connected: ' + user.nickname);
      return client.emit('connectedToGame');
    } catch {
      return client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log('Disconnection from game');
    try {
      if (client.data.user) {
        this.logger.log('User leaving: ' + client.data.user.username);
        if (fromChat.indexOf(client.id) === -1) {
          await this.usersService.changeStatus(client.data.user, Status.OFFLINE, null);
        }
        if (this.gamesService.isWaiting(client, queue) === true) {
          const index = queue.indexOf(client);
          queue.splice(index, 1);
        } else if (this.gamesService.isPlaying(client, matchs) === true) {
          const match = this.gamesService.getMatch(client, matchs);
          match.state = State.FINISHED;
          const opponent = this.gamesService.getOpponent(client, match);
          if (opponent && opponent.socket && opponent.socket.connected === true) {
            opponent.socket.emit('opponentDisconnected');
          }
          match.winner = opponent;
          this.gamesService.finishGame(this.server, match, matchs);
        } else if (this.gamesService.wantToWatch(client, watchers) === true) {
          const index = watchers.indexOf(client);
          watchers.splice(index, 1);
        }
      }
    } catch (e) {
      this.logger.log(e);
    }
    client.disconnect();
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(client: Socket, data: { ballSize: string, ballSpeed: string }) {
    try {
      if (!client.data.user) {
        return client.disconnect();
      }
      await this.usersService.changeStatus(client.data.user, Status.PLAYING, null);
      if (this.gamesService.isWaiting(client, queue) === true ||
          this.gamesService.isPlaying(client, matchs) === true) {
        return;
      }
      if (!data || !data.ballSize || !data.ballSpeed) {
        client.emit('FeaturesIncorrect');
        return;
      }
      const feature = this.gamesService.validFeatures(data.ballSize, data.ballSpeed);
      if (feature === null) {
        client.emit('FeaturesIncorrect');
        return;
      }
      features.push(feature);
      queue.push(client);
      if (queue.length >= 2) {
        const matchId = uuid();
        const newMatch = this.gamesService.setMatch(matchId, queue.splice(0, 2), features.splice(0, 2));
        matchs.set(matchId, newMatch);
        console.log('here');
        this.gamesService.sendToPlayers(newMatch,'foundMatch', newMatch.matchId);
        this.gamesService.waitForPlayers(this.server, newMatch, matchs);
      }
    } catch {
      return client.disconnect();
    }
  }

  @SubscribeMessage('fromChat')
  handleFromChat(client: Socket) {
    try {
      if (!client.data.user) {
        return client.disconnect();
      }
      fromChat.push(client.id);
    } catch {
      return client.disconnect();
    }
  }   

  @SubscribeMessage('invitToGame')
  async handleInvitToGame(client: Socket, data : { opponentSocketId: string, ballSize: string, ballSpeed: string }) {
    try {
      const index = fromChat.indexOf(client.id);
      fromChat.splice(index, 1);
      const allSockets = await this.server.fetchSockets();
      let opponent = null;
      for (let socket of allSockets) {
        if (socket.data.id === data.opponentSocketId) {
          opponent = socket;
        }
      }
      if (!client.data.user || !opponent.data.user) {
        opponent.disconnect();
        client.disconnect();
        return;
      }
      if (this.gamesService.isPlaying(client, matchs) === true
        || this.gamesService.isPlaying(opponent, matchs) === true) {
        return;
      }
      await this.usersService.changeStatus(client.data.user, Status.PLAYING, null);
      await this.usersService.changeStatus(opponent.data.user, Status.PLAYING, null);
      if (!data.ballSize || !data.ballSpeed) {
        client.emit('FeaturesIncorrect');
        return;
      }
      const feature = this.gamesService.validFeatures(data.ballSize, data.ballSpeed);
      if (feature === null) {
        client.emit('FeaturesIncorrect');
        return;
      }
      if (opponent.data.user.id === client.data.user.id) {
        client.emit('requestError');
        return client.disconnect();
      }
      const featureArray = [];
      featureArray.push(feature);
      const matchId = uuid();
      const users = [];
      users.push(client);
      users.push(opponent);
      const newMatch = this.gamesService.setMatch(matchId, users, featureArray);
      matchs.set(matchId, newMatch);
      this.gamesService.sendToPlayers(newMatch, 'foundMatch', newMatch.matchId);
      this.gamesService.waitForPlayers(this.server, newMatch, matchs);
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('acceptGame')
  handleAcceptGame(client: Socket, matchId: string) {
    try {
      const match = matchs.get(matchId);
      if (!client.data.user) {
        return client.disconnect();
      } else if (typeof(match) === undefined) {
        client.emit('requestError');
        return;
      }
      if (this.gamesService.isPlayer(client, match) === false) {
        client.emit('requestError');
        return;
      }
      for (const user of match.readyUsers) {
        if (user.id === client.data.user.id) {
          return;
        }
      }
      client.join(matchId);
      match.readyUsers.push(client.data.user);
      if (match.readyUsers.length >= 2) {
        match.state = State.STARTING;
        this.gamesService.startGame(this.server, match, watchers, matchs);
      }
    } catch {
      return client.disconnect();
    }
  }

  @SubscribeMessage('gameInput')
  handleGameInput(client: Socket, data: { matchId: string; input: string }) {
    try {
      if (!client.data.user) {
        return client.disconnect();
      }
      const match = matchs.get(data.matchId);
      if (typeof(match) === undefined) {
        client.emit('requestError');
        return;
      }
      this.gamesService.playerInput(client, match, data.input);
    } catch {
      return client.disconnect();
    }
  }

  @SubscribeMessage('watchGame')
  async handleWatchGame(client: Socket) {
    try {
      if (!client.data.user) {
        return client.disconnect();
      }
      if (
        this.gamesService.isWaiting(client, queue) === true ||
        this.gamesService.isPlaying(client, matchs) === true
      ) {
        return;
      }
      await this.usersService.changeStatus(client.data.user, Status.PLAYING, null);
      watchers.push(client);
      this.gamesService.listGamesToOne(client, matchs);
    } catch {
      return client.disconnect();
    }
  }

  @SubscribeMessage('getMatchByUser')
  async handleGetMatchByUser(client: Socket, data: { playerName: string }) {
    try {
      if (!client.data.user) {
        return client.disconnect();
      }
      console.log('data: ' + data.playerName);
      if (
        this.gamesService.isWaiting(client, queue) === true ||
        this.gamesService.isPlaying(client, matchs) === true
      ) {
        return;
      }
      const matchId = this.gamesService.findMatchIdByPlayer(client, matchs, data.playerName);
      if (matchId === null) { 
        client.emit('notAvailable', { player: data.playerName });
        return ;
      }
      client.emit('matchId', { matchId: matchId });
    } catch {
      return client.disconnect();
    }    
  }

  @SubscribeMessage('followGame')
  handleFollowGame(client: Socket, matchId: string) {
    try {
      if (!client.data.user) {
        return client.disconnect();
      }
      if (this.gamesService.isWaiting(client, queue) === true ||
        this.gamesService.isPlaying(client, matchs) === true) {
        return;
      }
      const index = watchers.indexOf(client);
      if (index === -1) {
        return;
      }
      const match = matchs.get(matchId);
      if (match === undefined || match.state != State.ONGOING && match.state != State.SCORE) {
        return;
      }
      this.gamesService.startWatchGame(client, match);
      watchers.splice(index, 1);
      client.join(matchId);
    } catch {
      return client.disconnect();
    }
  }
}
