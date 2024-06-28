import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntityMock } from '../__mocks__/user.mock';
import {
  createUserMock,
  createUserMockCpfInvalid,
} from '../__mocks__/createUser.mock';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(UserEntityMock),
            save: jest.fn().mockReturnValue(UserEntityMock),
            find: jest.fn().mockResolvedValue([]),
            remove: jest.fn().mockReturnValue(UserEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should find a user by id', async () => {
    const user = await service.findOne(1);
    expect(user).toEqual(UserEntityMock);
  });

  it('should not find a user by id', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    try {
      await service.findOne(1);
    } catch (error) {
      expect(error.message).toBe('User not found');
    }
  });

  it('should return error if user already exists', async () => {
    expect(service.create(createUserMock)).rejects.toThrowError();
  });

  it('should return user if user not exist', async () => {
    jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined);

    const user = await service.create(createUserMock);
    expect(user).toEqual(UserEntityMock);
  });

  it('should return error if CPF is invalid', async () => {
    expect(service.create(createUserMockCpfInvalid)).rejects.toThrowError();
  });

  it('should return error if CPF is invalid', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(UserEntityMock);

    expect(service.create(createUserMock)).rejects.toThrowError();
  });

  it('should return all users', async () => {
    jest.spyOn(userRepository, 'find').mockResolvedValue([UserEntityMock]);

    const users = await service.findAll();
    expect(users).toEqual([UserEntityMock]);
  });

  it('should update a user successfully', async () => {
    const updateDto: UpdateUserDto = {
      email: 'teste@gmail.com',
      password: '123456',
    };

    const user = await service.update(1, updateDto);
    expect(user).toEqual(UserEntityMock);
    expect(user.email).toBe(updateDto.email);
    expect(user.password).toBe(updateDto.password);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    const updateDto: UpdateUserDto = {
      email: 'newemail@example.com',
    };

    await expect(service.update(1, updateDto)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should throw UnauthorizedException if email already exists', async () => {
    jest.spyOn(userRepository, 'find').mockResolvedValue([UserEntityMock]);

    const updateDto: UpdateUserDto = {
      email: 'existingemail@example.com',
    };

    await expect(service.update(1, updateDto)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if CPF already exists', async () => {
    jest.spyOn(userRepository, 'find').mockResolvedValue([UserEntityMock]);

    const updateDto: UpdateUserDto = {
      cpf: '12345678900',
    };

    await expect(service.update(1, updateDto)).rejects.toThrowError(
      UnauthorizedException,
    );
  });
  it('should remove a user successfully', async () => {
    const userId = 1;

    await expect(service.remove(userId)).resolves.not.toThrow();
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(userRepository.remove).toHaveBeenCalledWith(UserEntityMock);
  });
  it('should throw NotFoundException if user does not exist', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    const userId = 1;

    await expect(service.remove(userId)).rejects.toThrowError(
      NotFoundException,
    );
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(userRepository.remove).not.toHaveBeenCalled();
  });
});
