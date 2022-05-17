import { Injectable, NotFoundException, HttpException, HttpStatus, UnauthorizedException, StreamableFile, InternalServerErrorException }
	from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { Status } from '../common/enums/status.enum';
import { Readable } from 'stream';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	findAllUsers() : Promise<User[]> {
		return this.userRepository.find();
	}

	async findUserById(id: string) : Promise<User> {
		const user = await this.userRepository.findOne(id);
		if (!user) {
			throw new NotFoundException(`User #${id} not found`);
		}
		return user;
	}

	async findUserByUsername(username: string) : Promise<User> {
		const user = await this.userRepository.findOne({ username: username });
		if (!user) {
			throw new UnauthorizedException(`User ${username} (username) not found. Try again`);
		}
		return user;
	}

	async findUserBynickname(nickname: string) : Promise<User> {
		const user = await this.userRepository.findOne({ nickname: nickname });
		if (!user) {
			throw new UnauthorizedException(`User ${nickname} (nickname) not found. Try again`);
		}
		return user;
	}	

	async retrieveOrCreateUser(createUserDto: CreateUserDto) {
		const { username } = createUserDto;
		let nickname = username;
		let user = await this.userRepository.findOne({ username: username });
		if (user) {
			return user;
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
		return this.userRepository.save(user);
	}

	async updateUser(user: User, updateUser: UpdateUserDto) {
		const { nickname, email } = updateUser;
		if (nickname)
			user.nickname = nickname;
		if (email)
			user.email = email;
		try {
			await this.userRepository.save(user);
		} catch (error) {
			if (error == '23505')
				throw new InternalServerErrorException('Username or email already taken');
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
		return this.userRepository.remove(user);
	}

	async changeStatus(user: User, newStatus: Status) {
		return this.userRepository.update(user.id, { status: newStatus });
	}

	modifyElo(user: User, opponentElo: number, userWon: boolean) {
		const eloRating = require('elo-rating');
		const result = eloRating.calculate(user.eloScore, opponentElo, userWon);
		user.eloScore = result.playerRating;
		this.userRepository.save(user);
	}

	addFriend(user: User, friendId: number) {
		const found = user.friends.find(element => friendId);
		if (found) {
			throw new  HttpException('User is already a friend', HttpStatus.BAD_REQUEST);			
		}
		user.friends.push(friendId);
		this.userRepository.save(user);
	}

	removeFriend(user: User, friendId: number) {
		const found = user.friends.indexOf(friendId);
		if (found == -1) {
			throw new  HttpException('User is not a friend', HttpStatus.BAD_REQUEST);			
		}	
		user.friends.splice(found, 1);
		this.userRepository.save(user);
	}

	async addAvatar(user: User, dataBuffer: Buffer) {
		this.userRepository.update(user.id, {avatar: dataBuffer});
	}

	async getAvatar(user: User) {
		const stream = Readable.from(user.avatar);
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

	async getSecret(user: User) {
		return user.decryptSecret();
	}

	async currentUser(user: User): Promise<Partial<User>>{
		let userFound = await this.userRepository.findOne(user.id);
		if (!user)
			throw new NotFoundException('User not found');
		let { username, ...res } = user;
		return res;
	}

	async userInfo(userName: string): Promise<Partial<User>> {
		let user: User = undefined;
		user = await this.userRepository.findOne({ username: userName });
		if (!user)
			throw new NotFoundException('No user found');
		let { username, ...res } = user;
		return res;
	}

	async getPartialUserInfo(id: string): Promise<Partial<User>> {
		let user = await this.userRepository.findOne(id);
		if (!user)
			return user;
		return {
			nickname: user.nickname,
			eloScore: user.eloScore,
			//profile_picture:
		}
	}
}
