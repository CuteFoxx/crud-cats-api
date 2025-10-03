import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/auth/enums/Role';

export class UpdateUserFullDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'role must be user or admin' })
  @Transform(({ value }: { value: string }) => value?.toLowerCase())
  role?: Role;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
