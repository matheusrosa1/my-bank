import { Test, TestingModule } from '@nestjs/testing';
import { TransactionReportController } from '../transaction-report.controller';
import { TransactionReportService } from '../transaction-report.service';
import { CreateTransactionReportDto } from '../dto/create-transaction-report.dto';
import { UpdateTransactionReportDto } from '../dto/update-transaction-report.dto';
import { NotFoundException } from '@nestjs/common';

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
      const createdReport: any = {}; // Define o objeto de relatório criado como esperado

      jest.spyOn(service, 'create').mockResolvedValue(createdReport);

      expect(await controller.create(createTransactionReportDto)).toBe(
        createdReport,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of transaction reports', async () => {
      const reports = []; // Define os relatórios esperados

      jest.spyOn(service, 'findAll').mockResolvedValue(reports);

      expect(await controller.findAll()).toBe(reports);
    });
  });

  describe('findOne', () => {
    it('should return a transaction report by ID', async () => {
      const reportId = 1;
      const foundReport: any = {}; // Define o relatório encontrado como esperado

      jest.spyOn(service, 'findOne').mockResolvedValue(foundReport);

      expect(await controller.findOne(reportId.toString())).toBe(foundReport);
    });

    it('should throw NotFoundException if report is not found', async () => {
      const reportId = 999; // ID inválido que não existe
      jest.spyOn(service, 'findOne').mockResolvedValue(null); // Simula relatório não encontrado

      await expect(
        controller.findOne(reportId.toString()),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a transaction report', async () => {
      const reportId = 1;
      const updateTransactionReportDto: UpdateTransactionReportDto = {}; // Define o DTO de atualização
      const updatedReport: any = {}; // Define o relatório atualizado como esperado

      jest.spyOn(service, 'update').mockResolvedValue(updatedReport);

      expect(
        await controller.update(
          reportId.toString(),
          updateTransactionReportDto,
        ),
      ).toBe(updatedReport);
    });

    it('should throw NotFoundException if report is not found', async () => {
      const reportId = 999; // ID inválido que não existe
      const updateTransactionReportDto: UpdateTransactionReportDto = {}; // Define o DTO de atualização
      jest.spyOn(service, 'update').mockResolvedValue(null);

      await expect(
        controller.update(reportId.toString(), updateTransactionReportDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a transaction report', async () => {
      const reportId = 1;
      const removedReport: any = {}; // Define o relatório removido como esperado

      jest.spyOn(service, 'remove').mockResolvedValue(removedReport);

      expect(await controller.remove(reportId.toString())).toBe(removedReport);
    });

    it('should throw NotFoundException if report is not found', async () => {
      const reportId = 999; // ID inválido que não existe
      jest.spyOn(service, 'remove').mockResolvedValue(null);

      await expect(controller.remove(reportId.toString())).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
