import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class PasswordEncoder {
  async encode(password: string): Promise<string> {
    return await hash(password, 10);
  }

  async comparePassword(password: string, hashed: string): Promise<boolean> {
    return await compare(password, hashed);
  }
}
