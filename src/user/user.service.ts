import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { OrganizationService } from 'src/organization/organization.service';

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

  async findOne(name: string) {
    try {
      return await this.userRepository.findOneBy({ name });
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
}
