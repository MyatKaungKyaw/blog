import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-orginization.dto';

@Controller('organization')
export class OrganizationController {
  constructor(private orgService: OrganizationService) {}
  @Get()
  async findAll() {
    await this.orgService.findAll();
  }

  @Post()
  async add(@Body() createOrgDto: CreateOrganizationDto) {
    await this.orgService.add(createOrgDto);
  }
}
