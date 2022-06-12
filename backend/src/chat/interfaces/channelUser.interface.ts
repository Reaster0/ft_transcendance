import { User } from 'src/users/entities/user.entity';
import { ChannelI } from './channel.interface';

export interface ChanUserI {
  id?: string;
//////////////////  userID: number;
  mute?: Date;
  isBan?: boolean;
  isAdmin?: boolean;
  userID: number;
  channel: ChannelI;
//  user: User;

}
