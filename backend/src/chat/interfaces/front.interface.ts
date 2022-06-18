import { Status } from "../../users/enums/status.enum";

export class FrontChannelI {
    id: string;
    name: string;
    type: number;
    avatar?: Uint8Array;
}

export class FrontUserGlobalI {
    id: number;
    name: string;
    role: number;
}

export class FrontUserChannelI {
    id: number;
    role: number;
}

export class FrontMessageI {
    content: string;
    userId: number;
    date: string;  
}
