import { User } from 'src/users/entities/user.entity';
import { ChanI } from './channel.interface';

export interface MessageI {
  id?: number;
  content: string;
  user: User;
  channel: ChanI;
  date: Date;
  update_at: Date;
}
