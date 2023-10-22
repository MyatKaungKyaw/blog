import { Role } from 'src/role/enums/role.enum';
import { User } from 'src/user/entities/user.entity';

export class LogInResponseDto {
  constructor(user: User, authToken: string) {
    this.name = user.name;
    this.role = user.role;
    this.authToken = authToken;
  }

  name: string;
  role: Role;
  authToken: string;
}
