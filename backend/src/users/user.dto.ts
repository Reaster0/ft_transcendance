import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsAlphanumeric,
  MinLength,
  MaxLength,
  IsNumber
} from 'class-validator';

// DTO for user registration //
export class CreateUserDto {
  @ApiProperty({
    type: String,
    description:
      'Private username for identifications. Will be stocked in background, but used as nickname in a first time.',
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    type: String,
    description: 'The user email address. Under email format.',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}

// DTO for user modification //
export class UpdateUserDto {
  @ApiProperty({ type: String, description: 'nickname' })
  @IsAlphanumeric()
  @MinLength(4)
  @MaxLength(15)
  @IsOptional()
  readonly nickname?: string;

  @ApiProperty({ type: String, description: 'email' })
  @IsEmail()
  @IsOptional()
  readonly email?: string;
}

export class UserStatsDto {
  @ApiProperty({ type: Number, description: 'number of matchs won' })
  @IsNumber()
  readonly nbMatchsWon: number;
 
  @ApiProperty({ type: Number, description: 'number of matchs lost' })
  @IsNumber()
  readonly nbMatchsLost: number;  

  @ApiProperty({ type: Number, description: 'Elo score, equivalent to level' })
  @IsNumber()
  readonly eloScore: number;  
}
