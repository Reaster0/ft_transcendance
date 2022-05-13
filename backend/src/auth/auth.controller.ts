import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { OauthGard42Guard } from './guards/oauth-gard42.guard';
import { Profile } from 'passport-42';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(OauthGard42Guard)
    @Get('login')
    login(): void { 
        console.log("got to 42");
        return ;}

    @UseGuards(OauthGard42Guard)
    @Get('callback')
    async authRedirect42(@Req() req: any, @Res() res: Response): Promise<Response> {
        const {
            user,
            authInfo,
        }: { 
            user: Profile;
            authInfo: {
                accessToken: string;
                refreshToken: string;
                expire_int: number;
            };
        } = req;

        if (!user) {
            console.log("no user");
            res.redirect('/');
            return ;
        }

        console.log(user);
        req.user = undefined;

        const jwt = this.authService.login(user);
        res.set('authorization', `Bearer ${jwt}`);
        return res.status(201).json({authInfo, user});
    }
}