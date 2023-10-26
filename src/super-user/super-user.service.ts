import {
  Injectable,
  NotAcceptableException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrganizationDto } from 'src/organization/dto/create-orginization.dto';
import { OrganizationService } from 'src/organization/organization.service';
import { Role } from 'src/role/enums/role.enum';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class SuperUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private orgService: OrganizationService,
  ) {}

  async createSuperUser() {
    try {
      const isSuperExist = await this.userRepository.findOneBy({
        role: Role.SUPER_USER,
      });

      if (isSuperExist)
        throw new NotAcceptableException('super user already exists');

      const orgDto = new CreateOrganizationDto();
      orgDto.name = 'admin';
      const org = await this.orgService.add(orgDto);

      const superUserDto = new CreateUserDto();
      superUserDto.name = 'super_user';
      const passwordHash = await this.userService.hashData('secret');
      superUserDto.role = Role.SUPER_USER;
      superUserDto.organization = org.name;

      const user = {
        name: 'super_user',
        passwordHash,
        role: Role.SUPER_USER,
        organization: org,
      };

      const superUser = await this.userRepository.save(user);

      if (!superUser)
        throw new NotAcceptableException('fail to save super_user');

      const tokens = await this.userService.getTokens(
        superUser.id,
        superUser.name,
        superUser.role,
      );

      const updateRefreshTokenResult =
        await this.userService.updateRefreshToken(
          superUser.id,
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

      console.error(`Error in super-user service's createSuperUser function`);
      console.error(err);
    }
  }
}
