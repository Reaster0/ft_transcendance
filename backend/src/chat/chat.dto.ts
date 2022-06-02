import { IsAlphanumeric, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateChannelDto {
    @IsString()
    @IsNotEmpty()
    readonly channame: string

    @IsAlphanumeric()
    @IsOptional()
    readonly password: string
}