import {
  Body,
  Controller,
  Get,
  Post,
  NotAcceptableException,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-orginization.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('organization')
export class OrganizationController {
  constructor(private orgService: OrganizationService) {}
  @Get()
  async findAll() {
    return await this.orgService.findAll();
  }

  @Post()
  async add(@Body() createOrgDto: CreateOrganizationDto) {
    const org = await this.orgService.add(createOrgDto);
    if (!org) throw new NotAcceptableException('Add organization fail');
  }
}
