import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { APIResponse } from 'src/common/dto/api-response.dto';
import { LoginResponse } from 'src/auth/interfaces/login-response.interface';
import { USER_CONSTANTS } from './constants/user.constants';

@Controller('users')
export class UsersController {
  private readonly logger: Logger;
  constructor(private userService: UsersService) {
    this.logger = new Logger(UsersController.name);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() request: CreateUserDto,
  ): Promise<APIResponse<LoginResponse>> {
    this.logger.log('Body: ', request);

    const user = await this.userService.create(request);

    return APIResponse.create<LoginResponse>({
      code: 201,
      message: USER_CONSTANTS.USER_CREATED,
      status: true,
      data: [user],
    });
  }
}
