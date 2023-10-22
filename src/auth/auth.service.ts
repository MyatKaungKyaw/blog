import { Injectable, NotFoundException } from '@nestjs/common';
import { LogInDto } from './dto/log-in.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LogInResponseDto } from './dto/log-in-response.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LogInDto) {
    const user = await this.userService.findOne(loginDto.name);
    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!passwordCorrect) {
      throw new NotFoundException('name or password incorrect.');
    }

    const payload = { name: user.name, id: user.id };

    return new LogInResponseDto(user, await this.jwtService.signAsync(payload));
  }
}
