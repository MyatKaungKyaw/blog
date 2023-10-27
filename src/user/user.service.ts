import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { OrganizationService } from 'src/organization/organization.service';
import { UserResponstDto } from './dto/user-responst.dto';
import { Role } from 'src/role/enums/role.enum';
import { EditUserDto } from './dto/edit-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private orgService: OrganizationService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async add(user: CreateUserDto) {
    try {
      const hash = await this.hashData(user.password);
      const organization = await this.orgService.findOne(user.organization);

      if (organization.name === 'admin')
        throw new NotAcceptableException(
          'Cannot create user with admin organization',
        );

      const userWithHash = {
        ...user,
        passwordHash: hash,
        organization,
      };

      const createdUser = await this.userRepository.save(userWithHash);

      const tokens = await this.getTokens(
        createdUser.id,
        createdUser.name,
        createdUser.role,
      );

      const updateRefreshTokenResult = await this.updateRefreshToken(
        createdUser.id,
        tokens.refreshToken,
      );

      if (!updateRefreshTokenResult)
        throw new ConflictException('update refresh token fail');

      return tokens;
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in user service's add function`);
      console.error(err);
    }
  }

  async findOne(name?: string, role?: Role) {
    try {
      return await this.userRepository.findOne({
        where: {
          ...(name && { name }),
          ...(role && { role }),
        },
        relations: {
          organization: true,
        },
      });
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in user service's findOne function`);
      console.error(err);
    }
  }

  async findAll() {
    try {
      const adminOrg = await this.orgService.findOne('admin');

      const users = await this.userRepository.find({
        where: {
          organization: Not(adminOrg.id),
        },
        relations: {
          organization: true,
        },
      });
      return users.map((user) => new UserResponstDto(user));
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in user service's findAll function`);
      console.error(err);
    }
  }

  async update(id: string, userDto: EditUserDto) {
    try {
      if (userDto.password) {
      }
      const user = {
        ...(userDto.name && { name: userDto.name }),
        ...(userDto.role && { role: userDto.role }),
        ...(userDto.organization && { organization: userDto.organization }),
        ...(userDto.password && {
          password: await this.hashData(userDto.password),
        }),
      };
      const updateResult = await this.userRepository.update(id, user);

      return updateResult.affected === 1 ? true : false;
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in user service's update function`);
      console.error(err);
    }
  }

  async refreshTokens(id: string, refreshToken: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user || !user.refreshToken)
        throw new ForbiddenException('Access Denied');

      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

      const tokens = await this.getTokens(user.id, user.name, user.role);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in user service's refreshTokens function`);
      console.error(err);
    }
  }

  async logOut(id: string) {
    try {
      await this.userRepository.update(id, { refreshToken: null });
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in user service's logOut function`);
      console.error(err);
    }
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    return await this.userRepository.update(id, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(id: string, name: string, role: Role) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          name,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          name,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, 12);
  }
}
