import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { cpf: createUserDto.cpf },
    });

    if (user) {
      throw new NotFoundException('User already exists');
    }

    const saltOrRounds = 10;

    const passwordHashed = await hash(createUserDto.password, saltOrRounds);

    return this.userRepository.save({
      ...createUserDto,
      password: passwordHashed,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    const allUsersByEmail = await this.userRepository.find({
      where: { email: updateUserDto.email },
    });

    if (updateUserDto.email && allUsersByEmail.length > 0) {
      throw new UnauthorizedException('Email already exists');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const allUsersByCpf = await this.userRepository.find({
      where: { cpf: updateUserDto.cpf },
    });

    if (updateUserDto.cpf && allUsersByCpf.length > 0) {
      throw new UnauthorizedException('CPF already exists');
    }

    return this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.remove(user);
  }
}
