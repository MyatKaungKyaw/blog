import {
  Controller,
  Post,
  Body,
  Put,
  Get,
  Delete,
  Param,
  ConflictException,
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

  @Put(':blogId')
  async update(
    @Param('blogId') blogId: string,
    @Body() blogDto: EditBlogDto,
    @User() user: UserType,
  ) {
    const isSuccess = await this.blogService.update(blogId, blogDto, user);
    if (!isSuccess) throw new ConflictException('blog edit fail');
  }

  @Get()
  async getAll(@User() user: UserType) {
    return await this.blogService.findAll(user.name);
  }

  @Delete(':blogId')
  async delete(@Param('blogId') blogId: string, @User() user: UserType) {
    const isSuccess = this.blogService.delete(blogId, user);
    if (!isSuccess) throw new ConflictException('blog delete fail');
  }
}
