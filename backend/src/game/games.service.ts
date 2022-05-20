import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { UsersService } from '../users/services/users.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GamesService {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService
	) {}


}
