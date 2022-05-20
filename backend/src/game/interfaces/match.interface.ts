import { Player } from './player.interface';
import { Socket } from 'socket.io';

export interface Match {
	players: Array<Player>;
	watchers: Array<Socket>;
}
