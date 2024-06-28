import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../account.service';
import { Repository } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import {
  AccountEntityMock,
  AccountsEntityMock,
  createAccountMock,
  invalidAccountTypeMock,
  negativeBalanceAccountMock,
  updateDto,
} from '../__mocks__/account.mock';

describe('AccountService', () => {
  let service: AccountService;
  let repository: Repository<AccountEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(AccountEntity),
          useClass: Repository,
          useValue: {
            save: jest
              .fn()
              .mockResolvedValue((entity: AccountEntity) => entity),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repository = module.get<Repository<AccountEntity>>(
      getRepositoryToken(AccountEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an account', async () => {
      const mockSave = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(createAccountMock as AccountEntity);

      const savedAccount = await service.create(createAccountMock);

      expect(savedAccount).toBeDefined();
      expect(savedAccount.name).toBe(createAccountMock.name);
      expect(savedAccount.balance).toBe(createAccountMock.balance);
      expect(savedAccount.type).toBe(createAccountMock.type);

      expect(mockSave).toHaveBeenCalledWith(createAccountMock);
    });

    it('should throw UnauthorizedException for invalid account type', async () => {
      try {
        await service.create(invalidAccountTypeMock);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid account type');
      }
    });

    it('should throw UnauthorizedException for negative balance', async () => {
      try {
        await service.create(negativeBalanceAccountMock);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid balance');
      }
    });
  });

  describe('findAll', () => {
    it('should return all accounts', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(AccountsEntityMock);

      const allAccounts = await service.findAll();
      expect(allAccounts).toHaveLength(2);
      expect(allAccounts).toEqual(AccountsEntityMock);
    });
  });

  describe('findOne', () => {
    it('should find an account by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(AccountEntityMock);

      const foundAccount = await service.findOne(1);
      expect(foundAccount).toBeDefined();
      expect(foundAccount).toEqual(AccountEntityMock);
    });

    it('should throw NotFoundException when account is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      const invalidId = 999;
      try {
        await service.findOne(invalidId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Account not found');
      }
    });
  });

  describe('update', () => {
    it('should update an account successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(AccountEntityMock);

      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue({
        ...AccountEntityMock,
        ...updateDto,
      });

      const updatedAccount = await service.update(1, updateDto);

      expect(updatedAccount).toBeDefined();
      expect(updatedAccount.name).toBe(updateDto.name);
      expect(updatedAccount.type).toBe(updateDto.type);

      expect(service.findOne).toHaveBeenCalledWith(1);

      expect(saveSpy).toHaveBeenCalledWith({
        ...AccountEntityMock,
        ...updateDto,
      });
    });

    it('should throw NotFoundException when account is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      const invalidId = 999;
      const updateDto: UpdateAccountDto = {
        name: 'Updated Name',
        type: 'current',
      };

      try {
        await service.update(invalidId, updateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Account not found');
      }
    });

    it('should throw UnauthorizedException when trying to update balance', async () => {
      const updateDto: UpdateAccountDto = {
        balance: 1500,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(AccountEntityMock);

      try {
        await service.update(1, updateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Balance cannot be updated');
      }
    });
  });

  describe('remove', () => {
    it('should remove an account successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(AccountEntityMock);
      jest.spyOn(repository, 'remove').mockResolvedValue(AccountEntityMock);

      const deletedAccount = await service.remove(1);
      expect(deletedAccount).toBeDefined();
      expect(deletedAccount).toEqual(AccountEntityMock);
    });

    it('should throw NotFoundException when account is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      const invalidId = 999;

      try {
        await service.remove(invalidId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Account not found');
      }
    });
  });
});
