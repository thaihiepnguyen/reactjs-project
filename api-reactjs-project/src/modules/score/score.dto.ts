import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateColumnDto {
  @IsNumber()
  courseId: number;

  @IsNotEmpty()
  name: string;

  @IsNumber()
  scale: number;
}