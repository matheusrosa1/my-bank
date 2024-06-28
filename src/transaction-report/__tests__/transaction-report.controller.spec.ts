import { Test, TestingModule } from '@nestjs/testing';
import { TransactionReportController } from '../transaction-report.controller';
import { TransactionReportService } from '../transaction-report.service';
import { CreateTransactionReportDto } from '../dto/create-transaction-report.dto';
import { UpdateTransactionReportDto } from '../dto/update-transaction-report.dto';

describe('TransactionReportController', () => {
  let controller: TransactionReportController;
  let service: TransactionReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionReportController],
      providers: [
        {
          provide: TransactionReportService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionReportController>(
      TransactionReportController,
    );
    service = module.get<TransactionReportService>(TransactionReportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction report', async () => {
      const createTransactionReportDto: CreateTransactionReportDto = {
        accountId: 1,
        startDate: new Date(),
        endDate: new Date(),
      };
      const createdReport: any = {};

      jest.spyOn(service, 'create').mockResolvedValue(createdReport);

      expect(await controller.create(createTransactionReportDto)).toBe(
        createdReport,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of transaction reports', async () => {
      const reports = [];

      jest.spyOn(service, 'findAll').mockResolvedValue(reports);

      expect(await controller.findAll()).toBe(reports);
    });
  });

  describe('findOne', () => {
    it('should return a transaction report by ID', async () => {
      const reportId = 1;
      const foundReport: any = {};
      jest.spyOn(service, 'findOne').mockResolvedValue(foundReport);

      expect(await controller.findOne(reportId.toString())).toBe(foundReport);
    });
  });

  describe('update', () => {
    it('should update a transaction report', async () => {
      const reportId = 1;
      const updateTransactionReportDto: UpdateTransactionReportDto = {};
      const updatedReport: any = {};

      jest.spyOn(service, 'update').mockResolvedValue(updatedReport);

      expect(
        await controller.update(
          reportId.toString(),
          updateTransactionReportDto,
        ),
      ).toBe(updatedReport);
    });
  });

  describe('remove', () => {
    it('should remove a transaction report', async () => {
      const reportId = 1;
      const removedReport: any = {};

      jest.spyOn(service, 'remove').mockResolvedValue(removedReport);

      expect(await controller.remove(reportId.toString())).toBe(removedReport);
    });
  });
});
