import { User } from 'src/users/entities/user.entity';

export interface ChannelI {
  id?: string;
  channelName?: string;
  date?: Date;
  owner?: number; //owner id
  users?: User[];
  adminUsers?: number[];
  password?: string;
  publicChannel?: boolean;
  avatar?: Uint8Array;
}
