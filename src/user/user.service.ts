import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
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
      return await this.userRepository.findOneBy({
        ...(name && { name }),
        ...(role && { role }),
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
      const users = await this.userRepository.find({
        relations: {
          organization: true,
        },
      });
      console.log(users);
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
