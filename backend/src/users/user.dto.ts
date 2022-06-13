import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsAlphanumeric,
  MinLength,
  MaxLength,
} from 'class-validator';

// DTO for user registration //
export class CreateUserDto {
  @ApiProperty({ type: String, description: 'Private username for identifications. Will be stocked in background, but used as nickname in a first time.' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;
}

// DTO for user modification //
export class UpdateUserDto {
  @ApiProperty({ type: String, description: 'nickname' })
  @IsAlphanumeric()
  @MinLength(4)
  @MaxLength(15)
  @IsNotEmpty()
  readonly nickname: string;
}

export class FriendDto {
  @ApiProperty({ type: String, description: 'possible nickname of friend to add/remove'})
  @IsAlphanumeric()
  @MinLength(4)
  @MaxLength(15)
  @IsNotEmpty()
  readonly nickname: string;

}
