import { IsAlpha, IsEmail, IsNumber, IsOptional } from 'class-validator';
import	{	Entity,
		 	PrimaryGeneratedColumn,
			Column,
			BeforeInsert,
			BeforeUpdate
		} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../common/enums/status.enum';
import { string } from '@hapi/joi';
import * as crypto from 'crypto';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { concat } from 'rxjs';


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


	// Source : https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb
	@BeforeInsert()
	@BeforeUpdate()
	async encryptSecret() {
		if (!this.twoFASecret) {
			return ;
		}
		const key = process.env.ENCRYPTION_KEY || '';
		const iv = Buffer.from(crypto.randomBytes(parseInt(process.env.ENCRYPTION_IV_LENGTH))).toString('hex').slice(0, parseInt(process.env.ENCRYPTION_IV_LENGTH));
		const cipher = crypto.createCipheriv(process.env.ENCRYPTION_ALGORITHM, Buffer.from(key), iv);
		const encrypted = Buffer.concat([cipher.update(this.twoFASecret), cipher.final()]);
		this.twoFASecret = iv + ':' + encrypted.toString('hex');
		return this.twoFASecret;
	}

	decryptSecret () {
		if (!this.twoFASecret) {
			return null;
		}
		let parts = this.twoFASecret.includes(':') ? this.twoFASecret.split(':') : [];
		const iv = Buffer.from(parts.shift() || '', 'binary');
		const encrypted = Buffer.from(parts.join(':'), 'hex');
		const decipher = crypto.createDecipheriv(process.env.ENCRYPTION_ALGORITHM, Buffer.from(process.env.ENCRYPTION_KEY), iv);
		const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
		return decrypted.toString();
	}
	// authentication token ?
	// avatar ?
}
