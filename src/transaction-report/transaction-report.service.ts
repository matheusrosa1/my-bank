import { Injectable } from '@nestjs/common';
import { CreateTransactionReportDto } from './dto/create-transaction-report.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { TransactionReportEntity } from './entities/transaction-report.entity';
import { Between, Repository } from 'typeorm';
import { PaymentEntity } from 'src/payment/entities/payment.entity';

@Injectable()
export class TransactionReportService {
  constructor(
    @InjectRepository(TransactionReportEntity)
    private readonly transactionReportRepository: Repository<TransactionReportEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async create(createTransactionReportDto: CreateTransactionReportDto) {
    const { accountId, startDate, endDate } = createTransactionReportDto;

    const startDateAsDate = new Date(startDate);
    const endDateAsDate = new Date(endDate);

    const payments = await this.paymentRepository.find({
      where: {
        accountId,
        date: Between(startDateAsDate, endDateAsDate),
      },
    });

    const totalAmount = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    console.log('totalAmount:', totalAmount);

    const report = this.transactionReportRepository.create({
      accountId,
      payments,
      startDate: startDateAsDate,
      endDate: endDateAsDate,
      totalAmount,
    });

    return this.transactionReportRepository.save(report);
  }

  findAll() {
    return this.transactionReportRepository.find();
  }

  findOne(id: number) {
    return this.transactionReportRepository.findOne({
      where: { id },
    });
  }

  /*   update(id: number, updateTransactionReportDto: UpdateTransactionReportDto) {
    return `This action updates a #${id} transactionReport`;
  } */

  remove(id: number) {
    return `This action removes a #${id} transactionReport`;
  }
}
