import	{	Entity,
		 	PrimaryGeneratedColumn,
			Column
		} from 'typeorm';

@Entity('users') // sql table will be name 'users'
export class User {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	nickname: string;

	// authentication token ?
	// avatar ?
	// score ?
	// friends ?
	// status ?
	// match history as an array ?
}
