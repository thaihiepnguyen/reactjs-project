import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ScoreService } from "./score.service";
import { AddScoreDto, CreateColumnDto } from "./score.dto";
import { TBaseDto } from "src/app.dto";
import { MetaDataAuth } from "../auth/auth.decorator";
import { ColumnsResponse } from "./score.typing";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as xlsx from 'xlsx';

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
        message: 'Total score percentage must be 100 percents',
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

  @Get('/columns/:id')
  async getColumns(
    @Param('id') id: number,
    @MetaDataAuth('userId') userId: number
  ): Promise<TBaseDto<ColumnsResponse>> {
    return await this.scoreService.getColumns(id, userId);
  }

  @Post('/upload/file')
  @UseInterceptors(FileInterceptor('score', {
    storage: diskStorage({
      destination: './uploads/score'
      , filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
      }
    })
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @MetaDataAuth('userId') userId: number): Promise<TBaseDto<null>> {
    if (file) {
      return this.scoreService.saveScores(file, userId);
    } else {
      return {
        message: 'upload file failed!',
        statusCode: 400,
        data: null
      }
    }
  }
 
  @Post('/update-score/:courseId')
  async updateScore(
    @Param('courseId') courseId: number,
    @Body() scoreData: any[],
  ): Promise<TBaseDto<null>> {
    return await this.scoreService.updateScore(courseId, scoreData);
  }
}