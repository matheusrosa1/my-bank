import { UpdateAccountDto } from '../dto/update-account.dto';

export const createAccountMock = {
  name: 'Test Account',
  balance: 1000,
  type: 'current',
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
