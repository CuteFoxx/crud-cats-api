import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private readonly fileRepo: Repository<File>,
    private readonly configService: ConfigService,
  ) {}

  async create(file: Express.Multer.File): Promise<File> {
    const fileEntity = this.fileRepo.create({
      path: file.path,
      filename: file.filename,
      mimetype: file.mimetype,
      created: new Date(),
    });

    return this.fileRepo.save(fileEntity);
  }

  async delete(fid: string): Promise<File> {
    const file = await this.fileRepo.findOneBy({ id: parseInt(fid) });
    if (!file) {
      throw new NotFoundException('file not found');
    }
    return this.fileRepo.remove(file);
  }
}
