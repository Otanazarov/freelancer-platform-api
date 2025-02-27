import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Client extends User {
  @Field()
  @Column()
  companyName: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  allVacancies: number;
}
