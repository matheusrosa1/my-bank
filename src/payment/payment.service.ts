import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Repository } from 'typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { AccountEntity } from 'src/account/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePaymentDto } from './dto/update-payment.dto';

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

    if (!createPaymentDto.amount) {
      throw new UnauthorizedException('Amount is required');
    }

    if (!createPaymentDto.accountId) {
      throw new UnauthorizedException('Account ID is required');
    }

    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.balance < amount) {
      throw new UnauthorizedException('Insufficient funds');
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

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (updatePaymentDto.amount) {
      throw new UnauthorizedException('Amount cannot be updated');
    }

    if (updatePaymentDto.description !== undefined) {
      payment.description = updatePaymentDto.description;
    }

    return this.paymentRepository.save(payment);
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
