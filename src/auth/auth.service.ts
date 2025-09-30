import { Injectable, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Role } from './enums/Role';

export interface JwtPayload {
  username: string;
  sub: string;
  role: Role;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @UseInterceptors()
  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: Partial<User>) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    } as Partial<JwtPayload>;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
