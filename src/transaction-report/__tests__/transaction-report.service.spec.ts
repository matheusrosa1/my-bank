import { Test, TestingModule } from '@nestjs/testing';
import { TransactionReportService } from '../transaction-report.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionReportEntity } from '../entities/transaction-report.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { CreateTransactionReportDto } from '../dto/create-transaction-report.dto';
import { Between } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TransactionReportService', () => {
  let service: TransactionReportService;
  const transactionReportRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
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
  it('should find all transaction reports', async () => {
    const transactionReports = [
      {
        id: 1,
        accountId: 1,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      },
      {
        id: 2,
        accountId: 2,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-28'),
      },
    ];

    transactionReportRepositoryMock.find.mockResolvedValue(
      transactionReports as any,
    );

    const result = await service.findAll();

    expect(result).toEqual(transactionReports);
    expect(transactionReportRepositoryMock.find).toHaveBeenCalled();
  });
  it('should find one transaction report', async () => {
    const reportId = 1;
    const report = {
      id: reportId,
      accountId: 1,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    };

    transactionReportRepositoryMock.findOne.mockResolvedValue(report as any);

    const result = await service.findOne(reportId);

    expect(result).toEqual(report);
    expect(transactionReportRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: reportId },
    });
  });

  it('should throw NotFoundException if report is not found', async () => {
    const reportId = 999; // Um ID que não existe

    transactionReportRepositoryMock.findOne.mockResolvedValue(null);

    try {
      await service.findOne(reportId);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Report not found');
    }

    expect(transactionReportRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: reportId },
    });
  });
  it('should update a transaction report', async () => {
    const reportId = 1;
    const updateDto: any = {
      accountId: 2,
      startDate: '2024-02-01',
      endDate: '2024-02-28',
    };
    const report = {
      id: reportId,
      accountId: 1,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    };

    transactionReportRepositoryMock.findOne.mockResolvedValue(report);
    transactionReportRepositoryMock.save.mockResolvedValue(report as any);

    const result = await service.update(reportId, updateDto);

    expect(result).toEqual(report);
    expect(transactionReportRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: reportId },
    });
    expect(transactionReportRepositoryMock.save).toHaveBeenCalledWith(report);
  });

  it('should throw NotFoundException if report is not found during update', async () => {
    const reportId = 999; // Um ID que não existe
    const updateDto: any = {
      startDate: '2024-02-01',
      endDate: '2024-02-28',
    };

    transactionReportRepositoryMock.findOne.mockResolvedValue(null);

    await expect(service.update(reportId, updateDto)).rejects.toThrowError(
      NotFoundException,
    );
    expect(transactionReportRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: reportId },
    });
    expect(transactionReportRepositoryMock.save).not.toHaveBeenCalled();
  });
  it('should remove a transaction report', async () => {
    const reportId = 1;
    const report = {
      id: reportId,
      accountId: 1,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    };

    transactionReportRepositoryMock.findOne.mockResolvedValue(report);
    transactionReportRepositoryMock.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(reportId);

    expect(result).toEqual({ affected: 1 });
    expect(transactionReportRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: reportId },
    });
    expect(transactionReportRepositoryMock.delete).toHaveBeenCalledWith({
      id: reportId,
    });
  });
});
