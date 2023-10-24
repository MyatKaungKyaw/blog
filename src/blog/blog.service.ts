import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UserService } from 'src/user/user.service';
import { BlogResponseDto } from './dto/blog-response.dto';
import { EditBlogDto } from './dto/edit-blog.dto';
import { UserType } from 'src/user/user.decorator';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    private userService: UserService,
  ) {}

  async add(blogDto: CreateBlogDto, userName: string) {
    try {
      const user = await this.userService.findOne(userName);
      const organization = user.organization;

      const blog = await this.blogRepository.save({
        ...blogDto,
        user,
        organization,
      });

      return new BlogResponseDto(blog);
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in blog service's add function`);
      console.error(err);
    }
  }

  async findAll(userName: string) {
    try {
      const organization = (await this.userService.findOne(userName))
        .organization;

      const blogs = await this.blogRepository.find({
        where: { organization },
        relations: { organization: true, user: true },
      });

      return blogs.map((blog) => new BlogResponseDto(blog));
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in blog service's findAll function`);
      console.error(err);
    }
  }

  async update(blogDto: EditBlogDto, reqUser: UserType) {
    try {
      return await this.blogRepository.update(blogDto.id, { ...blogDto });
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in blog service's update function`);
      console.error(err);
    }
  }

  async delete(id: string, reqUser: UserType) {
    try {
      const blog = await this.blogRepository.findOne({
        where: { id },
        relations: { user: true, organization: true },
      });

      const user = await this.userService.findOne(reqUser.name);

      if (user.id !== blog.user.id)
        throw new UnauthorizedException(`user can only delete it's own blog`);

      await this.blogRepository.delete(blog.id);
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in blog service's delete function`);
      console.error(err);
    }
  }
}
