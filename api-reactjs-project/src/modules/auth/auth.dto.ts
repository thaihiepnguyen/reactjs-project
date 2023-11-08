import {IsEmail, IsNotEmpty} from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  fullname: string;
  @IsNotEmpty()
  password: string;
  @IsEmail()
  email: string;
}

export class LoginDto {
  @IsNotEmpty()
  password: string;
  @IsEmail()
  email: string;
}