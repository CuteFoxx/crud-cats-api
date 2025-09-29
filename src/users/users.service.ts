import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async find(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(username: string): Promise<User | null> {
    if (!username) {
      throw new NotFoundException('Username must be provided');
    }
    return await this.userRepository.findOneBy({ username });
  }

  create(data: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async delete(id: string) {
    if (!id) {
      throw new NotFoundException('User ID must be provided');
    }
    const user = await this.userRepository.findOneBy({ id: parseInt(id) });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.userRepository.remove(user);
  }

  async update(user: Partial<User>): Promise<User> {
    if (!user.id) {
      throw new NotFoundException('User ID must be provided for update');
    }

    const existingUser = await this.userRepository.findOneBy({ id: user.id });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${user.id} not found`);
    }

    const updatedUser = Object.assign(existingUser, user);
    return this.userRepository.save(updatedUser);
  }
}
