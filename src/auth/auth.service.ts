import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LogInDto } from './dto/log-in.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginDto: LogInDto) {
    try {
      const user = await this.userService.findOne(loginDto.name);
      const passwordCorrect =
        user === null
          ? false
          : await bcrypt.compare(loginDto.password, user.passwordHash);

      if (!passwordCorrect) {
        throw new NotFoundException('name or password incorrect.');
      }

      const tokens = await this.userService.getTokens(
        user.id,
        user.name,
        user.role,
      );

      const updateRefreshToken = await this.userService.updateRefreshToken(
        user.id,
        tokens.refreshToken,
      );

      if (!updateRefreshToken)
        throw new ConflictException('update refresh token fail');

      return tokens;
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in auth service's login function`);
      console.error(err);
    }
  }

  async refreshToken(id: string, refreshToken: string) {
    return await this.userService.refreshTokens(id, refreshToken);
  }

  async logOut(id: string) {
    await this.userService.logOut(id);
  }
}
