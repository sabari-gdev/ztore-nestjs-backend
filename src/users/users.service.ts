import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { USER_CONSTANTS } from './constants/user.constants';
import { PasswordEncoder } from 'src/common/utils/password.encoder';
import { LoginResponse } from 'src/auth/interfaces/login-response.interface';
import { AuthService } from 'src/auth/auth.service';
import { OTPService } from 'src/auth/services/otp.service';
import { MailerService } from 'src/auth/services/mailer.service';

@Injectable()
export class UsersService {
  logger: Logger;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private passwordEncoder: PasswordEncoder,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    private otpService: OTPService,
    private mailerService: MailerService,
  ) {
    this.logger = new Logger(UsersService.name);
  }

  async create(req: CreateUserDto): Promise<LoginResponse> {
    this.logger.log('Creating an user.!', req.email);

    try {
      const existingUser = await this.userModel.findOne({ email: req.email });
      if (existingUser) {
        throw new BadRequestException(USER_CONSTANTS.USER_EXISTS);
      }

      const encodedPassword = await this.passwordEncoder.encode(req.password);
      req.password = encodedPassword;

      const user = new this.userModel(req);
      await user.save();

      const generatedOTP = await this.otpService.generateOTP(user);
      if (!generatedOTP) {
        throw new Error(USER_CONSTANTS.FAILED_OTP);
      }

      await this.mailerService.sendVerificationEmail(
        user.email,
        USER_CONSTANTS.VERIFICATION_MAIL_SUBJECT,
        USER_CONSTANTS.VERIFICATION_MAIL_BODY.replace(
          'VERIFICATION_OTP',
          generatedOTP.otp,
        ).replace('USER_EMAIL', user.email),
      );

      return this.authService.createLoginResponse(user);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        USER_CONSTANTS.FAILED_USER_CREATE,
        {
          cause: error,
        },
      );
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    this.logger.log('Getting an user by email!');

    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException(USER_CONSTANTS.NO_USER_FOUND);
      }

      return user;
    } catch (error) {
      this.logger.error(USER_CONSTANTS.FAILED_GET_USER);
    }
  }

  async updateUser(user: User): Promise<User> {
    return await this.userModel.findOneAndUpdate({ email: user.email }, user);
  }

  async checkUserCredentials(email: string, password: string): Promise<User> {
    this.logger.log('Checking credentials of user: ', email);

    const user = await this.userModel.findOne({ email });

    if (!user) {
      this.logger.log('User not found!');
      throw new NotFoundException(USER_CONSTANTS.FAILED_GET_USER);
    }

    const passwordMatched = await this.passwordEncoder.comparePassword(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException(USER_CONSTANTS.WRONG_CREDENTIALS);
    }

    return user;
  }
}
