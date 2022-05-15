import { UsersService } from './users.service';
import { Body, Controller, Param, Post, Patch, Delete, Get, 
	ClassSerializerInterceptor, UseInterceptors, UseGuards, Req,
	UploadedFile } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags,
	ApiAcceptedResponse, ApiNotFoundResponse, ApiOkResponse, 
	ApiOperation } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from './guards/userAuth.guard';
import { Request } from 'express';
import { UpdateResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	// TODO make sure that id can't be something else than number (validation Pipes ?)
	// TODO protect routes
	// TODO make sur that id is in correct range if possible

	@Get()
	@ApiOperation({summary: 'Get list of all users' })
	@ApiOkResponse({ description: 'List of all users.' })
	findAllUsers() : Promise<User[]> {
		return this.usersService.findAllUsers();
	}

	@Get('logged')
	@ApiOperation({summary: 'I don\'t know'})
	@ApiOkResponse({ description: 'Return content of one users.', type: User })
	@ApiNotFoundResponse({ description: 'User with given id not found.' })
	@UseGuards(AuthGuard('jwt'))
	logged(@Req() req: Request): boolean {
		const token = req.cookies['jwt'];
		if (!token)
			return false;
		return true;
	}

	@Get(':id')
	@ApiOperation({summary: 'Get info of one user'})
	@ApiOkResponse({ description: 'Return content of one users.',  type: User })
	@ApiNotFoundResponse({ description: 'User with given id not found.' })
	findSpecificUser(@Param('id') id: number) : Promise<User> {
		return this.usersService.findUserById('' + id); // TODO check other way to do that
	}

	@Post('register')
	@ApiOperation({summary: 'Register an user'})
	@ApiCreatedResponse({ description: 'The user has been successfully registered.', type : User })
	@ApiBadRequestResponse()
	createUser(@Body() createUserDto: CreateUserDto) : Promise <User> {
		return this.usersService.retrieveOrCreateUser(createUserDto);
	}

	@Post('login')
	@ApiOperation({summary: 'Login an user'})
	@ApiCreatedResponse({ description: 'The user has been successfully login.', type : User })
	@ApiBadRequestResponse({ description: 'Couldn\'t login user (nickname/password incorrect) or already logged in user.' })
	loginUser(@Body('username') username: string) : Promise<UpdateResult> {
		return this.usersService.loginUser(username);
	}

	@Post('logout')
	//@UseGuards(AuthGuard('jwt'), UserAuth)
	@ApiOperation({summary: 'Logout an user'})
	@ApiCreatedResponse({ description: 'The user has been successfully logout.', type : User })
	@ApiBadRequestResponse({ description: 'Couldn\'t logout user, incorrect nickname' })
	logoutUser(@Body('username') username: string) : Promise<UpdateResult> {
		return this.usersService.logoutUser(username);
	}

	@Post('avatar')
	@ApiOperation({summary: 'Set an avatar'})
	@UseInterceptors(FileInterceptor('file'))
	setAvatar(@Body('username') username: string, @UploadedFile() file: Express.Multer.File) {
		return this.usersService.addAvatar(username, file.buffer);
	}

	@Patch(':id')	
	@ApiOperation({summary: 'Modify infos of an user'})
	@ApiOkResponse({ description: 'User successfully modified.', type: User })
	@ApiBadRequestResponse({ description: 'New nickname or email already in use.' })
	@ApiNotFoundResponse({ description: 'Id of user to update is incorrect.' })
	updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) : Promise<User> {
		return this.usersService.updateUser(id, updateUserDto);
	}

	@Delete(':id')
	@ApiOperation({summary: 'Delete an user'})
	@ApiOkResponse({ description: 'User successfully deleted.', type: User })
	@ApiNotFoundResponse({ description: 'Id of user to remove is incorrect.' })
	removeUser(@Param('id') id: string) : Promise<User> {
		return this.usersService.removeUser(id);
	}

}
