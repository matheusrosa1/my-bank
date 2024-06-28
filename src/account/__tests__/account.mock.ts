import { AccountEntity } from 'src/account/entities/account.entity';

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
