import { UsersService } from './users.service';
import { Body, Controller, Param, Post, Patch, Delete, Get, 
	ClassSerializerInterceptor, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, LoginUserDto, LogoutUserDto 
	} from './dto/user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags,
	ApiAcceptedResponse, ApiNotFoundResponse, ApiOkResponse, 
	ApiOperation } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from './guards/userAuth.guard';
import { Request } from 'express';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	// TODO make sure that id can't be something else than number (validation Pipes ?)
	// TODO protect routes
	// TODO make sur that id is in correct range if possible

	@ApiOperation({summary: 'Get list of all users'})
	@ApiOkResponse({ 
		description: 'List of all users.'
	})
	@Get()
	findAllUsers() : Promise<User[]> {
		// TODO add pagination query ?
		return this.usersService.findAllUsers();
	}

	@ApiOperation({summary: 'I don\'t know'})
	@ApiOkResponse({
		description: 'Return content of one users.', 
		type: User
	})
	@ApiNotFoundResponse({ 
		description: 'User with given id not found.'
	})
	@UseGuards(AuthGuard('jwt'))
	@Get('logged')
	logged(@Req() req: Request): boolean {
		const token = req.cookies['jwt'];
		if (!token)
			return false;
		return true;
	}

	@ApiOperation({summary: 'Get info of one user'})
	@ApiOkResponse({
		description: 'Return content of one users.', 
		type: User
	})
	@ApiNotFoundResponse({ 
		description: 'User with given id not found.'
	})
	@Get(':id')
	findSpecificUser(@Param('id') id: number) : Promise<User> {
		return this.usersService.findSpecificUser('' + id); // TODO check other way to do that
	}

	@ApiOperation({summary: 'Register an user'})
	@ApiCreatedResponse({ 
		description: 'The user has been successfully registered.',
		type : User
	})
	@ApiBadRequestResponse()
	@Post('register')
	createUser(@Body() createUserDto: CreateUserDto) : Promise <User> {
		return this.usersService.createUser(createUserDto);
	}

	@ApiOperation({summary: 'Login an user'})
	@ApiCreatedResponse({ 
		description: 'The user has been successfully login.',
		type : User
	})
	@ApiBadRequestResponse({ 
		description: 'Couldn\'t login user (nickname/password incorrect) or \
		already logged in user.'
	})
	@Post('login')
	loginUser(@Body() loginUserDto: LoginUserDto) : Promise<User> {
		return this.usersService.loginUser(loginUserDto);
	}

	
	//@UseGuards(AuthGuard('jwt'), UserAuth)
	@ApiOperation({summary: 'Logout an user'})
	@ApiCreatedResponse({ 
		description: 'The user has been successfully logout.',
		type : User,
	})
	@ApiBadRequestResponse({
		description: 'Couldn\'t logout user, incorrect nickname'
	})
	@Post('logout')
	logoutUser(@Body() logoutUserDto: LogoutUserDto) : Promise<User> {
		return this.usersService.logoutUser(logoutUserDto);
	}

	@ApiOperation({summary: 'Modify infos of an user'})
	@ApiOkResponse({
		description: 'User successfully modified.',
		type: User
	})
	@ApiBadRequestResponse({ 
		description: 'New nickname or email already in use.'
	})
	@ApiNotFoundResponse({
		description: 'Id of user to update is incorrect.'
	})
	@Patch(':id')
	updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) : Promise<User> {
		return this.usersService.updateUser(id, updateUserDto);
	}

	@ApiOperation({summary: 'Delete an user'})
	@ApiOkResponse({
		description: 'User successfully deleted.',
		type: User
	})
	@ApiNotFoundResponse({
		description: 'Id of user to remove is incorrect.'
	})
	@Delete(':id')
	removeUser(@Param('id') id: string) : Promise<User> {
		return this.usersService.removeUser(id);
	}

}
