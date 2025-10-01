import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './cat.entity';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { File } from 'src/files/file.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat) private readonly catRepositore: Repository<Cat>,
  ) {}

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
}
