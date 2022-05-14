import { CanActivate, ExecutionContext, forwardRef, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import jwt_decode  from "jwt-decode";

// add there restrinction
function validateRequest(request) {
    //const token = jwt_decode(request.cookies.jwt);
    return true;
}
@Injectable()
export class AuthUser implements CanActivate {
     constructor() {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateRequest(request);
    }
}
