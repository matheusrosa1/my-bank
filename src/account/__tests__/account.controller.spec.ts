import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../account.controller';
import { AccountService } from '../account.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { AccountEntity } from '../entities/account.entity';
import { createAccountMock } from './createAccount.mock';
import { AccountEntityMock, AccountsEntityMock } from './account.mock';

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
  /*   it('should find an account by id', async () => {
    const mockAccount: CreateAccountDto = {
      name: 'Account1',
      balance: 1000,
      type: 'current',
      payments: [],
      transactionReports: [],
    };

    accountService.findOne.mockResolvedValue(mockAccount);

    const account = await controller.findOne('1');

    expect(account).toEqual(mockAccount);
    expect(accountService.findOne).toHaveBeenCalledWith(1);
  });

  it('should update an account', async () => {
    const updateDto: UpdateAccountDto = {
      name: 'Updated Account Name',
      balance: 2000,
      type: 'savings',
    };

    const mockUpdatedAccount: AccountEntity = {
      id: 1,
      ...updateDto,
      payments: [],
      transactionReports: [],
    };

    accountService.update.mockResolvedValue(mockUpdatedAccount);

    const updatedAccount = await controller.update('1', updateDto);

    expect(updatedAccount).toEqual(mockUpdatedAccount);
    expect(accountService.update).toHaveBeenCalledWith(1, updateDto);
  });

  it('should remove an account', async () => {
    const mockDeletedAccount: AccountEntity = {
      id: 1,
      name: 'DeletedAccount',
      balance: 1000,
      type: 'current',
      payments: [],
      transactionReports: [],
    };

    accountService.remove.mockResolvedValue(mockDeletedAccount);

    const deletedAccount = await controller.remove('1');

    expect(deletedAccount).toEqual(mockDeletedAccount);
    expect(accountService.remove).toHaveBeenCalledWith(1);
  });  */
});
