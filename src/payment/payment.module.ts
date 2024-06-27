import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { AccountEntity } from 'src/account/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, AccountEntity])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
