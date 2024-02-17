import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
