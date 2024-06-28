import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { Repository } from 'typeorm';

const validAccountTypes = ['checking', 'savings']; // checking = conta corrente, savings = poupança
@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    if (!validAccountTypes.includes(createAccountDto.type)) {
      throw new UnauthorizedException('Invalid account type');
    }

    if (createAccountDto.balance < 0) {
      throw new UnauthorizedException('Invalid balance');
    }

    return this.accountRepository.save(createAccountDto);
  }

  async findAll() {
    return this.accountRepository.find();
  }

  async findOne(id: number) {
    const account = await this.accountRepository.findOne({ where: { id } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

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

    if (!validAccountTypes.includes(updateAccountDto.type)) {
      throw new UnauthorizedException('Invalid account type');
    }

    return this.accountRepository.save(account);
  }

  async remove(id: number) {
    const account = await this.findOne(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.accountRepository.remove(account);
  }
}
