import { Injectable, NotFoundException, HttpException, HttpStatus, UnauthorizedException }
	from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, LoginUserDto, LogoutUserDto }
	from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { Status } from '../common/enums/status.enum';

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
		const { nickname, email } = createUserDto;
		let user = await this.userRepository.findOne({ nickname: nickname });
		if (user) {
			throw new HttpException('Nickname already in use', HttpStatus.BAD_REQUEST);
		}
		user = await this.userRepository.findOne({ email: email });
		if (user) {
			throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
		}
		// Another way is to make a try/catch block to check if error?code is
		// a PostgresErrorCode.uniqueViolation. But here, we can check if error
		// comes from email or nickname by doing successives checks.
		user = this.userRepository.create(createUserDto);
		return this.userRepository.save(user);
	}

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

	async removeUser(id: string) {
		const user = await this.findSpecificUser(id);
		if (!user) {
			throw new HttpException('User to delete not found', HttpStatus.NOT_FOUND);	
		}
		// TODO : delete user id from others user friends array
		return this.userRepository.remove(user);
	}

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

	async logoutUser(logoutUserDto: LogoutUserDto) {
		const { nickname } = logoutUserDto;
		const user = await this.userRepository.findOne({ nickname: nickname });
		if (!user) {
			throw new HttpException('Email or password doesn\'t match a registered user', HttpStatus.BAD_REQUEST);			
		}
		user.status = Status.OFFLINE;
		return this.userRepository.save(user);
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

		const { nickname } = userData;
		let user = await this.userRepository.findOne({nickname: nickname});
		if (user)
			return user;
		const newUser: User = await this.createUser(userData);
		return newUser;
	}

	async findUserByName(nickname: string): Promise<User>{
		const user = await this.userRepository.findOne({ nickname });
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}

}
