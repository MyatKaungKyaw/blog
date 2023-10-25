import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { OrganizationService } from 'src/organization/organization.service';
import { UserResponstDto } from './dto/user-responst.dto';
import { Role } from 'src/role/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private orgService: OrganizationService,
  ) {}

  async add(user: CreateUserDto) {
    try {
      const hash = await bcrypt.hash(user.password, 12);
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

      return await this.userRepository.save(userWithHash);
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
}
