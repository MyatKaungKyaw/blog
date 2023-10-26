import { Role } from 'src/role/enums/role.enum';

export class EditUserDto {
  name?: string;
  password?: string;
  role?: Role;
  organization?: {
    id: string;
    name: string;
  };
}
