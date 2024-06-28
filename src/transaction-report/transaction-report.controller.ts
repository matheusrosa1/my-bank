import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TransactionReportService } from './transaction-report.service';
import { CreateTransactionReportDto } from './dto/create-transaction-report.dto';
import { UpdateTransactionReportDto } from './dto/update-transaction-report.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('transaction-report')
export class TransactionReportController {
  constructor(
    private readonly transactionReportService: TransactionReportService,
  ) {}

  @Post()
  create(@Body() createTransactionReportDto: CreateTransactionReportDto) {
    return this.transactionReportService.create(createTransactionReportDto);
  }

  @Get()
  findAll() {
    return this.transactionReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionReportService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionReportDto: UpdateTransactionReportDto,
  ) {
    return this.transactionReportService.update(
      +id,
      updateTransactionReportDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionReportService.remove(+id);
  }
}
