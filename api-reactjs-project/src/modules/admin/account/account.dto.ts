import {IsBoolean, IsEmail, IsNumber, IsOptional, IsString} from "class-validator";

export class ActiveAccountDto {
  @IsBoolean()
  isActive: boolean;
}

export class AddAccountDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullname: string;

  @IsString()
  role: number;

  @IsString()
  @IsOptional()
  phone: number;

  @IsString()
  isActive: boolean;

  @IsOptional()
  avatarUrl: string;
}

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  @IsEmail()
  email: string | undefined;

  @IsString()
  @IsOptional()
  avatarUrl: string | undefined

  @IsString()
  @IsOptional()
  password: string | undefined;

  @IsString()
  @IsOptional()
  fullname: string | undefined;

  @IsNumber()
  @IsOptional()
  roleId: number | undefined;
}

