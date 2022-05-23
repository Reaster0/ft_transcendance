import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GameGateway } from './games.gateway';

@Module({
  controllers: [GamesController],
  providers: [GamesService, GameGateway]
})
export class GamesModule {}
