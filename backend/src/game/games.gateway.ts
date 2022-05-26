import { SubscribeMessage, WebSocketGateway, WebSocketServer, 
		OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UsersService } from '../users/services/users.service';
import { AuthService } from '../auth/auth.service';
import { Status } from '../common/enums/status.enum';
import { User } from '../users/entities/user.entity';
import { GamesService } from './games.service';
import { Match } from './interfaces/match.interface';
import { uuid } from 'uuidv4';
import { Logger } from '@nestjs/common';

let queue: Array<Socket> = new Array(); // Array of clients waiting for opponent
let matchs: Map<string, Match> = new Map(); // Array of current match identified by uid

@WebSocketGateway({ cors: { origin: '*' , credentials: true }, credentials: true, namespace: '/game' })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
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
			this.logger.log('connection established');
			const user = await this.authService.getUserBySocket(client);
			if (!user) {
				this.logger.log('user not found');
				return client.disconnect();
			}
			await this.usersService.changeStatus(user, Status.PLAYING);
			this.logger.log('status changed');
			client.data.user = user;
			this.logger.log('after modification');
			return client.emit('connected'); // maybe emit user ?
		} catch {
			// error ?
			return client.disconnect();
		}
	}

	async handleDisconnect(client: Socket) {
		// check if user is in game or in waiting queue, send a 'opponentLeft' if
		// was an opponent
		this.logger.log('disconnection');
		if (client.data.user) {
			await this.usersService.changeStatus(client.data.user, Status.OFFLINE);
		} else {
			// error ?
		}
		return client.disconnect();
	}

	@SubscribeMessage('joinGame')
	handleJoinGame(client: Socket) {
		try {
			if (!client.data.user) {
				return client.disconnect();
			}
			if (this.gamesService.isWaiting(client, queue) == false || this.gamesService.isPlaying(client, matchs) == true) {
				return ;
			}
			queue.push(client);
			if (queue.length >= 2) {
				const matchId = uuid();
				const newMatch = this.gamesService.setMatch(matchId, queue.slice(0, 2));
				matchs.set(matchId, newMatch);
				this.gamesService.sendToPlayers(newMatch, 'foundMatch', newMatch.matchId);
			}
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
				// throw error ?
				return ;
			}
			if (this.gamesService.isPlayer(client, match) === false) {
				client.emit('requestError');
				//throw error ?
				return ;
			}
			for (const user of match.readyUsers) {
				if (user.id === client.data.user.id) {
					return ;
				}
			}
			client.join(matchId);
			match.readyUsers.push(client.data.user);
			if (match.readyUsers.length >= 2) {
				// start game !
			}
		} catch {
			return client.disconnect();
		}
	}

	@SubscribeMessage('gameInput')
	handleGameInput(client: Socket, data: { matchId: string, input: string}) {
		const match = matchs.get(data.matchId);
		if (match == undefined) {
			client.emit('requestError');
			return ;
		}
		this.gamesService.playerInput(client, match, data.input);
	}

	@SubscribeMessage('watchGame')
	handleWatchGame(client: Socket, user: User) {
		try {
			if (!client.data.user) {
				return client.disconnect();
			}
			if (this.gamesService.isWaiting(client, queue) == true || this.gamesService.isPlaying(client, matchs) == true) {
				return ;
			}
			// TODO continue function by sending all current matches
		} catch {
			return client.disconnect();
		}
	}
}
