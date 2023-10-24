import {
  Controller,
  Post,
  Body,
  Req,
  Put,
  NotAcceptableException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateBlogDto } from './dto/create-blog.dto';
import { EditBlogDto } from './dto/edit-blog.dto';
import { BlogService } from './blog.service';
import { User, UserType } from 'src/user/user.decorator';

@ApiBearerAuth()
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Post()
  async add(@Body() blogDto: CreateBlogDto, @User() user: UserType) {
    return await this.blogService.add(blogDto, user.name);
  }

  @Put()
  async edit(@Body() blogDto: EditBlogDto) {}
}
