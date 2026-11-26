import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';
import { PrescriptionsRepository } from './prescription.repository';
import { VetsRepository } from '../vets/vets.repository';

@Module({
  controllers: [PrescriptionController],
  providers: [PrescriptionsService, PrescriptionsRepository],
})
export class PrescriptionModule {}
