export enum UserStatus {
	OFFLINE = 'Offline',
	ONLINE = 'Online',
	INGAME = 'In Game',
};

export interface UserI {
    id: number,
    nickname: string,
    status: UserStatus,
};

export class User implements UserI{
    id = 0;
    nickname = '';
    status =  UserStatus.OFFLINE;
};

export interface ChannelI {

	id: string,
	channelName: string,
	date: Date,
	update_at: Date,
	owner: number, //id or nickname ?
	publicChannel: boolean,
	password: string,
	adminUsers: string[],
    // -- relations //
	users: User[],
	chanUsers: JoinnedUserI[],
	messages: MessageI[],
};

export class Channel implements ChannelI {

	id = '';
	channelName = '';
	date = new Date();
	update_at = new Date();
	owner = 0; // id
	publicChannel = true;
	password = '';
	adminUsers = [];
    // --- relations //
	users = [];
	chanUsers = [];
	messages = [];
};

export interface JoinnedUserI {
	id: string;
	socketID: string;
	user: User;
	chan: Channel;
};

export class JoinnedUser implements JoinnedUserI {
	id = '';
	socketID = '';
	user =  new User;
	chan = new Channel;
};

export interface MessageI {
	id: number
	content: string;
	date: Date;
	update_at: Date;
 // relation //
	user: User;
	channel: Channel;
};

export class Message implements MessageI {
	id = 0;
	content = '';
	date = new Date;
	update_at = new Date;

	user = new User;
	channel = new Channel;
};

export class newChannel {
  name: string = '';
  public: boolean = true;
  password: string = '';
  members: User[] = [];
  admin: User[] = [];
};