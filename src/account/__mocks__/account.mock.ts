import { AccountEntity } from 'src/account/entities/account.entity';
import { UpdateAccountDto } from '../dto/update-account.dto';

export const AccountEntityMock: AccountEntity = {
  id: 1,
  name: 'Test Account',
  balance: 1000,
  type: 'checking',
  payments: [],
  transactionReports: [],
};

export const AccountsEntityMock: AccountEntity[] = [
  {
    id: 1,
    name: 'Account 1',
    balance: 500,
    type: 'savings',
    payments: [],
    transactionReports: [],
  },
  {
    id: 2,
    name: 'Account 2',
    balance: 1000,
    type: 'checking',
    payments: [],
    transactionReports: [],
  },
];

export const createAccountMock = {
  name: 'Test Account',
  balance: 1000,
  type: 'checking',
};

export const updateDto: UpdateAccountDto = {
  name: 'Updated Account Name',
  type: 'savings',
};

export const invalidAccountTypeMock = {
  name: 'Invalid Account',
  balance: 500,
  type: 'invalid_type',
};

export const negativeBalanceAccountMock = {
  name: 'Negative Balance Account',
  balance: -100,
  type: 'savings',
};

export const mockUpdatedAccount: AccountEntity = {
  id: 1,
  name: 'Updated Account Name',
  balance: 1500,
  type: 'current',
  payments: [],
  transactionReports: [],
};
