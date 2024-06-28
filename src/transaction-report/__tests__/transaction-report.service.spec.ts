import { Test, TestingModule } from '@nestjs/testing';
import { TransactionReportService } from '../transaction-report.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionReportEntity } from '../entities/transaction-report.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { CreateTransactionReportDto } from '../dto/create-transaction-report.dto';
import { Between } from 'typeorm';

describe('TransactionReportService', () => {
  let service: TransactionReportService;
  const transactionReportRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
  };
  const paymentRepositoryMock = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionReportService,
        {
          provide: getRepositoryToken(TransactionReportEntity),
          useValue: transactionReportRepositoryMock,
        },
        {
          provide: getRepositoryToken(PaymentEntity),
          useValue: paymentRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<TransactionReportService>(TransactionReportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a transaction report', async () => {
    const createTransactionReportDto: CreateTransactionReportDto = {
      accountId: 1,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    };

    const payments = [{ amount: 100 }, { amount: 150 }, { amount: 75 }];

    paymentRepositoryMock.find.mockResolvedValue(payments as any);

    const totalAmount = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    const expectedReport = {
      id: 1,
      accountId: createTransactionReportDto.accountId,
      startDate: createTransactionReportDto.startDate,
      endDate: createTransactionReportDto.endDate,
      payments,
      totalAmount,
    };

    transactionReportRepositoryMock.create.mockReturnValue(
      expectedReport as any,
    );
    transactionReportRepositoryMock.save.mockResolvedValue(
      expectedReport as any,
    );

    const result = await service.create(createTransactionReportDto);

    expect(result).toEqual(expectedReport);
    expect(transactionReportRepositoryMock.create).toHaveBeenCalledWith({
      accountId: createTransactionReportDto.accountId,
      startDate: createTransactionReportDto.startDate,
      endDate: createTransactionReportDto.endDate,
      payments,
      totalAmount,
    });
    expect(transactionReportRepositoryMock.save).toHaveBeenCalledWith(
      expectedReport as any,
    );
    expect(paymentRepositoryMock.find).toHaveBeenCalledWith({
      where: {
        accountId: createTransactionReportDto.accountId,
        date: Between(
          createTransactionReportDto.startDate,
          createTransactionReportDto.endDate,
        ),
      },
    });
  });
});
