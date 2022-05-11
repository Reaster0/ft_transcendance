import	{ 	IsString,
			IsEmail,
			IsNotEmpty,
			IsAlpha
		} from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@IsAlpha()
	readonly nickname: string;

	@IsEmail()
	@IsNotEmpty()
	readonly email: string;

	@IsNotEmpty()
	readonly password: string;


	// TODO: implement others parameters from user.entity.ts
}
