import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { Message } from './entities/message.entity';
import { ChanServices } from './services/chan.service';
import { MessageService } from './services/message.service';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat.controller';
import { UrlGeneratorModule } from 'nestjs-url-generator';
import { Channel } from './entities/channel.entity';
import { Roles } from './entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      Roles,
      Message,
    ]),
    forwardRef(() => UsersModule),
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
    MessageService,
  ],
  exports: [ChatGateway, ChanServices, MessageService],
})
export class ChatModule {}
