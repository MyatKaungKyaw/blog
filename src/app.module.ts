import { Module } from '@nestjs/common';
import { OrganizationModule } from './organization/orginization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';

@Module({
  imports: [TypeOrmModule.forRoot(configService()), OrganizationModule],
})
export class AppModule {}
