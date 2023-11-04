import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsEmail()
  email: string;
}