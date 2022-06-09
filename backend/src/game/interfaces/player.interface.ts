import { User } from '../../users/entities/user.entity';
import { Socket } from 'socket.io';

export interface Player {
  socket: Socket;
  user: User;
  score: number;
  lastAction: number,
}
