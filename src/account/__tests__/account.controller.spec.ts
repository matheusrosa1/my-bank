import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../account.controller';
import { AccountService } from '../account.service';

import { AccountEntity } from '../entities/account.entity';

import {
  AccountEntityMock,
  AccountsEntityMock,
  createAccountMock,
  mockUpdatedAccount,
  updateDto,
} from '../__mocks__/account.mock';

describe('AccountController', () => {
  let controller: AccountController;
  let accountService: AccountService;

  beforeEach(async () => {
    const mockAccountService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an account', async () => {
    const mockCreatedAccount: AccountEntity = {
      id: 1,
      ...createAccountMock,
      payments: [],
      transactionReports: [],
    };

    jest.spyOn(accountService, 'create').mockResolvedValue(mockCreatedAccount);

    const createdAccount = await controller.create(createAccountMock);

    expect(createdAccount).toEqual(mockCreatedAccount);
    expect(accountService.create).toHaveBeenCalledWith(createAccountMock);
  });

  it('should find all accounts', async () => {
    jest.spyOn(accountService, 'findAll').mockResolvedValue(AccountsEntityMock);

    const accounts = await controller.findAll();

    expect(accounts).toEqual(AccountsEntityMock);
    expect(accountService.findAll).toHaveBeenCalled();
  });

  it('should find one account by id', async () => {
    const accountId = '1';

    jest.spyOn(accountService, 'findOne').mockResolvedValue(AccountEntityMock);

    const account = await controller.findOne(accountId);

    expect(account).toEqual(AccountEntityMock);
    expect(accountService.findOne).toHaveBeenCalledWith(+accountId);
  });
  it('should update an account', async () => {
    const accountId = '1';

    jest.spyOn(accountService, 'update').mockResolvedValue(mockUpdatedAccount);

    const updatedAccount = await controller.update(accountId, updateDto);

    expect(updatedAccount).toEqual(mockUpdatedAccount);
    expect(accountService.update).toHaveBeenCalledWith(+accountId, updateDto);
  });

  it('should remove an account', async () => {
    const accountId = '1';

    jest.spyOn(accountService, 'remove').mockResolvedValue(AccountEntityMock);

    const removedAccount = await controller.remove(accountId);

    expect(removedAccount).toEqual(AccountEntityMock);
    expect(accountService.remove).toHaveBeenCalledWith(+accountId);
  });
});
