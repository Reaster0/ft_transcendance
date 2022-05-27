import { Player } from './player.interface';
import { Socket } from 'socket.io';
import { User } from '../../users/entities/user.entity';
import { Pong } from './pong.interface';
import { Interval } from '@nestjs/schedule';

export enum State {
  SETTING = 'SETTING',
  STARTING = 'STARTING',
  ONGOING = 'ONGOING',
  FINISHED = 'FINISHED',
}

export interface Match {
  matchId: string;
  players: Array<Player>;
  readyUsers: Array<User>;
  pong: Pong;
  state: State;
  winner: Player;
}
