import { Role } from 'src/role/enums/role.enum';
import { User } from '../entities/user.entity';

type RoleString = keyof typeof Role;

export class UserResponstDto {
  constructor(user: User) {
    this.name = user.name;
    this.role = Object.keys(Role)[
      Object.values(Role).indexOf(user.role)
    ] as RoleString;
    this.organization = user.organization.name;
  }

  name: string;
  role: RoleString;
  organization: string;
}
