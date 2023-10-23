import { Organization } from 'src/organization/entities/organization.entity';
import { Role } from 'src/role/enums/role.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  passwordHash: string;

  @Column({ type: 'enum', enum: Role, nullable: false })
  role: Role;

  @ManyToOne(() => Organization, { nullable: true })
  organization?: Organization;
}
