import { IsString } from 'class-validator';

export class CreateUserDto {
	@IsString()
	readonly nickname: string;

	// TODO: implement others parameters from user.entity.ts
}
