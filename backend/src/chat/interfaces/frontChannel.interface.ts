import { User } from "src/users/entities/user.entity";
import { Status } from "src/users/enums/status.enum";
import { ChanUserI } from "./channelUser.interface";

export class FrontChannelI {
    id: string;
    channelName: string;
    avatar?: Uint8Array;
}

export class FrontUserI {
    id: number;
    nickname: string;
    avatarId: number;
    status: Status;
    role: ChanUserI
}

export class FrontMessageI {
    content: string;
    userId: number;
    date: Date;  
}

//export class FrontId