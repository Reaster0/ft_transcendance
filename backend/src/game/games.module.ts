import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GameGateway } from './games.gateway';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from '../auth/auth.service';
import { PongService } from './pong.service';

@Module({
  imports: [UsersModule],
  controllers: [GamesController],
  providers: [GamesService, GameGateway, AuthService, PongService]
})
export class GamesModule {}
