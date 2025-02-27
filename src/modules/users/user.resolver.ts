import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/register-user.dto';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/auth/roles-decarator';
import { GqlAuthGuard } from 'src/common/auth/auth-guard';
import { GqlRolesGuard } from 'src/common/auth/roles-guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('data') data: CreateUserDto): Promise<User> {
    return this.userService.register(data);
  }
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles('CLIENT')
  @Query(() => User, { name: 'user', nullable: true })
  async findUser(@Args('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Query(() => [User], { name: 'users' })
  async findUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: number,
    @Args('data') data: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, data);
  }

  @Mutation(()=>User)
  async login(@Args('data') data: LoginUserDto) {
    return this.userService.login(data);
  }
}
