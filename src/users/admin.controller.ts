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
import { Roles } from 'src/auth/decorators/roles';
import { Role } from 'src/auth/enums/Role';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Serialize } from 'src/decorators/seralize.decorator';
import { UserDto } from './dto/user.dto';
import { UpdateUserFullDto } from './dto/update-user-full.dto';

// Controller for administrative actions on users
@Serialize(UserDto)
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/users')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.find();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserFullDto) {
    return await this.usersService.update(id, data);
  }
}
