import { Test, TestingModule } from '@nestjs/testing';
import { TransactionReportService } from './transaction-report.service';

describe('TransactionReportService', () => {
  let service: TransactionReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionReportService],
    }).compile();

    service = module.get<TransactionReportService>(TransactionReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
