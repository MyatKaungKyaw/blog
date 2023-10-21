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
    return await this.orgRepository.find();
  }

  async add(org: CreateOrganizationDto) {
    await this.orgRepository.save(org);
  }
}
