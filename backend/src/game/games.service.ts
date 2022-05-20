import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UsersService } from '../users/services/users.service';
import { Match } from './interfaces/match.interface';

let queue: Array<Socket> = new Array(); // Array of clients waiting for opponent
let matchs: Array<Match> = new Array(); // Array of current match

@Injectable()
export class GamesService {
	constructor(
		private readonly usersService: UsersService,
	) {}

	joinQueue(client: Socket) {
		queue.push(client);
		if (queue.length >= 2) {
			//Create and join match
		}
	}

	joinMatch(client: Socket, match: Match) {

	}



	watchMatch(client: Socket, match: Match) {

	}
}
