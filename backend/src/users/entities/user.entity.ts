import { IsAlpha, IsEmail, IsOptional } from 'class-validator';
import	{	Entity,
		 	PrimaryGeneratedColumn,
			Column,
			BeforeInsert,
			BeforeUpdate
		} from 'typeorm';
import * as bcrypt from 'bcryptjs';


@Entity('users') // sql table will be name 'users'
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	@IsAlpha()
	nickname: string;

	@Column({ type: 'text', unique: true, default: "" })
	@IsEmail()
	@IsOptional()
	email: string;
	//TODO make email optionnal if registration via user42

	@Column({ type: 'text' })
	password: string;

	@Column({ array: true, default: {} })
	// Does it work ?
	// Another option : create relation with @ManyToMany
	friends: string;
	
	@Column({ type: 'text', default: 'offline' })
	status: string;

	@Column({ default: 0 })
	eloscore: number;

	// From a repo github with chat system tinchat from tanvirtin:
	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 10);
	}

	async comparePassword(attempt: string) {
		return await bcrypt.compare(attempt, this.password);
	}

	async changeStatus(status: string) {
		this.status = status;
	}

	// authentication token ?
	// avatar ?
	// score ?
	// friends ?
	// status ?
	// match history as an array ?
}
