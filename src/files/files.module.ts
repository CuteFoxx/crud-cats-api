import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([File]), ConfigModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
