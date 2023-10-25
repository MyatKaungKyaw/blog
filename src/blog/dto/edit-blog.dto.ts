import { IsString, IsOptional } from 'class-validator';

export class EditBlogDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  blog?: string;
}
