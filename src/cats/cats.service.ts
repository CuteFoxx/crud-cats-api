import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './cat.entity';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { File } from 'src/files/file.entity';
import { Ownable } from 'src/interfaces/Ownable';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class CatsService implements Ownable {
  constructor(
    @InjectRepository(Cat) private readonly catRepositore: Repository<Cat>,
  ) {}
  async getOwnerId(id: string): Promise<number | null> {
    const cat = await this.findOne(id);

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    return cat.author?.id;
  }

  async find() {
    return await this.catRepositore.find({
      relations: {
        author: true,
      },
    });
  }

  async findOne(id: string): Promise<Cat | null> {
    if (!id) {
      throw new NotFoundException('Id isnt provided');
    }

    return await this.catRepositore.findOne({
      relations: {
        author: true,
      },
      where: { id: parseInt(id) },
    });
  }

  async create(data: CreateCatDto, file: File): Promise<Cat> {
    if (!file) {
      throw new NotFoundException('file must be provided');
    }

    const { authorId, ...catData } = { ...data };
    const cat = this.catRepositore.create({
      ...catData,
      author: {
        id: authorId,
      },
      imageUrl: file.path,
    });

    return await this.catRepositore.save(cat);
  }

  async delete(id: string) {
    if (!id) {
      throw new NotFoundException('Id isnt provided');
    }

    const cat = await this.catRepositore.findOneBy({ id: parseInt(id) });

    if (!cat) {
      throw new NotFoundException('Cat with this id not found');
    }

    return this.catRepositore.remove(cat);
  }

  async update(id: string, data: UpdateCatDto, file: File | null) {
    const cat = await this.findOne(id);

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    const filtered = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(data).filter(([_, v]) => v !== undefined),
    ) as Partial<Cat>;

    Object.assign(cat, filtered);

    if (file != null) {
      cat.imageUrl = file.path;
    }

    return await this.catRepositore.save(cat);
  }
}
