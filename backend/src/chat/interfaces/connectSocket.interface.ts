import { User } from "src/users/entities/user.entity";

export interface connectedSocketI {
	userConnectID?: number;
	socketID: string;
	user: User;
}