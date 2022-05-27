import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/services/users.service';
import { Match, State } from './interfaces/match.interface';
import { Player } from './interfaces/player.interface';
import { Pong } from './interfaces/pong.interface';
import { PongService } from './pong.service';
import { Point } from './interfaces/pong.interface';

@Injectable()
export class GamesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly pongService: PongService,
  ) {}

  isWaiting(client: Socket, queue: Array<Socket>): boolean {
    if (queue.includes(client)) {
      return true;
    }
    for (const sock of queue) {
      if (sock.data.user.id === client.data.id) {
        return true;
      }
    }
    return false;
  }

  isPlaying(client: Socket, matchs: Map<string, Match>): boolean {
    for (const currMatch of matchs.values()) {
      const matchPlayers = currMatch.players;
      for (const currPlayer of matchPlayers) {
        if (
          client === currPlayer.socket ||
          client.data.user.id === currPlayer.user.id
        ) {
          return true;
        }
      }
    }
    return false;
  }

  getMatch(client: Socket, matchs: Map<string, Match>): Match {
    for (const currMatch of matchs.values()) {
      const matchPlayers = currMatch.players;
      for (const currPlayer of matchPlayers) {
        if (
          client === currPlayer.socket ||
          client.data.user.id === currPlayer.user.id
        ) {
          return currMatch;
        }
      }
    }
    return undefined;
  }

  getOpponent(client: Socket, match: Match): Player {
    for (const player of match.players) {
      if (client != player.socket && client.data.user.id != player.user.id) {
        return player;
      }
    }
    return undefined;
  }

  wantToWatch(client: Socket, watchers: Array<Socket>) {
    if (watchers.includes(client)) {
      return true;
    }
    for (const sock of watchers) {
      if (sock.data.user.id === client.data.id) {
        return true;
      }
    }
    return false;
  }

  isPlayer(client: Socket, match: Match): boolean {
    for (const player of match.players) {
      if (client.data.user.id === player.user.id) {
        return true;
      }
    }
    return false;
  }

  setPlayer(client: Socket): Player {
    const player: Player = {
      socket: client,
      user: client.data.user,
      score: 0,
    };
    return player;
  }

  setMatch(matchId: string, clients: Array<Socket>): Match {
    const matchPlayers: Array<Player> = [];
    for (const client of clients) {
      const newPlayer = this.setPlayer(client);
      matchPlayers.push(newPlayer);
    }
    const match: Match = {
      matchId: matchId,
      players: matchPlayers,
      readyUsers: [],
      pong: this.pongService.initPong(),
      state: State.SETTING,
      winner: undefined,
    };
    return match;
  }

  waitForPlayers(server: Server, match: Match, matchs: Map<string, Match>) {
    const that = this;
    const timer = setTimeout(
      function () {
        that.abortGame(server, match, matchs);
      },
      10000,
      server,
      match,
      matchs,
    );
  }

  abortGame(server: Server, match: Match, matchs: Map<string, Match>) {
    if (match.state === State.SETTING) {
      this.sendToPlayers(match, 'foundMatch', { matchId: null });
      server.socketsLeave(match.matchId);
      matchs.delete(match.matchId);
    }
  }

  sendToPlayers(match: Match, toSend: string, ...args) {
    for (const player of match.players) {
      player.socket.emit(toSend, ...args);
    }
  }

  sendToWatchers(watchers: Array<Socket>, toSend: string, ...args) {
    for (const watcher of watchers) {
      watcher.emit(toSend, ...args);
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

  startGame(
    server: Server,
    match: Match,
    watchers: Array<Socket>,
    matchs: Map<string, Match>,
  ) {
    // Send: 'beReady' + player position  on field + match Id + opponent nickname
    match.players[0].socket.emit('beReady', {
      pos: 'left',
      matchId: match.matchId,
      opponent: match.players[1].user.nickname,
    });
    match.players[1].socket.emit('beReady', {
      pos: 'right',
      matchId: match.matchId,
      opponent: match.players[0].user.nickname,
    });
    let count = 3;
    const countdown = setInterval(
      function () {
        match.players[0].socket.emit('test');
        server.to(match.matchId).emit('countdown', {
          countdown: String(count),
          matchId: match.matchId,
        });
        count--;
        if (count === 0) {
          clearInterval(countdown);
        }
      },
      1000,
      server,
      match,
    );
    match.state = State.ONGOING;
    this.listGamesToAll(watchers, matchs);
    server.to(match.matchId).emit('gameStarting', { matchId: match.matchId });
    const intervalId = setInterval(
      () => {
        if (match.state === State.FINISHED) {
          clearInterval(intervalId);
          this.listGamesToAll(watchers, matchs);
          this.finishGame(server, match, matchs);
        } else {
          this.refreshGame(server, match);
        }
      },
      16,
      match,
      server,
      match,
    );
  }

  playerInput(client: Socket, match: Match, input: string) {
    if (
      this.isPlayer(client, match) === false ||
      (input != 'UP' && input != 'DOWN')
    ) {
      client.emit('requestError');
      return;
    }
    if (client.data.user.id === match.players[0].user.id) {
      this.pongService.movePaddle(match.pong.field, match.pong.paddleL, input);
    } else {
      this.pongService.movePaddle(match.pong.field, match.pong.paddleR, input);
    }
  }

  refreshGame(server: Server, match: Match) {
    this.pongService.calcBallPos(match.pong);
    server.to(match.matchId).emit('gameUpdate', {
      matchId: match.matchId,
      ball: this.getBallFeatures(match),
      paddles: this.getPaddlesFeatures(match),
    });
    const point = this.pongService.getScore(match.pong.field, match.pong.ball);
    let winner = false;
    if (point != Point.NONE) {
      if (point == Point.LEFT) {
        this.scoreUp(match, match.players[0]);
        if ((winner = this.playerWon(match, match.players[0])) === true) {
          match.winner = match.players[0];
        }
      } else {
        this.scoreUp(match, match.players[1]);
        if ((winner = this.playerWon(match, match.players[1])) === true) {
          match.winner = match.players[1];
        }
      }
      // Send : 'score' + score player left side + score player right side
      server.to(match.matchId).emit('score', {
        matchId: match.matchId,
        leftScore: match.players[0].score,
        rightScore: match.players[1].score,
      });
    }
    if (winner === true) {
      match.state = State.FINISHED;
    }
  }

  getBallFeatures(match: Match) {
    return {
      ball: {
        pos: { x: match.pong.ball.pos.x, y: match.pong.ball.pos.y },
        radius: match.pong.ball.radius,
      },
    };
  }

  getPaddlesFeatures(match: Match) {
    return {
      paddleL: {
        blcPos: {
          x: match.pong.paddleL.blcPos.x,
          y: match.pong.paddleL.blcPos.y,
        },
        width: match.pong.paddleL.width,
        length: match.pong.paddleL.length,
      },
      paddleR: {
        blcPos: {
          x: match.pong.paddleR.blcPos.x,
          y: match.pong.paddleR.blcPos.y,
        },
        width: match.pong.paddleR.width,
        length: match.pong.paddleR.length,
      },
    };
  }

  finishGame(server: Server, match: Match, matchs: Map<string, Match>) {
    server.to(match.matchId).emit('endGame', {
      matchId: match.matchId,
      winner: match.winner.user.nickname,
    });
    server.socketsLeave(match.matchId);
    // TODO set game inside DB
    matchs.delete(match.matchId);
  }

  listGamesToOne(client: Socket, matchs: Map<string, Match>) {
    client.emit('newList');
    for (const match of matchs.values()) {
      if (match.state === State.ONGOING) {
        client.emit('ongoingGame', {
          matchId: match.matchId,
          leftPlayer: match.players[0].user.nickname,
          rightPlayer: match.players[1].user.nickname,
        });
      }
    }
    client.emit('endList');
  }

  listGamesToAll(watchers: Array<Socket>, matchs: Map<string, Match>) {
    for (const client of watchers) {
      this.listGamesToOne(client, matchs);
    }
  }
}
