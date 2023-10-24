import {
  Controller,
  Post,
  Body,
  Put,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
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
  async update(@Body() blogDto: EditBlogDto, @User() user: UserType) {
    return await this.blogService.update(blogDto, user);
  }

  @Get()
  async getAll(@User() user: UserType) {
    return await this.blogService.findAll(user.name);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: string, @User() user: UserType) {
    await this.blogService.delete(userId, user);
  }
}
