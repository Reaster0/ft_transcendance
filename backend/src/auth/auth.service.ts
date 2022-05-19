import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { toFileStream } from 'qrcode';

@Injectable()
export class AuthService {
//    constructor(private readonly jwtService: JwtService) {}
    constructor(private userService: UsersService) {}

    async validateUser(user: CreateUserDto): Promise<User> {
        return this.userService.retrieveOrCreateUser(user);
    }

    async getUser(nickname: string): Promise<User> {
        return this.userService.findUserBynickname(nickname);
    }

    async generateTwoFASecret(user: User)/*: Promise<twoFaI> */ {
        const secret: string = authenticator.generateSecret();
        const authUrl: string = authenticator.keyuri(user.email, process.env.APPNAME, secret);
        await this.userService.setTwoFASecret(user, secret);
        return {secret, authUrl};
    }

    public async pipeQrCodeStream(stream: Response, url: string) {
        return toFileStream(stream, url);
      }

      is2FAValide(twoFACode: string, user: User): boolean {
        return authenticator.verify({
          token: twoFACode,
          secret: user.decryptSecret(),
        })
      }

      async enableTwoFA(user: User): Promise<void> {
        if (user.is2FAEnabled)
          return ;
        this.userService.enableTwoFA(user.id);
      }
}
