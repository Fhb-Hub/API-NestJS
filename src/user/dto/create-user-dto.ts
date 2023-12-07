import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { Role } from "src/enums/role.enum";

export class CreateUserDTO {

    @IsString()
    name: string;

    @IsOptional()
    @IsDateString()
    birthday: string;

    @IsEmail()
    email: string;

    @IsStrongPassword({
        minLength: 6
    })
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role: number;
}