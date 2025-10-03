import { Expose, Type } from 'class-transformer';
import { UserProfileDto } from 'src/users/dto/user-profile.dto';
import { User } from 'src/users/user.entity';

export class CatDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  breed: string;

  @Expose()
  description: string;

  @Expose()
  imageUrl: string;

  @Expose()
  @Type(() => UserProfileDto)
  author: User;
}
