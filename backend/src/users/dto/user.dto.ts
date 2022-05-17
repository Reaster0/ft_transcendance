import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import	{ 	IsString, IsEmail, IsNotEmpty, IsAlpha, IsOptional, isAlphanumeric, isString, IsAlphanumeric, MinLength, MaxLength
	} from 'class-validator';

// TODO set rules for password (length, etc...)

// DTO for user registration //
export class CreateUserDto {
	@ApiProperty({ type: String, description: 'The name identifying the user. \
		Must only contains alphabetical characters.' })
	@IsAlphanumeric()
	@IsNotEmpty()
	@IsAlpha()
	readonly nickname: string;

	@ApiPropertyOptional({ type: String, description: 'The user email address.\
		 Optionnal and under email format.' })
	@IsEmail()
	@IsNotEmpty()
	readonly email: string;

	/* not used so far
	@ApiProperty({ type: String, description: 'A Password useful for futures \
		user identifications.' })
	@IsNotEmpty()
	readonly password: string;
	*/

	@ApiProperty({ type: String, description: 'Private username for identifications.' })
	@IsString()
	@IsNotEmpty()
	readonly username: string;
}

// DTO for user modification //
//export class UpdateUserDto extends PartialType(CreateUserDto) {} not any more

export class UpdateUserDto {
	@IsAlphanumeric()
	@MinLength(4)
	@MaxLength(15)
	@IsOptional()
	@ApiProperty({type: String, description: 'nickname'})
	nickname: string;

	@IsEmail()
	@ApiProperty({type: String, description: 'email'})
	@IsOptional()
	email: string
}

// DTO for user logging in //
export class LoginUserDto {
	@ApiProperty({ type: String, description: 'The nickname of the user signing in.' })
	@IsNotEmpty()
	@IsString()
	readonly nickname: string;

	@ApiProperty({ type: String, description: 'The password of the user signing in.' })
	@IsString()
	@IsNotEmpty()
	readonly password: string;
}

// DTO for user logging out //
/* not used
export class LogoutUserDto {
	@ApiProperty({ type: String, description: 'The nickname of the user logging out.' })
	@IsString()
	@IsNotEmpty()
	readonly nickname: string;
}
*/