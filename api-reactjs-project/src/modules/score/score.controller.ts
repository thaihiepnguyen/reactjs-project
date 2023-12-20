import { Body, Controller, Post } from "@nestjs/common";
import { ScoreService } from "./score.service";
import { CreateColumnDto } from "./score.dto";
import { TBaseDto } from "src/app.dto";

@Controller('/score')
export class ScoreController {
  constructor(
    private readonly scoreService: ScoreService,
  ) {}

  @Post('/create-column')
  async createColumn(
    @Body() createColumnDto: CreateColumnDto
  ): Promise<TBaseDto<any>> {
    const { courseId, name, scale } = createColumnDto

    return await this.scoreService.createColumn(courseId, name, scale)
  }
}