import { Injectable, NotFoundException, HttpException, HttpStatus,
		StreamableFile, InternalServerErrorException, Res } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../user.dto';
import { JwtService } from '@nestjs/jwt';
import { Status } from '../../common/enums/status.enum';
import { AvatarsService } from './avatars.service';
import { Readable } from 'stream';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
		private readonly avatarsService: AvatarsService,
		private connection: Connection,
	) {}

	findAllUsers() : Promise<User[]> {
		return this.userRepository.find();
	}

	async findUserById(id: string) : Promise<User> {
		const user = await this.userRepository.findOne(id);
		if (!user) {
			throw new NotFoundException(`User #${id} not found.`);
		}
		return user;
	}

	async findUserByUsername(username: string) : Promise<User> {
		const user = await this.userRepository.findOne({ username: username });
		if (!user) {
			throw new NotFoundException(`User ${username} (username) not found.`);
		}
		return user;
	}

	async findUserBynickname(nickname: string) : Promise<User> {
		const user = await this.userRepository.findOne({ nickname: nickname });
		if (!user) {
			throw new NotFoundException(`User ${nickname} not found(nickname) not found.`);
		}
		return user;
	}	

	async retrieveOrCreateUser(createUserDto: CreateUserDto) {
		const { username, email } = createUserDto;
		console.log(username);
		console.log(email);
		let nickname = username;
		let user = await this.userRepository.findOne({ username: username, email: email });
		if (user) {
			return user;
		}
		user = await this.userRepository.findOne({ username: username });
		if (user) {
			throw new HttpException('There seems to be something wrong with your 42auth account. Please contact an administrator.', HttpStatus.BAD_REQUEST);
		}
		user = await this.userRepository.findOne({ email: email });	
		if (user) {
			throw new HttpException('There seems to be something wrong with your 42auth account. Please contact an administrator.', HttpStatus.BAD_REQUEST);
		}	
		const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		while ((user = await this.userRepository.findOne({ nickname: nickname })) && nickname.length < 4) {
			let randomChar = letters[Math.floor(Math.random() * letters.length)];
			if (nickname.length > 15) {
				nickname = randomChar;
			} else {
				nickname += randomChar;
			}
		}
		user = this.userRepository.create(createUserDto);
		user.nickname = nickname;
		// TODO redirect user to modify info page
		return this.userRepository.save(user);
	}


	async updateUser(user: User, updateUser: UpdateUserDto) {
		const { nickname, email } = updateUser;
		let find = await this.userRepository.findOne({ nickname: nickname });
		if (find && find != user) {
			throw new HttpException('Nickname already taken.', HttpStatus.BAD_REQUEST);
		}
		find = await this.userRepository.findOne({ email: email });
		if (find && find != user) {
			throw new HttpException('Email already taken.', HttpStatus.BAD_REQUEST);
		}
		try {
			user.nickname = nickname;
			user.email = email;
			return this.userRepository.save(user);
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	async removeUser(user: User) {
		const friends = user.friends;
		const id = user.id;
		for (let i = 0; i < friends.length; i++) {
			let otherUser = await this.userRepository.findOne({id : friends[i]});
			this.removeFriend(otherUser, id);
		}
		return await this.userRepository.remove(user);
	}

	async changeStatus(user: User, newStatus: Status) {
		return this.userRepository.update(user.id, { status: newStatus });
	}

	async modifyElo(user: User, opponentElo: number, userWon: boolean) {
		const eloRating = await require('elo-rating');
		const result = eloRating.calculate(user.eloScore, opponentElo, userWon);
		user.eloScore = result.playerRating;
		this.userRepository.save(user);
	}

	async addFriend(user: User, friendId: number) {
		const found = await user.friends.find(element => friendId);
		if (found) {
			throw new  HttpException('User is already a friend', HttpStatus.BAD_REQUEST);			
		}
		user.friends.push(friendId);
		this.userRepository.save(user);
	}

	async removeFriend(user: User, friendId: number) {
		const found = await user.friends.indexOf(friendId);
		if (found == -1) {
			throw new  HttpException('User is not a friend', HttpStatus.BAD_REQUEST);			
		}	
		user.friends.splice(found, 1);
		this.userRepository.save(user);
	}

	async addAvatar(user: User, avatarFilename: string, avatarBuffer: Buffer) {
		const queryRunner = this.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const oldAvatarId = user.avatarId;
			const newAvatar = await this.avatarsService.uploadAvatar(avatarFilename, avatarBuffer, queryRunner);
			await queryRunner.manager.update(User, user.id, { avatarId: newAvatar.id });
			if (oldAvatarId) {
				await this.avatarsService.deleteAvatarById(oldAvatarId, queryRunner);
			}
			await queryRunner.commitTransaction();
			return newAvatar;
		} catch {
			await queryRunner.rollbackTransaction();
			throw new InternalServerErrorException();
		} finally {
			await queryRunner.release();
		}
	}

	async getAvatarByAvatarId(avatarId: number, @Res({ passthrough: true }) res) {
		let avatar = await this.avatarsService.getAvatarById(avatarId);
		if (!avatar) {
			let filename = process.env.DEFAULT_AVATAR;
			let stream = createReadStream(join(process.cwd(), process.env.DEFAULT_AVATAR));
			res.set({
				'Content-Disposition': `inline; filename="${filename}"`,
				'Content-Type': 'image'
			  });
			return new StreamableFile(stream);
		}
		const stream = Readable.from(avatar.avatarBuffer);
		const filename = avatar.avatarFilename;
		res.set({
			'Content-Disposition': `inline; filename="${filename}"`,
			'Content-Type': 'image'
			});
		return new StreamableFile(stream);
	}

	async setTwoFASecret(user: User, secret: string): Promise<User> {
		user.twoFASecret = secret;
		return this.userRepository.save(user);
	}

	async modify2FA(user: User) {
		const enable: boolean = !(user.is2FAEnabled);
		return this.userRepository.update(user.id, { is2FAEnabled: enable });
	}

	async enableTwoFA(id: number) {
		await this.userRepository.update(id, {is2FAEnabled: true});
	}

	async getSecret(user: User) {
		return user.decryptSecret();
	}

	async currentUser(user: User): Promise<Partial<User>> {
		let { username, twoFASecret, ...res } = user;
		return res;
	}

	async userInfo(userName: string): Promise<Partial<User>> {
		let user: User = undefined;
		user = await this.userRepository.findOne({ username: userName });
		if (!user)
			throw new NotFoundException('No user found');
		let { username, twoFASecret, ...res } = user;
		return res;
	}

	async getPartialUserInfo(id: string): Promise<Partial<User>> {
		let user = await this.userRepository.findOne(id);
		if (!user)
			return user;
		return {
			nickname: user.nickname,
			eloScore: user.eloScore,
		}
	}
}
