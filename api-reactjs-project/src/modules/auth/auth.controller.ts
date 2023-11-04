import {Body, Controller, Post, UsePipes, ValidationPipe} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {CreateUserDto} from "./auth.dto";
import {TBaseDto} from "../../typeorm/app.dto";


@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    return await this.authService.create(createUserDto);
  }
}