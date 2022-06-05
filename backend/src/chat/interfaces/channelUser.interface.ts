import { ChanI } from './channel.interface';

export interface ChanUserI {
  id?: string;
  userID: number;
  ban?: Date;
  mute?: Date;
  chan: ChanI;
}
