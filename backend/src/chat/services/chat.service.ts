import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io"
import { parse } from 'cookie'
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/users/interfaces/jwt-payload.interface";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/services/users.service";
import { UserFA } from "../interfaces/userFa.interface";

@Injectable()
export class ChatServices {
    constructor (
        private readonly jwtService: JwtService,
        private readonly userService: UsersService
    ){}

    async getUser(client: Socket): Promise<UserFA> {
        const cookie = client.handshake.headers['cookie'];
		const { jwt: token } = parse(cookie);
		const payload: JwtPayload = this.jwtService.verify(token, {secret: process.env.JWT_SECRET});
		const { username, twoFA} = payload;
		const user: User = await this.userService.findUserByUsername(username);
		return { user, twoFA};
    }
}