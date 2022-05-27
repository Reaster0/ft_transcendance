import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifiedCallback } from 'passport-42';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class OauthStrategy42 extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      //scope: ['public']
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    const user = {
      nickname: profile['username'],
      username: profile['username'],
      email: profile['emails'][0]['value'],
    };
    return this.authService.validateUser(user);
  }
}
