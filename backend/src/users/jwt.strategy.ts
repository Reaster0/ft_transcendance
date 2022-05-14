import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { AuthService } from "../auth/auth.service";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { UsersService } from "./users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UsersService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let accessToken = request?.cookies['jwt'];
          return accessToken;
        }
      ]),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    return this.userService.findUserByName(payload.nickname);
  }
}