import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-42';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    login(user: Profile) {
        console.log("coucou in user service");
        const payload = {
            name: user.username,
            sub: user.id,
        };
        return this.jwtService.sign(payload);
    }
}