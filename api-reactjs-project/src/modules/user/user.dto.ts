import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProfileUserDto {
  @IsNotEmpty()
  fullname: string;
  @IsEmail()
  email: string;
  @IsOptional()
  phone: string;
  @IsOptional()
  avatarUrl: string;
  studentId: string | (() => string);
}
