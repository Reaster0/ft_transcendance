import { IsNotEmpty, IsOptional, IsString, IsAlphanumeric, isString, isNotEmpty} from "class-validator";

export class CreateChannelDto {
    @IsString()
    @IsNotEmpty()
    readonly channame: string

    @IsAlphanumeric()
    @IsOptional()
    readonly password: string
}

export class InviteDto {
    @IsString()
    @IsNotEmpty()
    readonly chanId: string

    @IsString()
    @IsNotEmpty()
    readonly invitedUserId: string
}