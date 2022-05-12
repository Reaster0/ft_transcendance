import { PartialType } from '@nestjs/mapped-types';
import	{ 	IsString,
			IsEmail,
			IsNotEmpty,
			IsAlpha,
			IsOptional
		} from 'class-validator';

// DTO for user registration //
export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@IsAlpha()
	readonly nickname: string;

	@IsEmail()
	@IsOptional()
	readonly email: string;

	@IsNotEmpty()
	readonly password: string;
}

// DTO for user modification //
export class UpdateUserDto extends PartialType(CreateUserDto) {}

// DTO for user logging in //
export class LoginUserDto {
	@IsEmail()
	@IsNotEmpty()
	readonly nickname: string;

	@IsString()
	@IsNotEmpty()
	readonly password: string;
}

// DTO for user logging out //
export class LogoutUserDto {
	@IsString()
	@IsNotEmpty()
	readonly nickname: string;
}
