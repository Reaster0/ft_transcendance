import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { OauthGard42Guard } from './auth/guards/oauth-gard42.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(OauthGard42Guard)
  @Get('login')
  login(): void {
  }

  @Get('chat')
  getChat(): string {
    return 'Hello Chatters... Say Hello !';
  }
}