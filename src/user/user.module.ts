import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AccountModule } from 'src/account/account.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AccountModule],
})
export class UserModule {}
