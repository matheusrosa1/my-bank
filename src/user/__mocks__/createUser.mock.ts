import { CreateUserDto } from '../dto/create-user.dto';

export const createUserMock: CreateUserDto = {
  username: 'Teste',
  email: 'teste@gmail.com',
  password: '123456',
  cpf: '828.718.160-77',
};

export const createUserMockCpfInvalid: CreateUserDto = {
  username: 'Teste',
  email: 'testee@gmail.com',
  password: '123456',
  cpf: '12345',
};
