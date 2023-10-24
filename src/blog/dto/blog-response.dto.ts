import { Blog } from '../entities/blog.entity';

export class BlogResponseDto {
  constructor(blog: Blog) {
    this.id = blog.id;
    this.title = blog.title;
    this.blog = blog.blog;
    this.user = blog.user.name;
    this.organization = blog.organization.name;
  }

  id: string;
  title: string;
  blog: string;
  user: string;
  organization: string;
}
