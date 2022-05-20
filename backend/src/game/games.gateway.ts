import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer,
	OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({})
export class GameGateway {
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('message_to_listen_to')
	function(@MessageBody() data: string) {
		this.server.sockets.emit('message_to_send', data);
	}
}
