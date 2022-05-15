import { IsAlpha, IsEmail, IsNumber, IsOptional } from 'class-validator';
import	{	Entity,
		 	PrimaryGeneratedColumn,
			Column,
			BeforeInsert,
			BeforeUpdate
		} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../common/enums/status.enum';
import { string } from '@hapi/joi';


@Entity('users') // sql table will be name 'users'
export class User {
	@PrimaryGeneratedColumn()
	@ApiProperty({ type: Number, description: 'An unique id number attributed \
		to user inside database upon creation.'})
	@IsNumber()
	id: number;

	@Column({ unique: true })
	@ApiProperty({ type: String, description: 'User nickname. Can be modified \
		and must only contains alphabetical characters.'})
	@IsAlpha()
	nickname: string;

	@Column({ type: 'text', unique: true, nullable: true })
	@ApiProperty({ type: String, description: 'User email. Is optional and \
		must be under email format.'})
	@IsEmail()
	@IsOptional()
	email?: string;
	// TODO : when email is null, return a message like 'No mail registered'

	@Column({ type: 'text' })
	@ApiProperty({ type: String, description: 'User password, needed for \
		app authentification.'})
	@Exclude()
	password: string;
	// TODO : set password proprierties (length, ...)

	@ApiProperty({ type: string, description: 'User personal 2FA Secret. \
		(optional field)'})
	@Column({ nullable: true })
  	public twoFASecret?: string;

	@Column({ type: 'int', array: true, default: {} })
	@ApiProperty({ type: [Number], description: 'User friends, identified by \
		unique ids inside an array.'})
	@IsNumber({}, { each: true })
	// Array of id of friends
	friends: number[];
	
	@Column({ type: 'text', default: Status.OFFLINE })
	@ApiProperty({ enum: Status, type: String, description: 'User status, either offline\
		/online/playing.'})
	status: Status;

	@Column({ default: 0 })
	@ApiProperty({ type: Number, description: 'Elo score, based on Elo \
		chess system and modified after each match.'})
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
