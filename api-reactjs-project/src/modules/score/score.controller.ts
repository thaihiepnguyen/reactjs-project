import {Body, Controller, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import { ScoreService } from "./score.service";
import { AddScoreByStudentCodeDto, AddScoreDto, CreateColumnDto, CreateUpdateColumnDto, DeleteScoreByStudentCodeDto } from "./score.dto";
import { TBaseDto } from "src/app.dto";
import { MetaDataAuth } from "../auth/auth.decorator";
import { ColumnsResponse } from "./score.typing";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { RolesGuard } from "../auth/roles/roles.guard";
import { Roles } from "../auth/roles/roles.decorator";
import { Role } from "../auth/roles/role.enum";

@Controller('/score')
export class ScoreController {
  constructor(
    private readonly scoreService: ScoreService,
  ) {}

  @Post('/create-columns')
  async createColumns(
    @Body() createColumnDto: CreateColumnDto,
  ): Promise<TBaseDto<any>> {
    const {courseId, columns} = createColumnDto;
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
    const {gradeId, studentId, score} = addScoreDto;

    return await this.scoreService.addScoreByStudentId(gradeId, studentId, userId, score);
  }

  @Post('/add/by-student-code/:id')
  async addScoreByStudentCode(
    @Param('id', ParseIntPipe) id: number,
    @Body() addScoreByStudentCode: AddScoreByStudentCodeDto,
    @MetaDataAuth('userId') userId: number
  ): Promise<TBaseDto<null>> {
    const {studentCode, scores, oldStudentId} = addScoreByStudentCode;

    return await this.scoreService.addScoreByStudentCode(studentCode, userId, scores, id, oldStudentId);
  }

  @Get('/columns/:id')
  async getColumns(
    @Param('id', ParseIntPipe) id: number,
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

  @Post('/update-score/:id')
  async updateScore(
    @Param('id', ParseIntPipe) id: number,
    @Body() addScoreByStudentCodes: AddScoreByStudentCodeDto[],
    @MetaDataAuth('userId') userId: number
  ): Promise<TBaseDto<null>> {
    return await this.scoreService.updateScoresByStudentCode(userId, addScoreByStudentCodes, id);
  }

  @Post('/delete-score')
  async deleteScore(
    @Body() deleteScoreByStudentCodes: DeleteScoreByStudentCodeDto,
    @MetaDataAuth('userId') userId: number
  ): Promise<TBaseDto<null>> {
    return await this.scoreService.deleteScoreByStudentCode(userId, deleteScoreByStudentCodes);
  }

  @Post('/create-update-columns/:id') //course id
  async createUpdateColumn(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateUpdateColumnDto[],
    @MetaDataAuth('userId') userId: number
  ): Promise<TBaseDto<ColumnsResponse>> {
    return await this.scoreService.createUpdateColumns(id, userId, data);
  }


  @Put('/finalize/:id') // course id
  async finalizeColumns(
    @Param('id', ParseIntPipe) id: number,
    @MetaDataAuth('userId') userId: number,
    @Body('gradeIds') gradeIds: number[],
  ): Promise<TBaseDto<null>> {
    return await this.scoreService.finalizeColumns(id, userId, gradeIds);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Student)
  @Get('my-score/:courseId') //For students
  async getScore(
    @MetaDataAuth('userId') userId: number,
    @Param('courseId', ParseIntPipe) courseId: number

  ): Promise<TBaseDto<any>> {
    return this.scoreService.studentGetCourse(userId, courseId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Student)
  @Post('request-review/:scoreId') //For students
  async requestReview(
    @MetaDataAuth('userId') userId: number,
    @Param('scoreId', ParseIntPipe) scoreId: number,
    @Body('message') message: string,

  ): Promise<TBaseDto<any>> {

    return this.scoreService.requestReview(userId, message, scoreId);
  }
}