import { Module } from '@nestjs/common';
import { TransactionReportService } from './transaction-report.service';
import { TransactionReportController } from './transaction-report.controller';

@Module({
  controllers: [TransactionReportController],
  providers: [TransactionReportService],
})
export class TransactionReportModule {}
