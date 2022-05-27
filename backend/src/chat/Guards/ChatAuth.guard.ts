import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ChatServices } from "../services/chat.service";


@Injectable()
export class AuthChat implements CanActivate {
    constructor(
        private readonly chatServices: ChatServices,
    ) {}
    async canActivate(context: any): Promise<boolean> {
        //const user2fa  = await this.chatServices.getUser(context.args[0]);
        return true;
    }
}

/*
function validateUser(user2fa: UserFA) 

    const {user, twoFA} = user2fa;
    if (!user)
        return false;
    if (user.is2FAEnabled == true) {
        return twoFA;
    }
    return true;
}
*/