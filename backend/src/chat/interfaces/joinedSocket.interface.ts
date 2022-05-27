import { User } from "src/users/entities/user.entity";
import { ChanI } from "./channel.interface";

export interface JoinedSocketI{
	id?: string;
	socketID: string;
	user: User;
	chan: ChanI;
}