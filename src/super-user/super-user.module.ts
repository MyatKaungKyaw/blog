import { Module } from '@nestjs/common';
import { SuperUserController } from './super-user.controller';
import { SuperUserService } from './super-user.service';
import { OrganizationModule } from 'src/organization/orginization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [SuperUserController],
  providers: [SuperUserService],
  imports: [TypeOrmModule.forFeature([User]), UserModule, OrganizationModule],
})
export class SuperUserModule {}
