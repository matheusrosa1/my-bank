// payment.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccountEntity } from '../../account/entities/account.entity';
import { PaymentService } from '../payment.service';
import { PaymentEntity } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

describe('PaymentService', () => {
  let service: PaymentService;
  let accountRepository: Repository<AccountEntity>;
  let paymentRepository: Repository<PaymentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(AccountEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PaymentEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    accountRepository = module.get<Repository<AccountEntity>>(
      getRepositoryToken(AccountEntity),
    );
    paymentRepository = module.get<Repository<PaymentEntity>>(
      getRepositoryToken(PaymentEntity),
    );
  });

  describe('create', () => {
    it('should throw UnauthorizedException if amount is not provided', async () => {
      const createPaymentDto: CreatePaymentDto = {
        accountId: 1,
        amount: null,
        description: 'Test payment',
      };

      await expect(service.create(createPaymentDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if accountId is not provided', async () => {
      const createPaymentDto: CreatePaymentDto = {
        accountId: null,
        amount: 100,
        description: 'Test payment',
      };

      await expect(service.create(createPaymentDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw NotFoundException if account is not found', async () => {
      const createPaymentDto: CreatePaymentDto = {
        accountId: 1,
        amount: 100,
        description: 'Test payment',
      };

      jest.spyOn(accountRepository, 'findOne').mockResolvedValueOnce(null); // Simulate account not found

      await expect(service.create(createPaymentDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if account has insufficient funds', async () => {
      const createPaymentDto: CreatePaymentDto = {
        accountId: 1,
        amount: 100,
        description: 'Test payment',
      };

      const account = new AccountEntity();
      account.id = 1;
      account.balance = 50;

      jest.spyOn(accountRepository, 'findOne').mockResolvedValueOnce(account);

      await expect(service.create(createPaymentDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should create and save payment if all conditions are met', async () => {
      const createPaymentDto: CreatePaymentDto = {
        accountId: 1,
        amount: 100,
        description: 'Test payment',
      };

      const account = new AccountEntity();
      account.id = 1;
      account.balance = 200;
      jest.spyOn(accountRepository, 'findOne').mockResolvedValueOnce(account);
      jest.spyOn(accountRepository, 'save').mockResolvedValueOnce(account);

      const payment = new PaymentEntity();
      jest.spyOn(paymentRepository, 'create').mockReturnValue(payment);
      jest.spyOn(paymentRepository, 'save').mockResolvedValueOnce(payment);

      const result = await service.create(createPaymentDto);

      expect(result).toBe(payment);
      expect(account.balance).toBe(100);
      expect(accountRepository.save).toHaveBeenCalledWith(account);
      expect(paymentRepository.create).toHaveBeenCalledWith({
        accountId: createPaymentDto.accountId,
        amount: createPaymentDto.amount,
        description: createPaymentDto.description,
      });
      expect(paymentRepository.save).toHaveBeenCalledWith(payment);
    });
  });
  describe('findAll', () => {
    it('should return all payments', async () => {
      const payments = [
        {
          id: 1,
          accountId: 1,
          amount: 100,
          description: 'Payment 1',
          date: new Date(),
          imageUrl: 'https://example.com/image1.jpg',
        },
        {
          id: 2,
          accountId: 2,
          amount: 200,
          description: 'Payment 2',
          date: new Date(),
          imageUrl: 'https://example.com/image2.jpg',
        },
      ] as PaymentEntity[];

      jest.spyOn(paymentRepository, 'find').mockResolvedValueOnce(payments);

      const result = await service.findAll();

      expect(result).toBe(payments);
      expect(paymentRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array if no payments are found', async () => {
      jest.spyOn(paymentRepository, 'find').mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(paymentRepository.find).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should return a payment object if found', async () => {
      const paymentId = 1;
      const mockPayment: PaymentEntity = {
        id: paymentId,
        accountId: 1,
        amount: 100,
        description: 'Payment 1',
        date: new Date(),
        imageUrl: 'https://example.com/image1.jpg',
        account: new AccountEntity(),
      };

      jest.spyOn(paymentRepository, 'findOne').mockResolvedValue(mockPayment);

      const result = await service.findOne(paymentId);
      expect(result).toBe(mockPayment);
      expect(paymentRepository.findOne).toHaveBeenCalledWith({
        where: { id: paymentId },
      });
    });
  });
  describe('update', () => {
    it('should update payment description if found', async () => {
      const paymentId = 1;
      const updatePaymentDto: UpdatePaymentDto = {
        description: 'Updated description',
      };

      const mockAccount: AccountEntity = {
        id: 1,
        name: 'Test Account',
        type: 'current',
        balance: 1000,
        payments: [],
        transactionReports: [],
      };

      const existingPayment: PaymentEntity = {
        id: paymentId,
        accountId: mockAccount.id,
        amount: 100,
        description: 'Payment 1',
        date: new Date(),
        imageUrl: 'https://example.com/image1.jpg',
        account: mockAccount,
      };

      jest
        .spyOn(paymentRepository, 'findOne')
        .mockResolvedValue(existingPayment);
      jest.spyOn(paymentRepository, 'save').mockResolvedValue(existingPayment); // Simula save

      const result = await service.update(paymentId, updatePaymentDto);

      expect(result).toEqual(existingPayment);
      expect(result.description).toEqual(updatePaymentDto.description);
      expect(paymentRepository.findOne).toHaveBeenCalledWith({
        where: { id: paymentId },
      });
      expect(paymentRepository.save).toHaveBeenCalledWith(existingPayment);
    });

    it('should throw UnauthorizedException if trying to update amount', async () => {
      const paymentId = 1;
      const updatePaymentDto: UpdatePaymentDto = {
        amount: 200,
      };
      const mockAccount: AccountEntity = {
        id: 1,
        name: 'Test Account',
        type: 'current',
        balance: 1000,
        payments: [],
        transactionReports: [],
      };

      const existingPayment: PaymentEntity = {
        id: paymentId,
        accountId: mockAccount.id,
        amount: 100,
        description: 'Payment 1',
        date: new Date(),
        imageUrl: 'https://example.com/image1.jpg',
        account: mockAccount,
      };

      jest
        .spyOn(paymentRepository, 'findOne')
        .mockResolvedValue(existingPayment);

      await expect(service.update(paymentId, updatePaymentDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(paymentRepository.findOne).toHaveBeenCalledWith({
        where: { id: paymentId },
      });
    });

    it('should throw NotFoundException if payment is not found', async () => {
      const paymentId = 999;
      const updatePaymentDto: UpdatePaymentDto = {
        description: 'Updated description',
      };

      jest.spyOn(paymentRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(paymentId, updatePaymentDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(paymentRepository.findOne).toHaveBeenCalledWith({
        where: { id: paymentId },
      });
    });
  });
  describe('remove', () => {
    it('should remove payment if found', async () => {
      const paymentId = 1;

      const mockAccount: AccountEntity = {
        id: 1,
        name: 'Test Account',
        type: 'current',
        balance: 1000,
        payments: [],
        transactionReports: [],
      };

      const existingPayment: PaymentEntity = {
        id: paymentId,
        accountId: mockAccount.id,
        amount: 100,
        description: 'Payment 1',
        date: new Date(),
        imageUrl: 'https://example.com/image1.jpg',
        account: mockAccount,
      };

      jest
        .spyOn(paymentRepository, 'findOne')
        .mockResolvedValue(existingPayment);
      jest
        .spyOn(paymentRepository, 'remove')
        .mockResolvedValue(existingPayment);

      await service.remove(paymentId);

      expect(paymentRepository.findOne).toHaveBeenCalledWith({
        where: { id: paymentId },
      });
      expect(paymentRepository.remove).toHaveBeenCalledWith(existingPayment);
    });
  });
  describe('salvarUrlDaImagem', () => {
    it('should save image URL in payment if found', async () => {
      const paymentId = 1;
      const imageUrl = 'https://example.com/image1.jpg';

      const mockAccount: AccountEntity = {
        id: 1,
        name: 'Test Account',
        type: 'current',
        balance: 1000,
        payments: [],
        transactionReports: [],
      };

      const existingPayment: PaymentEntity = {
        id: paymentId,
        accountId: mockAccount.id,
        amount: 100,
        description: 'Payment 1',
        date: new Date(),
        imageUrl: 'https://example.com/image1.jpg',
        account: mockAccount,
      };

      jest
        .spyOn(paymentRepository, 'findOne')
        .mockResolvedValue(existingPayment);
      jest.spyOn(paymentRepository, 'save').mockResolvedValue(existingPayment); // Simula save

      const success = await service.salvarUrlDaImagem(imageUrl, paymentId);

      expect(success).toBeTruthy();
      expect(existingPayment.imageUrl).toBe(imageUrl);
      expect(paymentRepository.findOne).toHaveBeenCalledWith({
        where: { id: paymentId },
      });
      expect(paymentRepository.save).toHaveBeenCalledWith(existingPayment);
    });

    it('should return false if payment is not found', async () => {
      const paymentId = 999;
      const imageUrl = 'https://example.com/image1.jpg';

      jest.spyOn(paymentRepository, 'findOne').mockResolvedValue(null);

      const success = await service.salvarUrlDaImagem(imageUrl, paymentId);

      expect(success).toBeFalsy();
      expect(paymentRepository.findOne).toHaveBeenCalledWith({
        where: { id: paymentId },
      });
    });
  });

  describe('uploadImagem', () => {
    it('should return message when no file is uploaded', async () => {
      const paymentId = 1;
      const file: any = null;

      const result = await service.uploadImagem(file, paymentId);

      expect(result.message).toBe('No files have been uploaded');
    });

    it('should upload image and return success message with URL', async () => {
      const paymentId = 1;
      const imageUrl = 'https://example.com/image1.jpg';
      const file = { location: imageUrl };
      jest.spyOn(service, 'salvarUrlDaImagem').mockResolvedValue(true);

      const result = await service.uploadImagem(file as any, paymentId);

      expect(result.message).toBe('Successfully saved image URL');
      expect(result.imageUrl).toBe(imageUrl);
      expect(service.salvarUrlDaImagem).toHaveBeenCalledWith(
        imageUrl,
        paymentId,
      );
    });

    it('should handle failure to upload image', async () => {
      const paymentId = 1;
      const imageUrl = 'https://example.com/image1.jpg';
      const file = { location: imageUrl };

      jest.spyOn(service, 'salvarUrlDaImagem').mockResolvedValue(false);

      const result = await service.uploadImagem(file as any, paymentId);

      expect(result.message).toBe('Failed to save image URL');
      expect(result.imageUrl).toBeUndefined();
      expect(service.salvarUrlDaImagem).toHaveBeenCalledWith(
        imageUrl,
        paymentId,
      );
    });
  });
});
