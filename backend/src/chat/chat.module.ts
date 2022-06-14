import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChanUser } from './entities/channelUser.entity';
import { Message } from './entities/message.entity';
import { ChanServices } from './services/chan.service';
import { ConnectService } from './services/connect.service';
import { MessageService } from './services/message.service';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat.controller';
import { UrlGeneratorModule } from 'nestjs-url-generator';
import { Channel } from './entities/channel.entity';
import { ChanUserService } from './services/chanUser.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      ChanUser,
      Message,
    ]),
    UsersModule,
    AuthModule,
    UrlGeneratorModule.forRoot({
      secret: 'thisIsNotASecret',
      appUrl: 'http://localhost:3000', //or maybe backend.... will see
    })
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChanServices,
    ChanUserService,
    ConnectService,
    MessageService,
  ],
  exports: [ChatGateway],
})
export class ChatModule {}
