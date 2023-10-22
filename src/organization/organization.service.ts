import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-orginization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
  ) {}

  async findAll() {
    try {
      return await this.orgRepository.find();
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in organization service's findAll function`);
      console.error(err);
    }
  }

  async add(org: CreateOrganizationDto) {
    try {
      return await this.orgRepository.save(org);
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in organization service's add function`);
      console.error(err);
    }
  }

  async findOne(orgName: string) {
    try {
      return await this.orgRepository.findOneBy({ name: orgName });
    } catch (error: unknown) {
      let err: string;

      if (typeof error === 'string') {
        err = error.toUpperCase();
      } else if (error instanceof Error) {
        err = error.message;
      }

      console.error(`Error in organization service's findOne function`);
      console.error(err);
    }
  }
}
