import { User } from 'src/users/entities/user.entity';
import { ChannelI } from './channel.interface';

export interface MessageI {
  id?: number;
  content: string;
  user: User;
  channel: ChannelI;
  date: Date;
  update_at: Date;
}
