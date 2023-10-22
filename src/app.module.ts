import { Module } from '@nestjs/common';
import { OrganizationModule } from './organization/orginization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService()),
    OrganizationModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
