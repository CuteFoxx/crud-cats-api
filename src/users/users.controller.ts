import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';
import { CheckOwnership } from 'src/auth/decorators/ownership';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles';
import { Role } from 'src/auth/enums/Role';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.usersService.find();
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @CheckOwnership(UsersService, 'id')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @CheckOwnership(UsersService, 'id')
  async updateProfile(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.update(id, body);
  }
}
