import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Repository } from 'typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { AccountEntity } from '../account/entities/account.entity';
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
    const payment = this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
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

  async remove(id: number) {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.paymentRepository.remove(payment);
  }

  async salvarUrlDaImagem(url: string, paymentId: number): Promise<boolean> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id: paymentId },
      });
      if (!payment) {
        throw new Error(`Payment with ID ${paymentId} not found.`);
      }

      payment.imageUrl = url;
      await this.paymentRepository.save(payment);
      return true;
    } catch (error) {
      console.error('Error saving image URL in payment:', error.message);
      return false;
    }
  }

  async uploadImagem(
    file: Express.MulterS3.File,
    paymentId: number,
  ): Promise<{ message: string; imageUrl?: string }> {
    if (!file) {
      return { message: 'No files have been uploaded' };
    }

    const imageUrl = file.location;
    const success = await this.salvarUrlDaImagem(imageUrl, paymentId);

    if (success) {
      return { message: 'Successfully saved image URL', imageUrl };
    } else {
      return { message: 'Failed to save image URL' };
    }
  }
}
