import { IsNotEmpty, IsOptional, IsString, IsAlphanumeric} from "class-validator";

export class CreateChannelDto {
    @IsString()
    @IsNotEmpty()
    readonly channame: string

    @IsAlphanumeric()
    @IsOptional()
    readonly password: string
}