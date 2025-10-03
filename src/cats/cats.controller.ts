import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';
import { Request as RequestType } from 'express';
import { User } from 'src/users/user.entity';
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';
import { CheckOwnership } from 'src/auth/decorators/ownership';
import { UpdateCatDto } from './dto/update-cat.dto';
import { File } from 'src/files/file.entity';
import { Serialize } from 'src/decorators/seralize.decorator';
import { CatDto } from './dto/cat.dto';

@Serialize(CatDto)
@Controller('cats')
export class CatsController {
  constructor(
    private catsService: CatsService,
    private filesService: FilesService,
  ) {}

  @Get()
  async getCats() {
    return await this.catsService.find();
  }

  @Get(':id')
  async getCat(@Param('id') id: string) {
    const cat = await this.catsService.findOne(id);

    if (!cat) {
      throw new NotFoundException('cat not found');
    }
    return cat;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @Body() data: CreateCatDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: RequestType,
  ) {
    // prob in future i should add some no image file instead of this.
    if (!file) {
      throw new NotFoundException('file must be provided');
    }
    const user = req.user as Partial<User>;
    const fileEntity = await this.filesService.create(file);

    return await this.catsService.create(
      { ...data, authorId: user.id ?? -1 },
      fileEntity,
    );
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @CheckOwnership(CatsService, 'id')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.catsService.delete(id);
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @CheckOwnership(CatsService, 'id')
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCatDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let fileEntity: File | null = null;

    if (file != null) {
      fileEntity = await this.filesService.create(file);
    }

    return await this.catsService.update(id, data, fileEntity);
  }
}
