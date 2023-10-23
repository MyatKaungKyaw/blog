import { Controller, Post, NotAcceptableException } from '@nestjs/common';
import { SuperUserService } from './super-user.service';
import { Public } from 'src/public/public.decorator';

@Controller('super-user')
export class SuperUserController {
  constructor(private superUserService: SuperUserService) {}

  @Public()
  @Post()
  async addSuperUser() {
    const superUser = await this.superUserService.createSuperUser();
    if (!superUser)
      throw new NotAcceptableException('super user already exists.');

    return superUser;
  }
}
