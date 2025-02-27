import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Roles } from 'src/common/consts/roles';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsEnum([Roles.FREELANCER, Roles.CLIENT], {
    message: 'Role must be FREELANCER or CLIENT',
  })
  role: Roles;
}
