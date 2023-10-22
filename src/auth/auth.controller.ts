import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { Public } from 'src/public/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() logInDto: LogInDto) {
    return await this.authService.login(logInDto);
  }
}
