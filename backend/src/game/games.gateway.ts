import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer,
	OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UsersService } from '../users/services/users.service';
import { AuthService } from '../auth/auth.service';
import { Status } from '../common/enums/status.enum';

@WebSocketGateway({})

export class GameGateway {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
	) {}

	@WebSocketServer()
	server: Server;

	async handleConnection(client: Socket) {
		try {
			const user = await this.authService.getUserFromSocket(client);
			if (!user) {
				return client.disconnect();
			}
			await this.usersService.changeStatus(user, Status.PLAYING);
			// add user to game queue

		} catch {}
	}

	@SubscribeMessage('message_to_listen_to')
	function(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
		const sender = await this.authService.getUserFromSocket(client);
		this.server.sockets.emit('message_to_send', { data, sender });
	}
}
