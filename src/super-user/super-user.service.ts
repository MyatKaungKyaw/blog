import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateOrganizationDto } from 'src/organization/dto/create-orginization.dto';
import { OrganizationService } from 'src/organization/organization.service';
import { Role } from 'src/role/enums/role.enum';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SuperUserService {
  constructor(
    private userService: UserService,
    private orgService: OrganizationService,
  ) {}

  async createSuperUser() {
    try {
      const isSuperExist = await this.userService.findOne(
        undefined,
        Role.SUPER_USER,
      );

      if (isSuperExist)
        throw new NotAcceptableException('super user already exists');

      const orgDto = new CreateOrganizationDto();
      orgDto.name = 'admin';
      const org = await this.orgService.add(orgDto);

      const superUserDto = new CreateUserDto();
      superUserDto.name = 'super_user';
      superUserDto.password = 'secret';
      superUserDto.role = Role.SUPER_USER;
      superUserDto.organization = org.name;

      const superUser = await this.userService.add(superUserDto);

      if (!superUser)
        throw new NotAcceptableException('fail to save super_user');

      return {
        name: superUserDto.name,
        password: superUserDto.password,
      };
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
