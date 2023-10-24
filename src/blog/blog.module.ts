import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), UserModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
