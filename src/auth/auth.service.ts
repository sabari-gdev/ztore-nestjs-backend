import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { LoginResponse } from './interfaces/login-response.interface';
import { JWTService } from 'src/shared/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { OTPService } from './services/otp.service';
import { EmailLoginRequest } from './dto/login.request.dto';

@Injectable()
export class AuthService {
  logger: Logger;

  constructor(
    private readonly jwtService: JWTService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly otpService: OTPService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async login(req: EmailLoginRequest): Promise<LoginResponse> {
    this.logger.log('Logging an user');

    const user = await this.userService.checkUserCredentials(
      req.email,
      req.password,
    );

    return this.createLoginResponse(user);
  }

  async verifyEmailOTP(otp: string, email: string): Promise<boolean> {
    this.logger.log('Verifying OTP!');

    const user = await this.userService.findUserByEmail(email);

    const verifyOTP = await this.otpService.validateUserAndOTP(otp, user);
    if (!verifyOTP) {
      this.logger.log('Invalid OTP!');
    }
    user.verified = true;

    await this.userService.updateUser(user);
    return true;
  }

  async createLoginResponse(user: User): Promise<LoginResponse> {
    return {
      accessToken: this.createAccessToken(user),
      refreshToken: this.createRefreshToken(user),
    };
  }

  private createAccessToken(user: User, parameters?: string): string {
    const payload = {
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      parameters,
    };

    return this.jwtService.sign(payload, 86400000);
  }

  private createRefreshToken(user: User, parameters?: string): string {
    const payload = {
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      parameters,
      refreshToken: true,
    };

    return this.jwtService.sign(payload, 25920000);
  }
}
