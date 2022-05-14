import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { OauthGard42Guard } from './guards/oauth-gard42.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/users/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Authentification Process Controller')
@Controller('auth')
export class AuthController {
    constructor(private readonly jwtService: JwtService) {}

    @ApiOperation( {summary: 'OAuth login via 42 api'} )
    @UseGuards(OauthGard42Guard)
    @Get('login')
    login(): void {}

    @ApiOperation( {summary: 'callback/Redirection after 42 Authentification'} )
    @UseGuards(OauthGard42Guard)
    @Get('callback')
    async authRedirect42(@Req() req: Request, @Res({passthrough: true}) res: Response): Promise<void> {
        /*
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
        */
//       const username = req.user['username'];
       const payload: JwtPayload = {nickname: req.user['nickname'], authStatus: false};
       const jwtToken: string = await this.jwtService.sign(payload);
       res.cookie('jwt', jwtToken, {httpOnly: true}); //set cookie 
       res.redirect(process.env.FRONTEND); //back to frontend
    }
}