import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsString()
  breed: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  authorId: number;
}
