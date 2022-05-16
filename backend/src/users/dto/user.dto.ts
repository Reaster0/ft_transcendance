import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import	{ 	IsString, IsEmail, IsNotEmpty, IsAlpha, IsOptional
	} from 'class-validator';

// TODO set rules for password (length, etc...)

// DTO for user registration //
export class CreateUserDto {
	@ApiProperty({ type: String, description: 'Private username for identifications. Will be stocked in background, but used as nickname in a first time.' })
	@IsNotEmpty()
	@IsString()
	readonly username: string;
	
	@ApiProperty({ type: String, description: 'The nickname identifying the user. Must only contains alphabetical characters.' })
	@IsString()
	@IsOptional()
	readonly nickname: string;

	@ApiPropertyOptional({ type: String, description: 'The user email address. Under email format.' })
	@IsEmail()
	readonly email: string;

	@ApiProperty({ type: Uint8Array, description: 'User\'s avatar'})
	readonly avatar?: Uint8Array;
	//TODO set as non optional
}

// DTO for user modification //
export class UpdateUserDto extends PartialType(CreateUserDto) {}
