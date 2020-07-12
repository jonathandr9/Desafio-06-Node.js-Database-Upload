import {
   Column,
   CreateDateColumn,
   UpdateDateColumn,
   PrimaryGeneratedColumn,
  } from 'typeorm'

class Category {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @CreateDateDolumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Category;
