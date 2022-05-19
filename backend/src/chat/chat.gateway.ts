import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket} from 'socket.io';
import { ChatServices } from './services/chat.service';

@WebSocketGateway({namespace: '/chat', cors: {origin: process.env.FRONTEND, credentials: true}}) //maybe chage origin
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private readonly chatServices: ChatServices,
  ) {}

  @WebSocketServer() server: Server
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
   this.server.emit('msgToClient', payload);
  }
 
  handleConnection(client: Socket) {
   //const user: 
   this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
   this.logger.log(`Client disconnected: ${client.id}`);
  }

  afterInit(server: Server) {
   this.logger.log('Init');
  }
}