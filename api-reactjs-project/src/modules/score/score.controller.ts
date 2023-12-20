import { Body, Controller, Post } from "@nestjs/common";
import { ScoreService } from "./score.service";
import { AddScoreDto, CreateColumnDto } from "./score.dto";
import { TBaseDto } from "src/app.dto";
import { MetaDataAuth } from "../auth/auth.decorator";

@Controller('/score')
export class ScoreController {
  constructor(
    private readonly scoreService: ScoreService,
  ) {}

  @Post('/create-columns')
  async createColumns(
    @Body() createColumnDto: CreateColumnDto,
  ): Promise<TBaseDto<any>> {
    const { courseId, columns } = createColumnDto;
    const totalScales = columns.reduce((acc, cur) => {
      acc += cur.scale;
      return acc;
    }, 0);

    if (totalScales !== 100) {
      // total of scale must be 100
      return {
        message: 'Total score percentage must be 100 per cent',
        statusCode: 400
      };
    }

    return await this.scoreService.createColumns(courseId, columns);
  }

  @Post('/add')
  async addScore(
    @Body() addScoreDto: AddScoreDto,
    @MetaDataAuth('userId') userId: number 
  ): Promise<TBaseDto<null>> {
    const { gradeId, studentId, score} = addScoreDto;

    return await this.scoreService.addScore(gradeId, studentId, userId, score);
  }
}