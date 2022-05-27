import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io"
import { parse } from 'cookie'
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/users/interfaces/jwt-payload.interface";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/services/users.service";

@Injectable()
export class ChatServices {
    constructor (
        private readonly jwtService: JwtService,
        private readonly userService: UsersService
    ){}
}