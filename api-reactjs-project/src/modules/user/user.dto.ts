import {IsEmail, IsNotEmpty, IsOptional} from "class-validator";

export class UserDto {
  @IsNotEmpty()
  fullname: string;
  @IsNotEmpty()
  password: string;
  @IsEmail()
  email: string;
  @IsOptional()
  avatarUrl: string;
  @IsOptional()
  is_active: number;
  @IsOptional()
  role_id: number;
}
