import { SubscribeMessage, WebSocketGateway, WebSocketServer, 
		OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UsersService } from '../users/services/users.service';
import { AuthService } from '../auth/auth.service';
import { Status } from '../common/enums/status.enum';
import { User } from '../users/entities/user.entity';
import { GamesService } from './games.service';
import { Match } from './interfaces/match.interface';
import { uuid } from 'uuidv4';

let queue: Array<Socket> = new Array(); // Array of clients waiting for opponent
let matchs: Map<string, Match> = new Map(); // Array of current match identified by uid

@WebSocketGateway({ cors: true, namespace: '/game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
		private readonly gamesService: GamesService,
	) {}

	@WebSocketServer() server: Server;

	async handleConnection(client: Socket) {
		try {
			const user = await this.authService.getUserBySocket(client);
			if (!user) {
				return client.disconnect();
			}
			await this.usersService.changeStatus(user, Status.PLAYING);
			client.data.user = user;
			return client.emit('connected'); // maybe emit user ?
		} catch {
			// error ?
			return client.disconnect();
		}
	}

	async handleDisconnect(client: Socket) {
		// check if user is in game or in waiting queue
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
			if (this.gamesService.isWaiting(client, queue) == true || this.gamesService.isPlaying(client, matchs) == true) {
				return ;
			}
			queue.push(client);
			if (queue.length >= 2) {
				const matchId = uuid();
				const newMatch = this.gamesService.setMatch(matchId, queue.slice(0, 2));
				matchs.set(matchId, newMatch);
				this.gamesService.sendToPlayers(newMatch, 'foundMatch');
			}
		} catch {
			return client.disconnect();
		}
	}

	@SubscribeMessage('acceptGame')
	handleAcceptGame(client: Socket) {
		try {
			if (!client.data.user) {
				return client.disconnect();
			}
			// wait for other player ?
			// launch game ?
			// how to recuperate input ?
		} catch {
			return client.disconnect();
		}
	}


	//@SuscribeMessage('refuseGame')

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
