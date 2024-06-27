import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Repository } from 'typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { AccountEntity } from 'src/account/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    const { accountId, amount, description } = createPaymentDto;

    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.balance < amount) {
      throw new NotFoundException('Insufficient funds');
    }

    account.balance -= amount;
    await this.accountRepository.save(account);

    const payment = this.paymentRepository.create({
      accountId,
      amount,
      description,
    });

    return this.paymentRepository.save(payment);
  }

  async findAll() {
    return this.paymentRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
