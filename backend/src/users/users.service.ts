import 	{ 	Injectable,
			NotFoundException,
			HttpException,
			HttpStatus
		} from '@nestjs/common';
import 	{	Connection,
			Repository
		} from 'typeorm';
import	{ InjectRepository } from '@nestjs/typeorm';
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
		return this.userRepository.remove(user);
	}

	async loginUser(loginUserDto: LoginUserDto) {
		const { email, password } = loginUserDto;
		const user = await this.userRepository.findOne({ email: email });
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
		const { nickname } = logoutUserDto;
		const user = await this.userRepository.findOne({ nickname: nickname });
		if (!user) {
			throw new HttpException('Email or password doesn\'t match a registered user', HttpStatus.BAD_REQUEST);			
		}
		user.changeStatus('offline');
		return this.userRepository.save(user);
	}
	// TODO how to check if user leave app ? => When user not in chat or playing
	// TODO (checks throught websockets and modify status accordingly)

	// TODO : function to modify elo, maybe use an elo-calculator
}
