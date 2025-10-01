import {
  Body,
  Controller,
  NotFoundException,
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
import { JwtPayload } from 'src/auth/auth.service';
import { User } from 'src/users/user.entity';

@Controller('cats')
export class CatsController {
  constructor(
    private catsService: CatsService,
    private filesService: FilesService,
  ) {}

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
}
