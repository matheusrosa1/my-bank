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
import validateCPF from '../utils/validateCPF';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { cpf, password, email } = createUserDto;

    if (!validateCPF(cpf)) {
      throw new UnauthorizedException('Invalid CPF');
    }

    const existingUser = await this.userRepository.findOne({
      where: { cpf: cpf },
    });

    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: email },
    });

    if (existingUser || existingUserByEmail) {
      throw new UnauthorizedException('User already exists');
    }

    const saltOrRounds = 10;

    const passwordHashed = await hash(password, saltOrRounds);

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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const allUsersByEmail = await this.userRepository.find({
      where: { email: updateUserDto.email },
    });

    if (updateUserDto.email && allUsersByEmail.length > 0) {
      throw new UnauthorizedException('Email already exists');
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

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } });
  }
}
