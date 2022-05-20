import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UsersService } from '../users/services/users.service';
import { AuthService } from '../auth/auth.service';
import { Status } from '../common/enums/status.enum';
import { User } from '../users/entities/user.entity';

@WebSocketGateway({ cors: true, namespace: '/game' })
export class GameGateway {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
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
			return client.emit('connected'); // maybe emit something else ?
		} catch {
			return client.disconnect();
		}
	}

	async handleDisconnect(client: Socket) {
		if (client.data.user) {
			await this.usersService.changeStatus(client.data.user, Status.OFFLINE);
		}
		client.disconnect();
	}

	@SubscribeMessage('joinGame')
	handleJoinQueue(client: Socket, user: User) {
		try {
			if (client.data.user) {
				this.gameService
			}
		}
	}

	@SubscribeMessage('watchGame')
	handleWatchMatch(client: Socket, user: User) {

	}
}
