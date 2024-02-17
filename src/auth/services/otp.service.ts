import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OTP, OTPDocument } from '../models/otp.model';
import { User } from 'src/users/schemas/user.schema';
import { randomInt } from 'crypto';
import { Model } from 'mongoose';

@Injectable()
export class OTPService {
  logger: Logger;

  constructor(@InjectModel(OTP.name) private otpModel: Model<OTPDocument>) {
    this.logger = new Logger(OTPService.name);
  }

  async generateOTP(user: User): Promise<OTP | undefined> {
    this.logger.log('Generating an OTP!');

    const otp = new this.otpModel({
      otp: randomInt(10000, 99999).toString(),
      user: user,
      expiry: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    });

    return await otp.save();
  }

  async validateUserAndOTP(otp: string, user: User): Promise<boolean> {
    this.logger.log('Validating the OTP and user!');

    try {
      const storedOTP = await this.otpModel.findOne({ otp, user });

      if (!storedOTP) {
        this.logger.error('No OTP found!');
        return false;
      }

      await this.otpModel.findOneAndDelete({ otp, user });

      return true;
    } catch (error) {
      this.logger.error('Failed to validate user and OTP!');
      return false;
    }
  }
}
