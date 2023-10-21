import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'organization' })
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  name: string;
}
