import { Controller, Get, UseGuards } from '@nestjs/common';
import { Auth42Guard } from './guards/auth42.guard';

@Controller('auth')
export class AuthController {
@Get('42/login')
@UseGuards(Auth42Guard)
login(){}
}
