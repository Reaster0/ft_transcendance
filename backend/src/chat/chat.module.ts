import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { Chan } from './entities/channel.entity';
import { ChanUser } from './entities/channelUser.entity';
import { Message } from './entities/message.entity';
import { SocketConnected } from './entities/socketsUser';
import { SocketJoined } from './entities/sockets-connected-to-channel';
import { ChanServices } from './services/chan.service';
import { ChatServices } from './services/chat.service';
import { ConnectService } from './services/connect.service';
import { MessageService } from './services/message.service';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat.controller';
import { UrlGeneratorModule } from 'nestjs-url-generator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chan,
      ChanUser,
      Message,
      SocketConnected,
      SocketJoined,
    ]),
    UsersModule,
    AuthModule,
    UrlGeneratorModule.forRoot({
      secret: 'thisIsNotASecret',
      appUrl: process.env.FRONTEND, //or maybe backend.... will see
    })
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChanServices,
    ChatServices,
    ConnectService,
    MessageService,
  ],
  exports: [ChatGateway],
})
export class ChatModule {}
