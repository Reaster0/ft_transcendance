import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/users/interfaces/jwt-payload.interface';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { ChanI } from '../interfaces/channel.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Chan } from '../entities/chan.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SocketConnected } from '../entities/socketConnected';

@Injectable()
export class ChatServices {
  constructor(){}


}
