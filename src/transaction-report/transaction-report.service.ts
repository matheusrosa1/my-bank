import { Injectable } from '@nestjs/common';
import { CreateTransactionReportDto } from './dto/create-transaction-report.dto';
import { UpdateTransactionReportDto } from './dto/update-transaction-report.dto';

@Injectable()
export class TransactionReportService {
  create(createTransactionReportDto: CreateTransactionReportDto) {
    return 'This action adds a new transactionReport';
  }

  findAll() {
    return `This action returns all transactionReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transactionReport`;
  }

  update(id: number, updateTransactionReportDto: UpdateTransactionReportDto) {
    return `This action updates a #${id} transactionReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionReport`;
  }
}
