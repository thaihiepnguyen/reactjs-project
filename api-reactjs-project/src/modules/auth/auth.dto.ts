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

export class Data {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  image: string;
}

export class LoginSocialDto {
  [user: string]: Data;
}