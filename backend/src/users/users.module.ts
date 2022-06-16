import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AvatarsService } from 'src/users/services/avatars.service';
import { Avatar } from './entities/avatar.entity';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { ChatGateway } from '../chat/chat.gateway';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Avatar]),
    ConfigModule,
    forwardRef(() => AuthModule),
    forwardRef(() => ChatModule),    
  ],
  controllers: [UsersController],
  providers: [UsersService, AvatarsService, ChatGateway],
  exports: [UsersService],
})
export class UsersModule {}
