import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from 'src/shared/shared.module';
import { OTPService } from './services/otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OTP, OTPSchema } from './models/otp.model';
import { MailerService } from './services/mailer.service';
import { MailerConfig } from './mailer.config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }]),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, OTPService, MailerConfig, MailerService],
  controllers: [AuthController],
  exports: [AuthService, OTPService, MailerService],
})
export class AuthModule {}
