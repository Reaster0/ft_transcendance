import { Injectable, NotFoundException, HttpException, HttpStatus, UnauthorizedException, StreamableFile }
	from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
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
		const user = await this.userRepository.findOne({ username });
		if (!user) {
			throw new UnauthorizedException(`User ${username} (username) not found. Try again`);
		}
		return user;
	}

	async findUserBynickname(nickname: string) : Promise<User> {
		const user = await this.userRepository.findOne({ nickname });
		if (!user) {
			throw new UnauthorizedException(`User ${nickname} (nickname) not found. Try again`);
		}
		return user;
	}	

	async retrieveOrCreateUser(createUserDto: CreateUserDto) {
		const { username } = createUserDto;
		let user = await this.userRepository.findOne({ username: username });
		if (user) {
			return user;
		}
		user = await this.userRepository.findOne({ nickname: username });
		if (user) {
			// TODO special gestion of this case !
			throw new HttpException('Nickname already in use', HttpStatus.BAD_REQUEST);
		}
		user = this.userRepository.create(createUserDto);
		return this.userRepository.save(user);
	}

	async updateUser(id: string, updateUserDto: UpdateUserDto) {
		const { nickname } = updateUserDto;
		let user = await this.userRepository.findOne({ nickname: nickname });
		if (user) {
			throw new HttpException('Nickname already in use', HttpStatus.BAD_REQUEST);
		}
		user = await this.userRepository.preload({
			id: +id,
			...updateUserDto,
		});
		if (!user) {
			throw new NotFoundException(`User #${id} not found`);
		}
		return this.userRepository.save(user);
	}

	async removeUser(id: string) {
		const user = await this.findUserById(id);
		if (!user) {
			throw new HttpException('User to delete not found', HttpStatus.NOT_FOUND);	
		}
		// TODO : delete user id from others user friends array
		return this.userRepository.remove(user);
	}

	async loginUser(username: string) {
		const user = await this.userRepository.findOne({ username: username });
		if (!user) {
			throw new HttpException('Username doesn\'t match a registered user', HttpStatus.BAD_REQUEST);
		}
		if (user.status == Status.ONLINE || user.status == Status.PLAYING) {
			throw new HttpException('User is already login', HttpStatus.BAD_REQUEST);
		}
		return this.userRepository.update(user.id, { status: Status.ONLINE });
	}

	async logoutUser(username: string) {
		const user = await this.userRepository.findOne({ username: username });
		if (!user) {
			throw new HttpException('Email or password doesn\'t match a registered user', HttpStatus.BAD_REQUEST);			
		}
		return this.userRepository.update(user.id, { status: Status.OFFLINE });
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

	async addAvatar(username: string, dataBuffer: Buffer) {
		const user = await this.userRepository.findOne({ username: username });
		if (!user) {
			throw new  HttpException('User not found', HttpStatus.BAD_REQUEST);			
		}
		this.userRepository.update(user.id, {avatar: dataBuffer});
	}

	async getAvatar(username: string) {
		const user = await this.userRepository.findOne({ username: username });
		if (!user) {
			throw new  HttpException('User not found', HttpStatus.BAD_REQUEST);			
		}
		const stream = Readable.from(user.avatar);
		return new StreamableFile(stream);
	}

	async validateUser(userData: CreateUserDto): Promise<User> {

		const { username } = userData;
		let user = await this.userRepository.findOne({username: username});
		if (user)
			return user;
		const newUser: User = await this.retrieveOrCreateUser(userData);
		return newUser;
	}

	async setTwoFASecret(secret: string, uid: number): Promise<User> {
		const user = await this.userRepository.findOne({ id : uid });
		user.twoFASecret = secret;
		return this.userRepository.save(user);
	}

	async modify2FA(uid: number) {
		const user = await this.userRepository.findOne({ id : uid });
		const enable: boolean = !(user.is2FAEnabled);
		return this.userRepository.update(uid, {
			is2FAEnabled: enable
		});
	}

	async getSecret(username: string) {
		const user = await this.userRepository.findOne({ username: username });
		return user.decryptSecret();
	}
}
