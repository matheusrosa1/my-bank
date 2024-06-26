import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  private users: User[] = [];
  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;

    const passwordHashed = await hash(createUserDto.password, saltOrRounds);

    console.log('passwordHashed', passwordHashed);

    const user: User = {
      ...createUserDto,
      id: this.users.length + 1,
      password: passwordHashed,
    };

    this.users.push(user);

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
