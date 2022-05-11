import	{
			IsEmail,
			IsNotEmpty
		} from 'class-validator';

export class LogoutUserDto {
	@IsEmail()
	@IsNotEmpty()
	readonly email: string;
}
