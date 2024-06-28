import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((createUserDto: CreateUserDto) => {
                const newUser: UserEntity = {
                  id: 1,
                  ...createUserDto,
                };
                return Promise.resolve(newUser);
              }),
            findAll: jest.fn().mockResolvedValue([
              {
                id: 1,
                username: 'TestUser1',
                password: 'password1',
                email: 'testuser1@example.com',
                cpf: '12345678901',
              },
              {
                id: 2,
                username: 'TestUser2',
                password: 'password2',
                email: 'testuser2@example.com',
                cpf: '98765432109',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: number) => {
              if (id === 1) {
                return Promise.resolve({
                  id: 1,
                  username: 'TestUser1',
                  password: 'password1',
                  email: 'testuser1@example.com',
                  cpf: '12345678901',
                });
              } else {
                return Promise.resolve(undefined);
              }
            }),
            update: jest
              .fn()
              .mockImplementation(
                (id: number, updateUserDto: UpdateUserDto) => {
                  if (id === 1) {
                    const updatedUser: UserEntity = {
                      id: 1,
                      username: 'UpdatedUser',
                      password: updateUserDto.password || 'password1',
                      email: updateUserDto.email || 'testuser1@example.com',
                      cpf: updateUserDto.cpf || '12345678901',
                    };
                    return Promise.resolve(updatedUser);
                  } else {
                    return Promise.resolve(undefined);
                  }
                },
              ),
            remove: jest.fn().mockResolvedValue({
              id: 1,
              username: 'DeletedUser',
              password: 'password1',
              email: 'deleteduser@example.com',
              cpf: '12345678901',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'NewUser',
      password: 'newpassword',
      email: 'newuser@example.com',
      cpf: '98765432109',
    };

    const createdUser = await controller.create(createUserDto);

    expect(createdUser).toBeDefined();
    expect(createdUser.username).toBe(createUserDto.username);
    expect(createdUser.email).toBe(createUserDto.email);
    expect(userService.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should find all users', async () => {
    const users = await controller.findAll();

    expect(users).toBeDefined();
    expect(users.length).toBe(2);
    expect(users[0].username).toBe('TestUser1');
    expect(users[1].username).toBe('TestUser2');
    expect(userService.findAll).toHaveBeenCalled();
  });

  it('should find a user by id', async () => {
    const userId = '1';

    const user = await controller.findOne(userId);

    expect(user).toBeDefined();
    expect(user.username).toBe('TestUser1');
    expect(user.email).toBe('testuser1@example.com');
    expect(userService.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a user', async () => {
    const userId = '1';
    const updateUserDto: UpdateUserDto = {
      password: 'updatedpassword',
      email: 'updateduser@example.com',
    };

    const updatedUser = await controller.update(userId, updateUserDto);

    expect(updatedUser).toBeDefined();
    expect(updatedUser.username).toBe('UpdatedUser');
    expect(updatedUser.email).toBe(updateUserDto.email);
    expect(updatedUser.password).toBe(updateUserDto.password);
    expect(userService.update).toHaveBeenCalledWith(1, updateUserDto);
  });

  it('should remove a user', async () => {
    const userId = '1';

    const deletedUser = await controller.remove(userId);

    expect(deletedUser).toBeDefined();
    expect(deletedUser.username).toBe('DeletedUser');
    expect(deletedUser.email).toBe('deleteduser@example.com');
    expect(userService.remove).toHaveBeenCalledWith(1);
  });
});
