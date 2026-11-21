import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { AppointmentRepository } from './appointment.repository';
import { PetRepository } from '../pet/pet.repository';
import { VetsRepository } from '../vets/vets.repository';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentRepository, PetRepository, VetsRepository],
})
export class AppointmentModule {}
