import {
  Controller,
  Post,
  Body,
  NotAcceptableException,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async add(@Body() userDto: CreateUserDto) {
    const user = await this.userService.add(userDto);
    if (!user) throw new NotAcceptableException('Add user fail');
  }

  @Get()
  async getAll() {
    return await this.userService.findAll();
  }
}
