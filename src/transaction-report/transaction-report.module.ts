import { Module } from '@nestjs/common';
import { TransactionReportService } from './transaction-report.service';
import { TransactionReportController } from './transaction-report.controller';
import { TransactionReportEntity } from './entities/transaction-report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from 'src/payment/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionReportEntity, PaymentEntity])],
  controllers: [TransactionReportController],
  providers: [TransactionReportService],
})
export class TransactionReportModule {}
