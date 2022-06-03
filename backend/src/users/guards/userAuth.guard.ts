import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { RequestUser } from 'src/auth/interfaces/requestUser.interface';
import { User } from '../entities/user.entity';

function validateRequest(request: RequestUser) {
  const user: User = request.user;
  const decode = jwt_decode(request.cookies.jwt);
  if (user.is2FAEnabled === true) {
    if (decode['twoFA'] === false) {
      throw new ForbiddenException('need 2FA');
    }
  }
  return true;
}

@Injectable()
export class AuthUser implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
