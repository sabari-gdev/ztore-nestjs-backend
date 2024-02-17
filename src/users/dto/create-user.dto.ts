import { IsEmail, IsOptional, IsString } from 'class-validator';
import { USER_CONSTANTS } from '../constants/user.constants';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsString({ message: USER_CONSTANTS.FIRST_NAME_STRING })
  firstName: string;

  @IsOptional()
  @IsString({ message: USER_CONSTANTS.LAST_NAME_STRING })
  lastName: string;

  @IsEmail({}, { message: USER_CONSTANTS.VALID_EMAIL })
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString({ message: USER_CONSTANTS.LAST_NAME_STRING })
  mobileNumber: string;

  @IsOptional()
  @IsString()
  role: Role;
}
