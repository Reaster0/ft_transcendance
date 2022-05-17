import { CanActivate, ExecutionContext, ForbiddenException, forwardRef, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import jwt_decode  from "jwt-decode";
import { RequestUser } from "src/auth/interfaces/requestUser.interface";
import { User } from "../entities/user.entity";


// add there restrinction
function validateRequest(request: RequestUser) {

    const user: User= request.user; 
    let decode = jwt_decode(request.cookies.jwt);
    if (decode['auth'] === false && user.is2FAEnabled === true) {
        throw new ForbiddenException('need 2FA');
    }
    return true;
}

@Injectable()
export class AuthUser implements CanActivate {
    constructor() { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateRequest(request);
    }
}
