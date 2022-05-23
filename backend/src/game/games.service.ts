import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UsersService } from '../users/services/users.service';
import { Match } from './interfaces/match.interface';
import { Player } from './interfaces/player.interface';

@Injectable()
export class GamesService {
	constructor(
		private readonly usersService: UsersService
	) {}

	isWaiting(client : Socket, queue: Array<Socket>): boolean {
		if (queue.includes(client)) {
			return true;
		}
		for (let sock of queue) {
			if (sock.data.user.id == client.data.id) {
				return true;
			}
		}
		return false;
	}

	isPlaying(client: Socket, matchs: Map<string, Match>): boolean {
		for (let currMatch of matchs.values()) {
			const matchPlayers = currMatch.players;
			for (let currPlayer of matchPlayers) {
				if (client === currPlayer.socket || client.data.user.id === currPlayer.user.id) {
					return true;
				}
			}
		}
		return false;
	}

	isPlayer(client: Socket, match: Match) : boolean {
		for(let player of match.players) {
			if (client.data.user.id === player.user.id) {
				return true;
			}
		}
		return false;
	}

	setPlayer(client: Socket) : Player {
		const player: Player = {
			socket: client,
			user: client.data.user,
			score: 0,
		}
		return player;
	}

	setMatch(matchId: string, clients: Array<Socket>) : Match {
		const matchPlayers: Array<Player> = new Array();
		for (let client of clients) {
			let newPlayer = this.setPlayer(client);
			matchPlayers.push(newPlayer);
		}
		const match: Match = {
			matchId: matchId,
			players: matchPlayers,
			readyUsers: new Array(),
			watchers: new Array(),
		};
		return match;
	}

	sendToPlayers(match: Match, toSend: string, ...args) {
		for (let player of match.players) {
			player.socket.emit(toSend, ...args); // emit more info ?
		}
	}
}
