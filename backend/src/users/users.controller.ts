import { UsersService } from './users.service';
import { Body, Controller, Param, Post, Patch, Delete, Get, 
		ClassSerializerInterceptor, UseInterceptors, UseGuards, Req,
		UploadedFile } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags,
		ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUser } from './guards/userAuth.guard'
import { RequestUser } from 'src/auth/interfaces/requestUser.interface';
import { Status } from '../common/enums/status.enum';


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
	@ApiOperation({summary: 'Check if user is logged through token.'})
	@ApiOkResponse({ description: 'Return true or false according if the user is logged or not.', type: Boolean })
	@ApiNotFoundResponse({ description: 'Not found.' })
	@UseGuards(AuthGuard('jwt'), AuthUser)
	logged(@Req() req: Request): boolean {
		const token = req.cookies['jwt'];
		if (!token)
			return false;
		return true;
	}

	@Get('2fa')
	@UseGuards(AuthGuard('jwt'), AuthUser)
	change2FAState(@Req() req: RequestUser) {
		const user: User = req.user;
		return this.usersService.modify2FA(user.id);
	}

	@Get(':id')
	@ApiOperation({summary: 'Get info of one user'})
	@ApiOkResponse({ description: 'Return content of one users.',  type: User })
	@ApiNotFoundResponse({ description: 'User with given id not found.' })
	findSpecificUser(@Param('id') id: number) : Promise<User> {
		return this.usersService.findUserById('' + id); // TODO check other way to do that
	}

	// TODO just to test
	@Post('decrypt')
	@ApiOperation({summary: 'Get info of one user'})
	@ApiOkResponse({ description: 'Return content of one users.',  type: User })
	@ApiNotFoundResponse({ description: 'User with given id not found.' })
	decrypt(@Body('username') username: string) : Promise<string> {
		return this.usersService.getSecret(username);
	}

	@Post('get_or_register')
	@ApiOperation({summary: 'Retrieve existing user or register new user'})
	@ApiCreatedResponse({ description: 'The user has been successfully retrieved or registered.', type : User })
	@ApiBadRequestResponse()
	retrieveOrCreateUser(@Body() createUserDto: CreateUserDto) : Promise <User> {
		return this.usersService.retrieveOrCreateUser(createUserDto);
	}

	@Post('login')
	@ApiOperation({summary: 'Login an user'})
	@ApiCreatedResponse({ description: 'The user has been successfully login.', type : User })
	@ApiBadRequestResponse({ description: 'Couldn\'t login user, user not found.' })
	loginUser(@Body('username') username: string)  {
		return this.usersService.changeStatus(username, Status.ONLINE);
	}

	@Post('logout')
	//@UseGuards(AuthGuard('jwt'), UserAuth)
	@ApiOperation({summary: 'Logout an user'})
	@ApiCreatedResponse({ description: 'The user has been successfully logout.', type : User })
	@ApiBadRequestResponse({ description: 'Couldn\'t logout user, user not found.' })
	logoutUser(@Body('username') username: string) : Promise<UpdateResult> {
		return this.usersService.changeStatus(username, Status.OFFLINE);
	}

	@Post('avatar')
	@ApiOperation({summary: 'Upload an avatar'})
	@UseInterceptors(FileInterceptor('file'))
	uploadAvatar(@Body('username') username: string, @UploadedFile() file: Express.Multer.File) {
		return this.usersService.addAvatar(username, file.buffer);
	}

	@Post('secret')
	@ApiOperation({summary: 'Set 2FA secret'})
	@ApiBadRequestResponse({ description: 'Couldn\'t set secret: User not found.' })
	set2FASecret(@Body('id') id: number, @Body('secret') secret: string) {
		return this.usersService.setTwoFASecret(secret, id);
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
