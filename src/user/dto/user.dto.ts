import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from 'src/role/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  @IsNotEmpty()
  organization: string;
}
