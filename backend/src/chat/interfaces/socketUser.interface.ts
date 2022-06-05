import { User } from 'src/users/entities/user.entity';

export interface connectedSocketI {
	id?: string;
	socketID: string;
	user: User;
}
