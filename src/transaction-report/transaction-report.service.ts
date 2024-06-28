import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionReportDto } from './dto/create-transaction-report.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { TransactionReportEntity } from './entities/transaction-report.entity';
import { Between, Repository } from 'typeorm';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { UpdateTransactionReportDto } from './dto/update-transaction-report.dto';

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

    const report = this.transactionReportRepository.create({
      accountId,
      payments,
      startDate: startDateAsDate,
      endDate: endDateAsDate,
      totalAmount,
    });

    return this.transactionReportRepository.save(report);
  }

  async findAll() {
    return this.transactionReportRepository.find();
  }

  async findOne(id: number) {
    const report = this.transactionReportRepository.findOne({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async update(
    id: number,
    updateTransactionReportDto: UpdateTransactionReportDto,
  ) {
    const { accountId, startDate, endDate } = updateTransactionReportDto;

    const report = await this.transactionReportRepository.findOne({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    if (accountId !== undefined) report.accountId = accountId;
    if (startDate !== undefined) report.startDate = new Date(startDate);
    if (endDate !== undefined) report.endDate = new Date(endDate);

    return this.transactionReportRepository.save(report);
  }

  async remove(id: number) {
    const report = this.transactionReportRepository.findOne({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return this.transactionReportRepository.delete({ id });
  }
}
