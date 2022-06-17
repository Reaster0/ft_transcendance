import { User } from 'src/users/entities/user.entity';

export interface ChannelI {
  id?: string;
  name?: string;
  owner?: number; //owner id
  admins?: number[];
  users?: User[];
  password?: string;
  type?: string;
  avatar?: Uint8Array;
}

export interface MutedI {
  userId: number;
  date: Date;
  channel: ChannelI;
}

export interface MessageI {
  id?: number;
  content: string;
  user: User;
  channel: ChannelI;
  date: Date;
}

