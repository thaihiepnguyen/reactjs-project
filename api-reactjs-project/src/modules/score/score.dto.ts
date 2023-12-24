import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsObject, IsOptional, IsString } from "class-validator";

export class ColumnDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  scale: number;
}

export class CreateColumnDto {
  @IsNumber()
  courseId: number;

  @IsArray()
  columns: ColumnDto[];
}

export class AddScoreDto {
  @IsNumber()
  gradeId: number

  @IsNumber()
  studentId: number

  @IsNumber()
  score: number
}

export class AddScoreByStudentCodeDto {
  @IsNumberString()
  studentCode: string

  @IsObject()
  scores: TScore;

  @IsOptional()
  oldStudentId: string;
}

export class DeleteScoreByStudentCodeDto {
  @IsOptional()
  oldStudentId: string;
}

export interface TScore {
  [name: string]: number
}

export class CreateUpdateColumnDto {
  @IsOptional()
  id: number

  @IsString()
  name: string;

  @IsNumberString()
  scale: number;

  @IsBoolean()
  isFinal: boolean;
}