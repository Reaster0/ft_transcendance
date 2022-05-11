import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
// TODO (--) check (maybe not here) than change can only affect pseudo
// TODO (->) friends or avatar

