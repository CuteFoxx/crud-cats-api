import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Ownable } from 'src/interfaces/Ownable';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserFullDto } from './dto/update-user-full.dto';
import { UserDto } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from 'src/dto/pagination.dto';

@Injectable()
export class UsersService implements Ownable {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getOwnerId(id: string): Promise<number> {
    /**
     *  Just to satisfy the Ownable interface
     */
    return Promise.resolve(parseInt(id));
  }

  async find(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    return {
      data: plainToInstance(UserDto, users, { excludeExtraneousValues: true }),
      total: total,
      limit,
      offset,
      nextPage: total > offset + limit ? offset + limit : null,
    };
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

  async update(
    id: string,
    user: UpdateUserDto | UpdateUserFullDto,
  ): Promise<User> {
    if (!id) {
      throw new NotFoundException('User ID must be provided for update');
    }

    const existingUser = await this.userRepository.findOneBy({
      id: parseInt(id),
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const filtered = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(user).filter(([_, v]) => v !== undefined),
    ) as Partial<User>;

    const updatedUser = Object.assign(existingUser, filtered);
    return this.userRepository.save(updatedUser);
  }
}
