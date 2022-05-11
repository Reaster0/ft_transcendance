import 	{ 	Injectable,
			NotFoundException
		} from '@nestjs/common';
import 	{	Connection,
			Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import 	{ User } from './entities/user.entity';
import 	{ CreateUserDto } from './dto/create-user.dto';
import 	{ UpdateUserDto } from './dto/update-user.dto';


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
		const user = this.userRepository.create({
			...createUserDto,
		});
		return this.userRepository.save(user);
	}

	async updateUser(id: string, updateUserDto: UpdateUserDto) {
		const user = await this.userRepository.preload({
			id: id,
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
}
