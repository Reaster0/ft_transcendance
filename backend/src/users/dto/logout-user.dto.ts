import	{
			IsString,
			IsNotEmpty
		} from 'class-validator';

export class LogoutUserDto {
	@IsString()
	@IsNotEmpty()
	readonly nickname: string;
}
