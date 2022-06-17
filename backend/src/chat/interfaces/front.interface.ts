import { Status } from "../../users/enums/status.enum";

export class FrontChannelI {
    id: string;
    name: string;
    type: string;
    avatar?: Uint8Array;
}

export class FrontUserGlobalI {
    id: number;
    name: string;
    role: string;
}

export class FrontUserChannelI {
    id: number;
    role: string;
}

export class FrontMessageI {
    content: string;
    userId: number;
    date: Date;  
}
