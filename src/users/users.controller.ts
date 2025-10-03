import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';
import { CheckOwnership } from 'src/auth/decorators/ownership';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from 'src/decorators/seralize.decorator';
import { UserDto } from './dto/user.dto';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @CheckOwnership(UsersService, 'id')
  async updateProfile(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.update(id, body);
  }
}
