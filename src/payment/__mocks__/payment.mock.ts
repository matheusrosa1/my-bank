import { AccountEntityMock } from 'src/account/__mocks__/account.mock';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentEntity } from '../entities/payment.entity';
const paymentId = 1;

export const payments = [
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

export const updatePaymentDto: UpdatePaymentDto = {
  amount: 200, // Tentativa de atualizar o valor
};

export const existingPayment: PaymentEntity = {
  id: paymentId,
  accountId: AccountEntityMock.id,
  amount: 100,
  description: 'Payment 1',
  date: new Date(),
  imageUrl: 'https://example.com/image1.jpg',
  account: AccountEntityMock, // Adiciona a conta associada
};
