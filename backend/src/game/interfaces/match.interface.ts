import { Player } from './player.interface';
import { Socket } from 'socket.io';
import { User } from '../../users/entities/user.entity';

export enum State {
	SETTING = 'SETTING',
	STARTING = 'STARTING',
	ONGOING = 'ONGOING',
	FINISHED = 'FINISHED',
}

export interface Match {
	matchId:		string;
	players:		Array<Player>;
	readyUsers:		Array<User>;
	watchers: 		Array<Socket>;
	state:			State;
	winner:			Player;
}
