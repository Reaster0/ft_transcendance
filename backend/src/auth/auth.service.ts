import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-42';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
//    constructor(private readonly jwtService: JwtService) {}
    constructor(private userService: UsersService) {}

    async validateUser(user: CreateUserDto): Promise<User> {
        return this.userService.validateUser(user);
    }

    async getUser(nickname: string): Promise<User> {
        return this.userService.findSpecificUser(nickname);
    }

    /*
    login(user: Profile) {
        console.log("coucou in user service");
        const payload = {
            name: user.username,
            sub: user.id,
        };
        return this.jwtService.sign(payload);
    }
    */

}