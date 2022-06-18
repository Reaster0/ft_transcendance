export enum Status {
    ONLINE = 'online',
    OFFLINE = 'offline',
    PLAYING = 'playing',
}
  
export enum ChannelType {
    PUBLIC = 0,
    PRIVATE = 1,
    PROTECTED = 2,
    PM = 3,
}

export enum Roles {
    OWNER = 0,
    ADMIN = 1,
    USER = 2
}

export interface Channel {
    id: string;
    name: string;
	type: string;
    avatar?: Uint8Array;
}

export interface UserGlobal {
    id: number;
    name: string;
	avatar: Blob;
	status: Status;
}

export interface UserChannel {
	id : number;
	role: string;
}

export interface Message {
    content: string;
    userId: number;
    date: any;
}
