import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  Created: Date;
}
