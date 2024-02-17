import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JWTService {
  sign(payload: object, expiryInMs: number): string {
    return jwt.sign(payload, 'ztore-secret', {
      algorithm: 'HS256',
      allowInsecureKeySizes: false,
      expiresIn: expiryInMs,
    });
  }

  verifyAndDecode<T>(token: string): T {
    return jwt.verify(token, 'ztore-secret', {
      algorithms: ['HS256'],
      ignoreExpiration: false,
    }) as T;
  }
}
