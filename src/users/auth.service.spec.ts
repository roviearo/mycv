import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entitiy';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('adsfad@dsaf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throw error if user signup with email that is in use', async () => {
    await service.signup('asd@asd.com', 'password');

    await expect(service.signup('asd@asd.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throw if signin is called with an unused email', async () => {
    await expect(service.signin('asd@asd.com', 'ass')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throw if invalid password is provided', async () => {
    await service.signup('asd@asd.com', 'password');

    await expect(service.signin('asd@asd.com', 'ass')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('return a user if correct password provided', async () => {
    await service.signup('asd@asd.com', 'password');

    const user = await service.signin('asd@asd.com', 'password');
    expect(user).toBeDefined();
  });
});
