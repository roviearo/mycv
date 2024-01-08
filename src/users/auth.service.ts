import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // see if email is used
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // hash the user password
    // generate a salt
    const salt = randomBytes(8).toString('hex');

    // hash salt and password
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join hashed result and save it
    const result = salt + '.' + hash.toString('hex');

    // create new user and save it
    const user = await this.userService.create(email, result);

    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    // see if email is used
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
