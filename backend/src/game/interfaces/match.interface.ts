import { Player } from './player.interface';
import { User } from '../../users/entities/user.entity';
import { Pong } from './pong.interface';

export interface Features {
  ballSize: string,
  ballSpeed: string,
}

export enum State {
  SETTING = 'SETTING',
  STARTING = 'STARTING',
  ONGOING = 'ONGOING',
  SCORE = 'SCORE',
  PAUSED = 'PAUSED',
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
