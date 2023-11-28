import {IsEmail, IsNotEmpty, IsOptional} from "class-validator";

export class UserDto {
  @IsNotEmpty()
  fullname: string;
  @IsNotEmpty()
  password: string;
  @IsEmail()
  email: string;
  @IsOptional()
  studentId: string;
  @IsOptional()
  avatarUrl: string;
  @IsOptional()
  is_active: number;
  @IsOptional()
  role_id: number;
  @IsOptional()
  phone: string;
}

export class UpdateProfileUserDto {
  @IsNotEmpty()
  fullname: string;
  @IsEmail()
  email: string;
  @IsOptional()
  phone: string;
  @IsOptional()
  avatarUrl: string;
}