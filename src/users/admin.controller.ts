import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
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
import { PaginationDto } from 'src/dto/pagination.dto';

// Controller for administrative actions on users
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/users')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.find(paginationDto);
  }

  @Serialize(UserDto)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Serialize(UserDto)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Serialize(UserDto)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserFullDto) {
    return await this.usersService.update(id, data);
  }
}
