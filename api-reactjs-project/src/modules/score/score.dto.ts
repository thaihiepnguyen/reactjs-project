import { IsArray, IsNotEmpty, IsNumber, IsNumberString, IsObject } from "class-validator";

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
}

export interface TScore {
  [name: string]: number
}