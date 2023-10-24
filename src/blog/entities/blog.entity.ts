import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'blog' })
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  blog: string;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Organization, { nullable: false })
  organization: Organization;
}
