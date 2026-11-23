import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './payment.repository';
import { Procedure } from '../procedure/entities/procedure.entity';
import { ProcedureRepository } from '../procedure/procedure.repository';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository, ProcedureRepository],
})
export class PaymentModule {}
