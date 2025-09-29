import { Exclude } from 'class-transformer';
import { Role } from 'src/auth/enums/Role';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    enum: Role,
    type: 'enum',
    default: Role.User,
  })
  role: Role;

  @Column({ default: true })
  isActive: boolean;
}
