import { Field, ObjectType } from '@nestjs/graphql';
import { Roles } from 'src/common/consts/roles';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class User extends AbstractEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column({ comment: 'ADMIN|FREELANCER|CLIENT' })
  role: Roles;

  @Field()
  @Column({ nullable: true })
  accessToken: string;

  @Field()
  @Column({ nullable: true })
  refreshToken: string;
}
