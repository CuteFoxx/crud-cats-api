import {
  Controller,
  Post,
  UseGuards,
  Request,
  Bind,
  Body,
  Get,
} from '@nestjs/common';
import { Request as ReqType } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Bind(Request())
  login(@Request() req: ReqType) {
    if (!req.user) {
      throw new Error('User not found in request');
    }
    return this.authService.login(req.user);
  }

  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ReqType) {
    return req.user;
  }
}
