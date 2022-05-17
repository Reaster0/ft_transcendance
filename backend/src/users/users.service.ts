import { Injectable, NotFoundException, HttpException, HttpStatus, UnauthorizedException, InternalServerErrorException }
	from '@nestjs/common';
import { Connection, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto }
	from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { Status } from '../common/enums/status.enum';
import { boolean } from 'joi';

// TODO set cookie and jwt token strategy 
// https://wanago.io/2020/05/25/api-nestjs-authenticating-users-bcrypt-passport-jwt-cookies/


@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	findAllUsers() {
		return this.userRepository.find();
	}

	async findSpecificUser(id: string) {
		const user = await this.userRepository.findOne(id);
		if (!user) {
			throw new NotFoundException(`User #${id} not found`);
		}
		return user;
	}

	async createUser(createUserDto: CreateUserDto) {
		const { nickname, email, username } = createUserDto;
		let user = await this.userRepository.findOne({ nickname: nickname });
		if (user) {
			throw new HttpException('Nickname already in use', HttpStatus.BAD_REQUEST);
		}
		user = await this.userRepository.findOne({ email: email });
		if (user) {
			throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
		}
		user = await this.userRepository.findOne({ username: username });
		if (user) {
			throw new HttpException('username already in use', HttpStatus.BAD_REQUEST);
		}
		// Another way is to make a try/catch block to check if error?code is
		// a PostgresErrorCode.uniqueViolation. But here, we can check if error
		// comes from email or nickname by doing successives checks.
		user = this.userRepository.create(createUserDto);
		return this.userRepository.save(user);
	}

	/*
	async updateUser(id: string, updateUserDto: UpdateUserDto) {
		const { nickname, email } = updateUserDto;
		let user = await this.userRepository.findOne({ nickname: nickname });
		if (user) {
			throw new HttpException('Nickname already in use', HttpStatus.BAD_REQUEST);
		}
		user = await this.userRepository.findOne({ email: email });
		if (user) {
			throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
		}
		// Same remarks as createUser concerning previous user checks.	
		user = await this.userRepository.preload({
			id: +id,
			...updateUserDto,
		});
		if (!user) {
			throw new NotFoundException(`User #${id} not found`);
		}
		return this.userRepository.save(user);
	}
	*/
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

	async removeUser(id: string) {
		const user = await this.findSpecificUser(id);
		if (!user) {
			throw new HttpException('User to delete not found', HttpStatus.NOT_FOUND);	
		}
		// TODO : delete user id from others user friends array
		return this.userRepository.remove(user);
	}

	/* not used
	async loginUser(loginUserDto: LoginUserDto) {
		const { nickname, password } = loginUserDto;
		const user = await this.userRepository.findOne({ nickname: nickname });
		if (!user) {
			throw new HttpException('Nickname doesn\'t match a registered user', HttpStatus.BAD_REQUEST);
		}
		if (!await user.comparePassword(password)) {
			throw new HttpException('Password doesn\'t match the one registered for this user', HttpStatus.BAD_REQUEST);
		}
		if (user.status == Status.ONLINE || user.status == Status.PLAYING) {
			throw new HttpException('User is already login', HttpStatus.BAD_REQUEST);
		}
		user.status = Status.ONLINE;
		return this.userRepository.save(user);
	}
	*/

	async logoutUser(user: User): Promise<UpdateResult>{
		return this.userRepository.update(user.id, {
			status: Status.OFFLINE,
		});
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

	// TODO how to check if user leave app ? => When user not in chat or playing
	// TODO (checks throught websockets and modify status accordingly)

	async validateUser(userData: CreateUserDto): Promise<User> {

		const { username } = userData;
		let user = await this.userRepository.findOne({username: username});
		if (user) {
			await this.userRepository.update(user.id, {status: Status.ONLINE})
			return user;
		}
		const newUser: User = await this.createUser(userData);
		await this.userRepository.update(newUser.id, {status: Status.ONLINE})
		return newUser;
	}

	async findUserByName(username: string): Promise<User> {
		const user = await this.userRepository.findOne({ username });
		if (!user) {
			throw new UnauthorizedException('User not found. Try again');
		}
		return user;
	}

	async setTwoFASecret(secret: string, uid: number): Promise<UpdateResult> {
		return this.userRepository.update(uid, { twoFASecret: secret });
	}

	async modify2FA(uid: number): Promise<UpdateResult> {
		const user = await this.userRepository.findOne(uid);
		const enable: boolean = !(user.is2FAEnabled);
		return this.userRepository.update(uid, {
			is2FAEnabled: enable
		});
	}

	async currentUser(user: User): Promise<Partial<User>>{
		let userFound: User = undefined;
		userFound = await this.userRepository.findOne(user.id);
		if (!user)
			throw new NotFoundException('User not found');
		let { username, ...res } = user;
		return res;
	}

	async userInfo(user_name: string): Promise<Partial<User>> {
		let user: User = undefined;
		user = await this.userRepository.findOne({username: user_name});
		if (!user)
			throw new NotFoundException('No user found');
		let { username, ...res } = user;
		return res;
	}

	async getPartialUserInfo(id: string): Promise<Partial<User>> {
		let user: User = undefined;

		user = await this.userRepository.findOne(id); //mmmmh
		if (!user)
			return user;
		return {
			id: user.id,
			username: user.username,
			eloScore: user.eloScore,
			//profile_picture:
		}
	}
}