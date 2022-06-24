import { Body, Controller, Get, Post, Req, Res, UnauthorizedException,
  UseGuards, Logger, ConsoleLogger } from '@nestjs/common';
import { Request, Response } from 'express';
import { OauthGard42Guard } from './guards/oauth-gard42.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RequestUser } from './interfaces/requestUser.interface';
import { twoFACodeDto } from './dto/twoFACode.dto';
import { userInfo } from 'os';

@ApiTags('Authentification Process Controller')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  private logger: Logger = new Logger('AuthController');

  @ApiOperation({ summary: 'OAuth login via 42 api' })
  @UseGuards(OauthGard42Guard)
  @Get('login-42')
  login(): void {
    this.logger.log('login 42');
  }

  @ApiOperation({ summary: 'callback/Redirection after 42 Authentification' })
  @UseGuards(OauthGard42Guard)
  @Get('callback')
  async authRedirect42(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {

    const first = req.user['first'];
    const user = req.user['user'];

    const payload: JwtPayload = {
      username: user['username'],
      twoFA: false,
    };

    const jwtToken: string = this.jwtService.sign(payload);
    res.cookie('jwt', jwtToken, { httpOnly: false, sameSite: 'strict'}); //secure: process.env.MODE !== 'dev'}); //set cookie
    if (!first)
      res.redirect(process.env.FRONTEND + '/login');
    else
      res.redirect(process.env.FRONTEND + '/login/user?first=true');
  }

  @ApiOperation({ summary: 'Code authentication - Secret' })
  @UseGuards(AuthGuard('jwt'))
  @Post('2FAGenQRC')
  async generate(@Req() req: RequestUser, @Res() res: Response) {
    this.logger.log('2FAGenQRC');
    const { authUrl } = await this.authService.generateTwoFASecret(req.user);
    return this.authService.pipeQrCodeStream(res, authUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('login-2fa')
  async validade2FA(
    @Req() req: RequestUser,
    @Body() { twoFACode }: twoFACodeDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    this.logger.log('login-2FA');
    const isCodeValid = this.authService.is2FAValide(twoFACode, req.user);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentification code');
    }
    const payload: JwtPayload = { username: req.user['username'], twoFA: true };
    const jwtToken: string = await this.jwtService.sign(payload);
    res.cookie('jwt', jwtToken, { httpOnly: false, sameSite: 'strict' }); //secure: process.env.MODE !== 'dev'}); //set cookie
    this.authService.enableTwoFA(req.user);
    return true;
  }
}
