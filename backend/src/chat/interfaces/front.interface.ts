import { Status } from "../../users/enums/status.enum";

export class FrontChannelI {
    id: string;
    channelName: string;
    avatar?: Uint8Array;
}

export class FrontUserI {
    id: number;
    name: string;
    status: Status;
    role: string;
}

export class FrontMessageI {
    content: string;
    userId: number;
    date: Date;  
}

//export class FrontId
