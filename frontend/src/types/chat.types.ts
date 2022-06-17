export enum Status {
	OFFLINE = 'Offline',
	ONLINE = 'Online',
	PLAYING = 'In Game',
}

//export interface ChannelI {

//	id: string,
//	channelName: string,
//	date: Date,
//	update_at: Date,
//	owner: number, //id or nickname ?
//	publicChannel: boolean,
//	password: string,
//	adminUsers: string[],
//    // -- relations //
//	users: User[],
//	chanUsers: JoinnedUserI[],
//	messages: MessageI[],
//}

//export class Channel implements ChannelI {

//	id = '';
//	channelName = '';
//	date = new Date();
//	update_at = new Date();
//	owner = 0; // id
//	publicChannel = true;
//	password = '';
//	adminUsers = [];
//    // --- relations //
//	users = [];
//	chanUsers = [];
//	messages = [];
//}

//export class newChannel {
//  name: string = '';
//  public: boolean = true;
//  password: string = '';
//  members: User[] = [];
//  admin: User[] = []; 
//}

export interface Channel {
    id: string;
    channelName: string;
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
