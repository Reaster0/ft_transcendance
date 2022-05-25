import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/services/users.service';
import { Match, State } from './interfaces/match.interface';
import { Player } from './interfaces/player.interface';
import { Pong } from './interfaces/pong.interface';
import { PongService } from './pong.service';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class GamesService {
	constructor(
		private readonly usersService: UsersService,
		private readonly pongService: PongService,
		private schedulerRegistry: SchedulerRegistry,
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
			pong: this.pongService.initPong(),
			state: State.SETTING,
			winner: undefined,
			interval: null,
		};
		return match;
	}

	sendToPlayers(match: Match, toSend: string, ...args) {
		for (let player of match.players) {
			player.socket.emit(toSend, ...args); // emit more info ?
		}
	}

	playerWon(match: Match, player: Player) {
		if (player.score == 10) {
			match.winner = player;
			return true;
		}
		return false;
	}

	scoreUp(match: Match, player: Player) {
		player.score += 1;
		if (this.playerWon(match, player) == true) {
			match.state = State.FINISHED;
		}
	}

	startGame(server: Server, match: Match) {
		server.to(match.matchId).emit('gameStarting');
		match.state = State.ONGOING;
		//const interval = this.schedulerRegistry.getInterval();
		this.refreshGame(match);
	}

	@Interval('match', 50) // in ms
	refreshGame(match: Match) {

	}

	clear
}
