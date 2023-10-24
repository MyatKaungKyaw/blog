import { IsNotEmpty, IsString } from 'class-validator';

export class EditBlogDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  title?: string;

  @IsString()
  blog?: string;
}
