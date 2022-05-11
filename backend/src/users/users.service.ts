import 	{ 	Injectable,
			NotFoundException,
			HttpException,
			HttpStatus
		} from '@nestjs/common';
import 	{	Connection,
			Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import 	{ User } from './entities/user.entity';
import 	{ CreateUserDto } from './dto/create-user.dto';
import 	{ UpdateUserDto } from './dto/update-user.dto';
import 	{ LoginUserDto } from './dto/login-user.dto';
import 	{ LogoutUserDto } from './dto/logout-user.dto';


@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
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
		let user = await this.userRepository.findOne({ where: { nickname }});
		if (user) {
			throw new HttpException('Nickname already in use', HttpStatus.BAD_REQUEST);
		}
		user = await this.userRepository.findOne({ where: { email }});
		if (user) {
			throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
		}
		user = this.userRepository.create(createUserDto);
		return this.userRepository.save(user);
	}

	async updateUser(id: string, updateUserDto: UpdateUserDto) {
		const { nickname, email } = updateUserDto;
		let user = await this.userRepository.findOne({ where: { nickname }});
		if (user) {
			throw new HttpException('Nickname already in use', HttpStatus.BAD_REQUEST);
		}
		user = await this.userRepository.findOne({ where: { email }});
		if (user) {
			throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
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
		const user = await this.findSpecificUser(id);
		return this.userRepository.remove(user);
	}

	async loginUser(loginUserDto: LoginUserDto) {
		const { email, password } = loginUserDto;
		const user = await this.userRepository.findOne({ where: { email }});
		if (!user) {
			throw new HttpException('Email doesn\'t match a registered user', HttpStatus.BAD_REQUEST);
		}
		if (!await user.comparePassword(password)) {
			throw new HttpException('Password doesn\'t match the one registered for this user', HttpStatus.BAD_REQUEST);
		}
		user.changeStatus('online');
		return this.userRepository.save(user);
	}

	async logoutUser(logoutUserDto: LogoutUserDto) {

		const { email } = logoutUserDto;
		const user = await this.userRepository.findOne({ where: { email }});
		if (!user) {
			throw new HttpException('Email or password doesn\'t match a registered user', HttpStatus.BAD_REQUEST);			
		}
		user.changeStatus('offline');
		return this.userRepository.save(user);
	}
	// TODO how to check if user leave app ?

	// TODO : function to modify elo, maybe use an elo-calculator
}
