import { User } from 'src/users/entities/user.entity';

export interface ChannelI {
  id?: string;
  channelName?: string;
  owner?: number; //owner id
  users?: User[];
  adminUsers?: number[]; //not sure
  password?: string;
  publicChannel?: boolean;
  avatar?: Uint8Array;
}
