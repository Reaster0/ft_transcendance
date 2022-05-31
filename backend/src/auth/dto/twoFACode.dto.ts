import { IsNotEmpty, IsString } from 'class-validator';

export class twoFACodeDto {
  @IsString()
  @IsNotEmpty()
  twoFACode: string;
}
