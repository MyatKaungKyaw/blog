import { Module } from '@nestjs/common';
import { SuperUserController } from './super-user.controller';
import { SuperUserService } from './super-user.service';
import { UserModule } from 'src/user/user.module';
import { OrganizationModule } from 'src/organization/orginization.module';

@Module({
  controllers: [SuperUserController],
  providers: [SuperUserService],
  imports: [UserModule, OrganizationModule],
})
export class SuperUserModule {}
