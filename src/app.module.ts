import { Module } from '@nestjs/common';
import { OrganizationModule } from './organization/orginization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SuperUserModule } from './super-user/super-user.module';
import { BlogModule } from './blog/blog.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService()),
    ConfigModule.forRoot({ isGlobal: true }),
    OrganizationModule,
    UserModule,
    AuthModule,
    SuperUserModule,
    BlogModule,
    RoleModule,
  ],
})
export class AppModule {}
