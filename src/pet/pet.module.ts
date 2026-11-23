import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { PetRepository } from './pet.repository';
import { AppointmentRepository } from '../appointment/appointment.repository';

@Module({
  controllers: [PetController],
  providers: [PetService, PetRepository, AppointmentRepository],
  exports: [PetRepository]
})
export class PetModule {}
