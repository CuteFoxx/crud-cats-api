import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';
import { CheckOwnership } from 'src/auth/decorators/ownership';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @CheckOwnership(UsersService, 'id')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
