// payment.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccountEntity } from '../../account/entities/account.entity';
import { PaymentService } from '../payment.service';
import { PaymentEntity } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';

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
        amount: null, // Amount is missing
        description: 'Test payment',
      };

      await expect(service.create(createPaymentDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if accountId is not provided', async () => {
      const createPaymentDto: CreatePaymentDto = {
        accountId: null, // Account ID is missing
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
      account.balance = 50; // Insufficient funds

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
      account.balance = 200; // Sufficient funds

      jest.spyOn(accountRepository, 'findOne').mockResolvedValueOnce(account);
      jest.spyOn(accountRepository, 'save').mockResolvedValueOnce(account);

      const payment = new PaymentEntity();
      jest.spyOn(paymentRepository, 'create').mockReturnValue(payment);
      jest.spyOn(paymentRepository, 'save').mockResolvedValueOnce(payment);

      const result = await service.create(createPaymentDto);

      expect(result).toBe(payment);
      expect(account.balance).toBe(100); // Balance should be updated
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
});
