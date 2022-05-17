import { UsersService } from './users.service';
import { Body, Controller, Param, Post, Patch, Delete, Get, 
	ClassSerializerInterceptor, UseInterceptors, UseGuards, Req, Query, Res } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags,
	ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiOperation } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from './guards/userAuth.guard';
import { Request, Response } from 'express';
import { boolean } from 'joi';
import { RequestUser } from 'src/auth/interfaces/requestUser.interface';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	// TODO make sure that id can't be something else than number (validation Pipes ?)
	// TODO protect routes
	// TODO make sur that id is in correct range if possible

	@ApiOkResponse({ 
		description: 'List of all users.'
	})
	//
	@UseGuards(AuthGuard('jwt'), AuthUser)
	@Get()
	findAllUsers() {
		// TODO add pagination query ?
		return this.usersService.findAllUsers();
	}

	@ApiOkResponse({description: 'True is a user is log in'})
	@ApiUnauthorizedResponse({description: 'Unauthorized if no cookie found'})
	//
	@UseGuards(AuthGuard('jwt'), AuthUser)
	@Get('logged')
	logged(@Req() req: Request): boolean {
		const token = req.cookies['jwt'];
		if (!token)
			return false;
		return true;
	}
	@ApiOperation({summary: 'Get all info of current user'})
	//
	@UseGuards(AuthGuard('jwt'), AuthUser)
	@Get('/currentUser')
	currentUser(@Req() req: RequestUser) : Promise<Partial<User>> {
		const user: User = req.user;
		return this.usersService.currentUser(user);
	}

	@ApiOperation({summary: 'User Informations'})
	@ApiOkResponse({description: 'User Informations'})
	//
	@UseGuards(AuthGuard('jwt'), AuthUser)
	@Get('/userInfo')
	userInfo(@Query('username') username: string): Promise<Partial<User>> {
		return this.usersService.userInfo(username);
	}

	@ApiOperation({summary: 'Partial User Information'})
	@ApiOkResponse({description: 'Partial User Information using id'})
	//
	@UseGuards(AuthGuard('jwt'), AuthUser)
	@Get('/partialInfo')
	getPartialUserInfo(@Query('userId') userId: string): Promise<Partial<User>> {
		return this.usersService.getPartialUserInfo(userId);
	}

	@UseGuards(AuthGuard('jwt'), AuthUser)
	@Get('2fa')
	change2FAState(@Req() req: RequestUser) {
		const user: User = req.user;
		return this.usersService.modify2FA(user.id);
	}

	@ApiCreatedResponse({ 
		description: 'The user has been successfully logout.',
//		type : User,
	})
	@ApiBadRequestResponse({
		description: 'Couldn\'t logout user, incorrect nickname'
	})
	//
	@UseGuards(AuthGuard('jwt'), AuthUser)
	@Get('logout')
	async logoutUser(@Req() req: RequestUser, @Res() res: Response){
		console.log('login out ...')
		this.usersService.logoutUser(req.user);
		res.clearCookie('jwt'); //test
		res.redirect(process.env.FRONTEND);
	}


	@ApiOkResponse({
		description: 'Using id: Return content of one users.', 
		type: User
	})
	@ApiNotFoundResponse({ 
		description: 'User with given id not found.'
	})
	//
//	@UseGuards(AuthGuard('jwt'), AuthUser)
	@Get(':id')
	findSpecificUser(@Param('id') id: number) {
		return this.usersService.findSpecificUser('' + id); // TODO check other way to do that
	}


	@ApiCreatedResponse({ 
		description: 'The user has been successfully registered.',
		type : User
	})
	@ApiBadRequestResponse()
	@UseGuards(AuthGuard('jwt'), AuthUser)
	@Post('register')
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.usersService.createUser(createUserDto);
	}

	/* not used
	@ApiCreatedResponse({ 
		description: 'The user has been successfully login.',
		type : User
	})
	@ApiBadRequestResponse({ 
		description: 'Couldn\'t login user (nickname/password incorrect) or \
		already logged in user.'
	})
	@Post('login')
	loginUser(@Body() loginUserDto: LoginUserDto) {
		return this.usersService.loginUser(loginUserDto);
	}
	*/

	@ApiOperation({
		summary: 'Update user info (from user perspective)',
		description: 'Update username or email'
	})
	@ApiOkResponse({description: 'User account'})
	/*******/
	@UseGuards(AuthGuard('jwt'), AuthUser)
	@Patch('/settings')
	updateUser(@Body() updateUser: UpdateUserDto, @Req() req: RequestUser, @Res({passthrough: true}) res: Response): Promise<void> {
		return this.usersService.updateUser(req.user, updateUser);
	}
	

	//may remove this
	/*
	@ApiOperation({
		summary: 'Update any user using ID: ONLY ADMIN STUFF',
		description: 'Update username or email'
	})
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
	////////
	@UseGuards(AuthGuard('jwt'), AuthUser) /// but in reality only for admin
	@Patch(':id')
	updateId(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateUser(id, updateUserDto);
	}
	*/

	@ApiOkResponse({
		description: 'User successfully deleted.',
		type: User
	})
	@ApiNotFoundResponse({
		description: 'Id of user to remove is incorrect.'
	})
	//@UseGuards(AuthGuard('jwt'), AuthUser)
	@Delete(':id')
	removeUser(@Param('id') id: string) {
		return this.usersService.removeUser(id);
	}

}
