import 	{ 	UsersService } from './users.service';
import	{ 	Body,
			Controller,
			Param,
			Post,
			Patch,
			Delete,
			Get,
			Query,
			HttpCode,
			ClassSerializerInterceptor,
			UseInterceptors } from '@nestjs/common';
import 	{	CreateUserDto,
			UpdateUserDto,
			LoginUserDto,
			LogoutUserDto } from './dto/user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	// TODO protect routes
	@Get()
	findAllUsers() {
		// TODO add pagination query ?
		return this.usersService.findAllUsers();
	}

	@Get(':id')
	findSpecificUser(@Param('id') id: number) {
		return this.usersService.findSpecificUser('' + id); // TODO check other way to do that
	}

	@Post('register')
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.usersService.createUser(createUserDto);
	}

	@Post('login')
	loginUser(@Body() loginUserDto: LoginUserDto) {
		return this.usersService.loginUser(loginUserDto);
	}

	@Post('logout')
	logoutUser(@Body() logoutUserDto: LogoutUserDto) {
		return this.usersService.logoutUser(logoutUserDto);
	}

	@Patch(':id')
	updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateUser(id, updateUserDto);
	}

	@Delete(':id')
	removeUser(@Param('id') id: string) {
		return this.usersService.removeUser(id);
	}
}
