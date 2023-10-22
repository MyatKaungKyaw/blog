import { Injectable } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';

@Injectable()
export class LogInDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
