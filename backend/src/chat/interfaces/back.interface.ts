import { User } from 'src/users/entities/user.entity';
import { ChannelType } from 'src/users/enums/channelType.enum';
import { ERoles } from 'src/users/enums/roles.enum';

export interface ChannelI {
  id?: string;
  name?: string;
  users?: User[];
  banned?: number[];
  password?: string;
  type?: ChannelType;
  avatar?: Uint8Array;
}

export interface RolesI {
  userId: number;
  role?: ERoles;
  muteDate?: Date;
  channel?: ChannelI;
}

export interface MessageI {
  id?: number;
  content: string;
  user: User;
  channel: ChannelI;
  date: Date;
}

