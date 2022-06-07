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
      this.logger.log('Connection establishing');
      const user = await this.authService.getUserBySocket(client);
      if (!user) {
        this.logger.log('User not retrieved');
        return client.disconnect();
      }
      await this.usersService.changeStatus(user, Status.PLAYING);
      client.data.user = user;
      this.logger.log('User connected: ' + user.nickname);
      return client.emit('connectedToGame'); // maybe emit user ?
    } catch {
      return client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log('Disconnection');
    if (client.data.user) {
      this.logger.log('User leaving: ' + client.data.user.username);
      await this.usersService.changeStatus(client.data.user, Status.OFFLINE);
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
    return client.disconnect();
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(client: Socket, data: { ballSize: string, ballSpeed: string }) {
    try {
      if (!client.data.user) {
        return client.disconnect();
      }
      if (this.gamesService.isWaiting(client, queue) === true ||
          this.gamesService.isPlaying(client, matchs) === true) {
        return;
      }
      if (!data.ballSize || !data.ballSpeed) {
        client.emit('MissingFeatures');
        return;
      }
      const feature = this.gamesService.validFeatures(data.ballSize, data.ballSpeed);
      if (feature === undefined) {
        client.emit('FeaturesIncorrect');
        return;
      }
      features.push(feature);
      queue.push(client);
      if (queue.length >= 2) {
        const matchId = uuid();
        const newMatch = this.gamesService.setMatch(matchId, queue.splice(0, 2), features.splice(0, 2));
        matchs.set(matchId, newMatch);
        this.gamesService.sendToPlayers(newMatch,'foundMatch', newMatch.matchId);
        this.gamesService.waitForPlayers(this.server, newMatch, matchs);
      }
    } catch {
      return client.disconnect();
    }
  }

  @SubscribeMessage('invitToGame')
  handleInvitToGame(client: Socket, opponent: Socket, data: { ballSize: string, ballSpeed: string }) {
    try {
      if (!client.data.user || !opponent.data.user) {
        opponent.emit('error');
        client.emit('error');
        opponent.disconnect();
        client.disconnect();
        return;
      }
      if (this.gamesService.isPlaying(client, matchs) === true
        || this.gamesService.isPlaying(opponent, matchs) === true) {
        return;
      }
      if (!data.ballSize || !data.ballSpeed) {
        client.emit('MissingFeatures');
        return;
      }
      const feature = this.gamesService.validFeatures(data.ballSize, data.ballSpeed);
      if (feature === undefined) {
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
      return client.disconnect();
    }
  }

  @SubscribeMessage('acceptGame')
  handleAcceptGame(client: Socket, matchId: string) {
    try {
      const match = matchs.get(matchId);
      if (!client.data.user) {
        return client.disconnect();
      } else if (match == undefined) {
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
      if (match == undefined) {
        client.emit('requestError');
        return;
      }
      this.gamesService.playerInput(client, match, data.input);
    } catch {
      return client.disconnect();
    }
  }

  @SubscribeMessage('watchGame')
  handleWatchGame(client: Socket) {
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
      watchers.push(client);
      this.gamesService.listGamesToOne(client, matchs);
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
      if (match.state != State.ONGOING && match.state != State.SCORE) {
        return;
      }
      watchers.splice(index, 1);
      client.join(matchId);
    } catch {
      return client.disconnect();
    }
  }
}
