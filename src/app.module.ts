import { Module } from '@nestjs/common';
import { OrganizationModule } from './organization/orginization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SuperUserModule } from './super-user/super-user.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService()),
    OrganizationModule,
    UserModule,
    AuthModule,
    SuperUserModule,
    BlogModule,
  ],
})
export class AppModule {}
