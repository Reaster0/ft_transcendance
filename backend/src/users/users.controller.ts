import { UsersService } from './services/users.service';
import { Body, Controller, Param, Post, Get, ClassSerializerInterceptor, UseInterceptors,
  UseGuards, Req, Query, Patch, Res, UploadedFile, Delete, ParseIntPipe, HttpException,
  HttpStatus, Logger } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags, ApiNotFoundResponse,
  ApiOkResponse, ApiOperation, ApiForbiddenResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from './guards/userAuth.guard';
import { Response } from 'express';
import { RequestUser } from 'src/auth/interfaces/requestUser.interface';
import { Status } from '../common/enums/status.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarsService } from './services/avatars.service';
import { extname } from 'path';
import jwt_decode from 'jwt-decode';

export const avatarOptions = {
  limits: { fileSize: 1024 * 1024 },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(`Unsupported file type ${extname(file.originalname)}`, 
          HttpStatus.BAD_REQUEST), false);
    }
  }
};

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly avatarsService: AvatarsService,
  ) {}

  private logger: Logger = new Logger('UserController');

  @Get('logged')
  @UseGuards(AuthGuard('jwt')) // modification for evan
  /** Swagger **/
  @ApiOperation({ summary: 'Check if user is logged through token.' })
  @ApiOkResponse({ description: "Return true if the User is properly logged else: return 401 if the token is absent and 418 if it doesn't make tea.", type: Boolean })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiForbiddenResponse({ description: 'Only logged users can access it.' })
  /** End of swagger **/
  logged(@Req() req: RequestUser): boolean {
    this.logger.log("Get('logged') route called by user " + req.user.username + ' (username)');
    const user: User = req.user;
    if (user.is2FAEnabled === true) {
      const token = req.cookies['jwt'];
      const decode = jwt_decode(token);
      if (decode['twoFA'] === false)
        throw new HttpException('Please validate our 2fa', 418);
    }
    return true;
  }

  @Get('/currentUser')
  @UseGuards(AuthGuard('jwt'), AuthUser)
  /** Swagger **/
  @ApiOperation({ summary: 'Get all info of current user' })
  @ApiOkResponse({ description: 'Return partial user.' })
  @ApiForbiddenResponse({ description: 'Only logged users can access it.' })
  /** End of swagger **/
  currentUser(@Req() req: RequestUser): Partial<User> {
    this.logger.log("Get('currentUser') route called by user " + req.user.username + ' (username)');
    const user: User = req.user;
    return this.usersService.currentUser(user);
  }

  @Get('/userInfo')
  @UseGuards(AuthGuard('jwt'), AuthUser)
  /** Swagger **/
  @ApiOperation({ summary: 'User Informations' })
  @ApiOkResponse({ description: 'User Informations' })
  @ApiForbiddenResponse({ description: 'Only logged users can access it.' })
  /** End of swagger **/
  userInfo(@Query('username') username: string): Promise<Partial<User>> {
    this.logger.log("Get('userInfo') route called for user " + username + ' (username)');
    return this.usersService.userInfo(username);
  }

  @Get('/partialInfo')
  @UseGuards(AuthGuard('jwt'), AuthUser)
  /** Swagger **/
  @ApiOperation({ summary: 'Partial User Information' })
  @ApiOkResponse({ description: 'Partial User Information using id' })
  @ApiForbiddenResponse({ description: 'Only logged users can access it.' })
  /** End of swagger **/
  getPartialUserInfo(@Query('userId') userId: string): Promise<Partial<User>> {
    this.logger.log("Get('partialInfo') route called for user " + userId + ' (user id)');
    return this.usersService.getPartialUserInfo(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), AuthUser)
  /** Swagger **/
  @ApiOperation({ summary: 'Get info of one user according to its id.' })
  @ApiOkResponse({ description: "Return content of one users depending on it's id.", type: User })
  @ApiNotFoundResponse({ description: 'User with given id not found.' })
  @ApiForbiddenResponse({ description: 'Only logged users can access it.' })
  /** End of swagger **/
  findSpecificUser(@Param('id') id: number): Promise<User> {
    this.logger.log("Get(':id') route.");
    return this.usersService.findUserById('' + id);
  }

  @Get('getAvatar/:id')
  @UseGuards(AuthGuard('jwt'), AuthUser)
  /** Swagger **/
  @ApiOperation({ summary: "Getting avatar by it's avatar id." })
  @ApiOkResponse({ description: 'Return avatar' })
  @ApiNotFoundResponse({ description: 'User with given username not found.' })
  @ApiForbiddenResponse({ description: 'Only logged users can access it.' })
  /** End of swagger **/
  getAvatar(@Param('id', ParseIntPipe) id: number, @Res({ passthrough: true }) res) {
    this.logger.log("Get('getAvatar/:id') route called.");
    return this.usersService.getAvatarByAvatarId(id, res);
  }

  @Get('getHistory/:id')
  @UseGuards(AuthGuard('jwt'), AuthUser)
  /** Swagger **/
  @ApiOperation({ summary: "Getting game history as array of GameHistory." })
  @ApiOkResponse({ description: 'Return game history.' })
  @ApiNotFoundResponse({ description: 'User with given id not found.' })
  @ApiForbiddenResponse({ description: 'Only logged users can access it.' })
  /** End of swagger **/
  async getHistory(@Param('id') id: string) {
    this.logger.log("Get('getHistory/:id') route called.");
    const user = await this.usersService.findUserById(id);
    return this.usersService.getGameHistory(user);
  }

  @Post('getOrRegister')
  @UseGuards(AuthGuard('jwt'))
  /** Swagger **/
  @ApiOperation({ summary: 'Retrieve existing user or register new user' })
  @ApiCreatedResponse({ description: 'The user has been successfully retrieved or registered.', type: User})
  @ApiBadRequestResponse()
  /** End of swagger **/
  retrieveOrCreateUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    this.logger.log("Post('getOrRegister') route called for user " + createUserDto.username + ' (username)');
    return this.usersService.retrieveOrCreateUser(createUserDto);
  }

  @Post('uploadAvatar')
  @UseInterceptors(FileInterceptor('avatar', avatarOptions))
  @UseGuards(AuthGuard('jwt'), AuthUser)
  /** Swagger **/
  @ApiOperation({ summary: 'Upload an avatar and store it in database.' })
  @ApiForbiddenResponse({ description: 'Only logged users can access it.' })
  /** End of swagger **/
  uploadAvatar(@Req() req: RequestUser, @UploadedFile() file: Express.Multer.File) {
    this.logger.log("Post('uploadAvatar') route called by user " + req.user.username + ' (username)');
    return this.usersService.addAvatar(req.user, file.originalname, file.buffer);
  }

  @Post('secret')
  @UseGuards(AuthGuard('jwt'), AuthUser)
  /** Swagger **/
  @ApiOperation({ summary: 'Set 2FA secret' })
  @ApiForbiddenResponse({ description: 'Only logged users can access it.' })
  /** End of swagger **/
  set2FASecret(@Req() req: RequestUser, @Body('secret') secret: string) {
    this.logger.log("Post('secret') route called by user " + req.user.username + ' (username)');
    return this.usersService.setTwoFASecret(req.user, secret);
  }

  @Patch('settings')
  @UseGuards(AuthGuard('jwt'), AuthUser)
  /** Swagger **/
  @ApiOperation({
    summary: 'Update user info (from user perspective)',
    description: 'Update username or email',
  })
  @ApiOkResponse({ description: 'User account' })
  @ApiForbiddenResponse({ description: 'Only logged users can access it.' })
  /** End of swagger **/
  updateUser(@Body() updateUser: UpdateUserDto, @Req() req: RequestUser, @Res({ passthrough: true }) res: Response) {
    this.logger.log("Post('settings') route called by user " + req.user.username + ' (username)');
    return this.usersService.updateUser(req.user, updateUser);
  }

  @Patch('login')
  @UseGuards(AuthGuard('jwt'), AuthUser)
  /** Swagger **/
  @ApiOperation({ summary: 'Login an user when joining chat websocket' })
  @ApiCreatedResponse({ description: 'The user has been successfully login.', type: User})
  /** End of swagger **/
  loginUser(@Req() req: RequestUser) {
    this.logger.log("Patch('login') route called by user " + req.user.username + ' (username)');
    return this.usersService.changeStatus(req.user, Status.ONLINE);
  }

  @Patch('logout')
  @UseGuards(AuthGuard('jwt'), AuthUser)
  /** Swagger **/
  @ApiOperation({ summary: 'Logout an user' })
  @ApiCreatedResponse({ description: 'The user has been successfully logout.' })
  /** End of swagger **/
  logoutUser(@Req() req: RequestUser, @Res({ passthrough: true }) res: Response) {
    this.logger.log("Patch('logout') route called by user " + req.user.username + ' (username)');
    this.usersService.changeStatus(req.user, Status.OFFLINE);
    res.clearCookie('jwt');
  }

  @Delete('deleteAccount')
  /** Swagger **/
  @ApiOperation({ summary: 'Delete an user' })
  @ApiOkResponse({ description: 'User successfully deleted.', type: User })
  /** End of swagger **/
  removeUser(@Req() req: RequestUser, @Res({ passthrough: true }) res: Response) {
    this.logger.log("Delete('deleteAccount') route called by user " + req.user.username + ' (username)');
    this.usersService.removeUser(req.user);
    res.clearCookie('jwt');
  }
}
