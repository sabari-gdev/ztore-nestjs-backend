import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { APIResponse } from 'src/common/dto/api-response.dto';
import { AuthService } from './auth.service';
import { EmailVerificationDTO } from './dto/email-verification.request.dto';
import { LoginResponse } from './interfaces/login-response.interface';
import { EmailLoginRequest } from './dto/login.request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: EmailLoginRequest,
  ): Promise<APIResponse<LoginResponse>> {
    const response = await this.authService.login(body);

    return APIResponse.create({
      code: HttpStatus.OK,
      status: true,
      message: 'Logged in successfully!',
      data: [response],
    });
  }
  @Post('email-verification')
  async emailVerification(
    @Body() body: EmailVerificationDTO,
  ): Promise<APIResponse<boolean>> {
    await this.authService.verifyEmailOTP(body.otp, body.email);

    return APIResponse.create({
      code: HttpStatus.OK,
      message: 'Verification completed!',
      status: true,
    });
  }
}
