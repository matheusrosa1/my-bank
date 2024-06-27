import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  async create(createAccountDto: CreateAccountDto) {
    if (
      createAccountDto.type !== 'checking' &&
      createAccountDto.type !== 'savings'
    ) {
      throw new UnauthorizedException('Invalid account type');
    }

    if (createAccountDto.balance < 0) {
      throw new UnauthorizedException('Invalid balance');
    }

    return this.accountRepository.save(createAccountDto);
  }

  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    return this.accountRepository.find();
  }

  @UseGuards(AuthGuard('jwt'))
  async findOne(id: number) {
    const account = await this.accountRepository.findOne({ where: { id } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  @UseGuards(AuthGuard('jwt'))
  async update(id: number, updateAccountDto: UpdateAccountDto) {
    const account = await this.findOne(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (updateAccountDto.name !== undefined) {
      account.name = updateAccountDto.name;
    }

    if (updateAccountDto.balance) {
      throw new UnauthorizedException('Balance cannot be updated');
    }

    if (updateAccountDto.type !== undefined) {
      account.type = updateAccountDto.type;
    }

    return this.accountRepository.save(account);
  }

  @UseGuards(AuthGuard('jwt'))
  async remove(id: number) {
    const account = await this.findOne(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.accountRepository.remove(account);
  }
}
