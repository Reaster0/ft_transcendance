import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { ChatServices } from '../services/chat.service';

@Injectable()
export class AuthChat implements CanActivate {
  constructor(
    private readonly authServices: AuthService,
    private readonly chatServices: ChatServices,
  ) {}
  async canActivate(context: any): Promise<boolean> {
    return validateUser(context);
  }
}

function validateUser(context: any) {
  try {
    const user: User = this.authServices.getUserBySocket(context.arg[0]);
  } catch {
    return false;
  }
  return true;
}
