import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../common/auth/strategy/jwt.strategy';
import { Client } from './entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Client]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [UserService, UserResolver, JwtStrategy],
  exports: [UserService, JwtStrategy],
})
export class UserModule {}
