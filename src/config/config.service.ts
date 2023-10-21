import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

export const configService = (): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    // password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: process.env.MODE == 'DEV' ? true : false,
    autoLoadEntities: true,
  };
};
