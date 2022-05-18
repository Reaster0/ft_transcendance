import { UsersService } from './users.service';
import { Body, Controller, Param, Post, Get, ClassSerializerInterceptor, 
		UseInterceptors, UseGuards, Req, Query, Patch, Res, UploadedFile,
		Delete } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags,
		ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiForbiddenResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from './guards/userAuth.guard';
import { Request, Response } from 'express';
import { RequestUser } from 'src/auth/interfaces/requestUser.interface';
import { Status } from '../common/enums/status.enum';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@UseGuards(AuthGuard('jwt'), AuthUser)
	/** Swagger **/
	@ApiOperation({summary: 'Get list of all users' })
	@ApiOkResponse({ description: 'List of all users.' })
	@ApiForbiddenResponse({ description: 'Only logged users can access it.'})
	/** End of swagger **/	
	findAllUsers() : Promise<User[]> {
		return this.usersService.findAllUsers();
	}

	@Get('logged')
	@UseGuards(AuthGuard('jwt'), AuthUser)
	/** Swagger **/
	@ApiOperation({summary: 'Check if user is logged through token.'})
	@ApiOkResponse({ description: 'Return true or false according if the user is logged or not.', type: Boolean })
	@ApiNotFoundResponse({ description: 'Not found.' })
	@ApiForbiddenResponse({ description: 'Only logged users can access it.'})
	/** End of swagger **/
	logged(@Req() req: Request): boolean {
		const token = req.cookies['jwt'];
		if (!token)
			return false;
		return true;
	}

	@Get('/currentUser')
	@UseGuards(AuthGuard('jwt'), AuthUser)
	/** Swagger **/
	@ApiOperation({ summary: 'Get all info of current user' })
	@ApiOkResponse({ description: 'Return partial user.' })
	@ApiForbiddenResponse({ description: 'Only logged users can access it.'})
	/** End of swagger **/
	currentUser(@Req() req: RequestUser) : Promise<Partial<User>> {
		const user: User = req.user;
		return this.usersService.currentUser(user);
	}

	@Get('/userInfo')
	@UseGuards(AuthGuard('jwt'), AuthUser)
	/** Swagger **/
	@ApiOperation({ summary: 'User Informations' })
	@ApiOkResponse({ description: 'User Informations' })
	@ApiForbiddenResponse({ description: 'Only logged users can access it.'})
	/** End of swagger **/
	userInfo(@Query('username') username: string): Promise<Partial<User>> {
		return this.usersService.userInfo(username);
	}

	@Get('/partialInfo')
	@UseGuards(AuthGuard('jwt'), AuthUser)
	/** Swagger **/
	@ApiOperation({ summary: 'Partial User Information' })
	@ApiOkResponse({ description: 'Partial User Information using id' })
	@ApiForbiddenResponse({ description: 'Only logged users can access it.'})
	/** End of swagger **/
	getPartialUserInfo(@Query('userId') userId: string): Promise<Partial<User>> {
		return this.usersService.getPartialUserInfo(userId);
	}

	@Get('2fa')
	@UseGuards(AuthGuard('jwt'), AuthUser)
	/** Swagger **/
	@ApiOperation({ summary: 'Activate or deactivate 2FA, depending on previous state.' })
	@ApiOkResponse({ description: 'State of 2FA changed.' })
	@ApiForbiddenResponse({ description: 'Only logged users can access it.'})
	/** End of swagger **/
	change2FAState(@Req() req: RequestUser) {
		const user = req.user;
		return this.usersService.modify2FA(user);
	}

	@Get(':id')
	@UseGuards(AuthGuard('jwt'), AuthUser)
	/** Swagger **/
	@ApiOperation({ summary: 'Get info of one user according to its id.' })
	@ApiOkResponse({ description: 'Return content of one users depending on it\'s id.',  type: User })
	@ApiNotFoundResponse({ description: 'User with given id not found.' })
	@ApiForbiddenResponse({ description: 'Only logged users can access it.'})
	/** End of swagger **/
	findSpecificUser(@Param('id') id: number) : Promise<User> {
		return this.usersService.findUserById('' + id);
	}

	@Post('getOrRegister')
	/** Swagger **/
	@ApiOperation({summary: 'Retrieve existing user or register new user'})
	@ApiCreatedResponse({ description: 'The user has been successfully retrieved or registered.', type : User })
	@ApiBadRequestResponse()
	/** End of swagger **/
	retrieveOrCreateUser(@Body() createUserDto: CreateUserDto) : Promise <User> {
		return this.usersService.retrieveOrCreateUser(createUserDto);
	}

	@Post('avatar')
	@UseInterceptors(FileInterceptor('file'))
	@UseGuards(AuthGuard('jwt'), AuthUser)
	/** Swagger **/
	@ApiOperation({summary: 'Upload an avatar'})
	@ApiForbiddenResponse({ description: 'Only logged users can access it.'})
	/** End of swagger **/
	uploadAvatar(@Req() req: RequestUser, @UploadedFile() file: Express.Multer.File) {
		return this.usersService.addAvatar(req.user, file.buffer);
	}

	@Post('secret')
	@UseGuards(AuthGuard('jwt'), AuthUser)
	/** Swagger **/
	@ApiOperation({summary: 'Set 2FA secret'})
	@ApiForbiddenResponse({ description: 'Only logged users can access it.'})
	/** End of swagger **/
	set2FASecret(@Req() req: RequestUser, @Body('secret') secret: string) {
		return this.usersService.setTwoFASecret(req.user, secret);
	}
	
	@Patch('settings')
	@UseGuards(AuthGuard('jwt'), AuthUser)
	/** Swagger **/
	@ApiOperation({ summary: 'Update user info (from user perspective)', description: 'Update username or email' })
	@ApiOkResponse({description: 'User account'})
	@ApiForbiddenResponse({ description: 'Only logged users can access it.'})
	/** End of swagger **/
	updateUser(@Body() updateUser: UpdateUserDto, @Req() req: RequestUser, @Res({passthrough: true}) res: Response): Promise<void> {
		return this.usersService.updateUser(req.user, updateUser);
	}

	@Patch('login')
	@UseGuards(AuthGuard('jwt'), AuthUser)
	/** Swagger **/
	@ApiOperation({summary: 'Login an user when joining chat websocket'})
	@ApiCreatedResponse({ description: 'The user has been successfully login.', type : User })
	@ApiForbiddenResponse({ description: 'Only logged users can access it.'})
	/** End of swagger **/
	loginUser(@Req() req: RequestUser)  {
		return this.usersService.changeStatus(req.user, Status.ONLINE);
	}
	
	@Patch('logout')
	@UseGuards(AuthGuard('jwt'), AuthUser)
	/** Swagger **/
	@ApiOperation({summary: 'Logout an user'})
	@ApiCreatedResponse({ description: 'The user has been successfully logout.' })
	@ApiForbiddenResponse({ description: 'Only logged users can access it.'})
	/** End of swagger **/
	async logoutUser(@Req() req: RequestUser, @Res({ passthrough: true }) res: Response) {
		this.usersService.changeStatus(req.user, Status.OFFLINE);
		res.clearCookie('jwt'); //test
		res.redirect(process.env.FRONTEND);
	}

	@Delete('deleteAccount')
	/** Swagger **/
	@ApiOperation({summary: 'Delete an user'})
	@ApiOkResponse({ description: 'User successfully deleted.', type: User })
	@ApiForbiddenResponse({ description: 'Only logged users can access it.'})
	/** End of swagger **/
	removeUser(@Req() req: RequestUser) : Promise<User> {
		return this.usersService.removeUser(req.user);
	}

}
