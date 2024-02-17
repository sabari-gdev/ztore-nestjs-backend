import { IsNotEmpty, IsEmail } from 'class-validator';
import { USER_CONSTANTS } from 'src/users/constants/user.constants';

export class EmailLoginRequest {
  @IsNotEmpty({ message: USER_CONSTANTS.EMAIL_IS_REQUIRED })
  @IsEmail({}, { message: USER_CONSTANTS.VALID_EMAIL })
  email!: string;

  @IsNotEmpty({ message: USER_CONSTANTS.PASSWORD_REQUIRED })
  password!: string;
}
