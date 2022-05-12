import { IsAlpha, IsEmail, IsNumber, IsOptional } from 'class-validator';
import	{	Entity,
		 	PrimaryGeneratedColumn,
			Column,
			BeforeInsert,
			BeforeUpdate
		} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';


@Entity('users') // sql table will be name 'users'
export class User {
	@PrimaryGeneratedColumn()
	@IsNumber()
	id: number;

	@Column({ unique: true })
	@IsAlpha()
	nickname: string;

	@Column({ type: 'text', unique: true, nullable: true })
	@IsEmail()
	@IsOptional()
	email: string;

	@Column({ type: 'text' })
	@Exclude()
	password: string;

	@Column({ type: 'int', array: true, default: {} })
	@IsNumber({}, { each: true })
	// Array of id of friends
	friends: number[];
	
	@Column({ type: 'text', default: 'offline' })
	status: string;

	@Column({ default: 0 })
	eloScore: number;

	// For game history and stats:
	//@OneToMany(() => Game (game: Game) => game.player) // how to select which player ?
	//matchHistory: Game; 

	// From a repo github with chat system tinchat from tanvirtin:
	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 10);
	}

	async comparePassword(attempt: string) {
		return await bcrypt.compare(attempt, this.password);
	}

	// authentication token ?
	// avatar ?
}
