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
	@ApiProperty({ type: Number, description: 'An unique id number attributed to user inside database upon creation.'})
	@IsNumber()
	id: number;

	@Column({ unique: true })
	@ApiProperty({ type: String, description: 'User nickname. Can be modified and must only contains alphabetical characters.'})
	@IsAlpha()
	nickname: string;

	@ApiProperty({ type: String, description: 'User private name. Cannot be modified and must only contains alphabetical characters.'})
	@IsAlpha()
	@Column({unique: true})
	username: string;

	@Column({ type: 'text', unique: true, nullable: true })
	@ApiProperty({ type: String, description: 'User email. Must be under email format.'})
	@IsEmail()
	email: string;

	@Column({ type: 'bytea', nullable: true })
	@ApiProperty({ type: Uint8Array, description: 'User\'s avatar'})
	avatar: Uint8Array;
	// TODO set as non nullable

	@ApiProperty({ type: string, description: 'User personal 2FA Secret (optional field)'})
	@Column({ nullable: true })
  	public twoFASecret?: string;
	
	@ApiProperty({ type: string, description: 'User as activate 2FA)'})
	@Column({ default: false })
  	public is2FAEnabled: boolean;

	@Column({ type: 'int', array: true, default: {} })
	@ApiProperty({ type: [Number], description: 'User friends, identified by unique ids inside an array.'})
	@IsNumber({}, { each: true })
	// Array of id of friends
	friends: number[];
	
	@Column({ type: 'text', default: Status.OFFLINE })
	@ApiProperty({ enum: Status, type: String, description: 'User status, either offline/online/playing.'})
	status: Status;

	@Column({ default: 0 })
	@ApiProperty({ type: Number, description: 'Elo score, based on Elo chess system and modified after each match.'})
	eloScore: number;

	// For game history and stats:
	//@OneToMany(() => Game (game: Game) => game.player) // how to select which player ?
	//matchHistory: Game; 

	// From a repo github with chat system tinchat from tanvirtin:
	@BeforeInsert()
	@BeforeUpdate()
	async hashSecret() {
		this.twoFASecret = await bcrypt.hash(this.twoFASecret, 10);
	}

	async compareSecret(attempt: string) {
		return await bcrypt.compare(attempt, this.twoFASecret);
	}

	// authentication token ?
	// avatar ?
}
