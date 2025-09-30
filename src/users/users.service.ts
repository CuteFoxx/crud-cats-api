import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Ownable } from 'src/interfaces/Ownable';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService implements Ownable {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getOwnerId(id: string): Promise<string> {
    /**
     *  Just to satisfy the Ownable interface
     */
    return Promise.resolve(id);
  }

  async find(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(username: string): Promise<User | null> {
    if (!username) {
      throw new NotFoundException('Username must be provided');
    }
    return await this.userRepository.findOneBy({ username });
  }

  async findOneById(id: string): Promise<User | null> {
    if (!id) {
      throw new NotFoundException('User ID must be provided');
    }
    return await this.userRepository.findOneBy({ id: parseInt(id) });
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

  async update(id: string, user: UpdateUserDto): Promise<User> {
    if (!id) {
      throw new NotFoundException('User ID must be provided for update');
    }

    const existingUser = await this.userRepository.findOneBy({
      id: parseInt(id),
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = Object.assign(existingUser, user);
    return this.userRepository.save(updatedUser);
  }
}
