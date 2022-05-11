import	{ 	IsString,
	IsEmail,
	IsNotEmpty
} from 'class-validator';

export class LoginUserDto {
	@IsEmail()
	@IsNotEmpty()
	readonly email: string;

	//TODO take either nickname or email

	@IsString()
	@IsNotEmpty()
	readonly password: string;
}
