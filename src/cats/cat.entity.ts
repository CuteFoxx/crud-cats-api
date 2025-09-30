import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 125 })
  name: string;

  @Column('varchar', { length: 125 })
  breed: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.cat)
  author: User;
}
