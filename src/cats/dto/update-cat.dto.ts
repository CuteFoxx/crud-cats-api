import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCatDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  breed: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  authorId: number;
}
