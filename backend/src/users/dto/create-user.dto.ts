import	{ 	IsString,
			IsEmail,
			IsNotEmpty,
			IsAlpha,
			IsOptional
		} from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@IsAlpha()
	readonly nickname: string;

	@IsEmail()
	@IsNotEmpty()
	@IsOptional()
	readonly email: string;

	//TODO take either email or nickname

	@IsNotEmpty()
	readonly password: string;

}
