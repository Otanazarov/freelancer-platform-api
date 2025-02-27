import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpError } from 'src/common/exception/http.error';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/register-user.dto';
import { sign } from 'jsonwebtoken';
import { env } from 'src/common/config/config';
import { Roles } from 'src/common/consts/roles';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(dto: CreateUserDto): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (userExists) {
      HttpError('user with email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async login(dto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw HttpError('User not found');
    }
    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw HttpError('Password is incorrect');
    }
    const tokens = this.generateToken(user.id, user.role);
    await this.userRepository.update(
      { id: user.id },
      {
        refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        accessToken: await bcrypt.hash(tokens.accessToken, 10),
      },
    );
    return tokens;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw HttpError('User not found');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpError('User not found');
    }

    if (dto.password) {
      if (!dto.oldPassword) {
        throw new HttpError('Old password is required');
      }

      const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
      if (!isMatch) {
        throw new HttpError('Old password is incorrect');
      }

      dto.password = await bcrypt.hash(dto.password, 10);
    }

    delete dto.oldPassword;

    await this.userRepository.update(id, dto);
    return this.findOne(id);
  }
  private generateToken(id: number, role: Roles) {
    const tokens = {
      accessToken: sign(
        { id, role: role.toUpperCase() },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' },
      ),
      refreshToken: sign(
        { id, role: role.toUpperCase() },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: '31d' },
      ),
    };
    return tokens;
  }
}
