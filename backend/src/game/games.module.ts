import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GameGateway } from './games.gateway';
import { UsersModule } from 'src/users/users.module';
import { PongService } from './pong.service';
import { GameHistory } from './entities/gamehistory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([GameHistory]), AuthModule],
  controllers: [GamesController],
  providers: [GamesService, GameGateway, PongService],
})
export class GamesModule {}
