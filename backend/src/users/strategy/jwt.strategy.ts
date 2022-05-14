import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { UsersService } from "../users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
  ) {
  constructor(private readonly userService: UsersService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let accessToken = request?.cookies['jwt'];

          console.log(accessToken);

          return accessToken;
        }
      ]),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const {nickname} = payload; 
//    console.log('nick name:')
 //   console.log(payload);
    return this.userService.findUserByName(nickname);
  }
}