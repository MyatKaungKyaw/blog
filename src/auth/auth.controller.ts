import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { Public } from 'src/public/public.decorator';
import { User, UserType } from 'src/user/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() logInDto: LogInDto) {
    return await this.authService.login(logInDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshToken(@User() user: UserType) {
    console.log('user');
    return user;
  }

  @Post('logout')
  async logout(@User() user: UserType) {
    await this.authService.logOut(user.sub);
  }
}
