import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionReportDto } from './create-transaction-report.dto';

export class UpdateTransactionReportDto extends PartialType(
  CreateTransactionReportDto,
) {}
