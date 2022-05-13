import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifiedCallback } from 'passport-42';

export class OauthStrategy42 extends PassportStrategy(
    Strategy,
    '42',
) {
    constructor() {
        super(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                callbackURL: process.env.CALLBACK_URL,
            },
            (
                accessToken: string,
                refreshToken: string,
                expire_int: number,
                profile: Profile,
                done: VerifiedCallback,
            ): void => {
                return done(null, profile, { accessToken, refreshToken, expire_int });
            },
        );
    }
}