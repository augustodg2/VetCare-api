import { Module } from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import { ProcedureController } from './procedure.controller';
import { ProcedureRepository } from './procedure.repository';
import { VetsRepository } from '../vets/vets.repository';
import { PetRepository } from '../pet/pet.repository';

@Module({
  controllers: [ProcedureController],
  providers: [ProcedureService, ProcedureRepository, VetsRepository, PetRepository],
})
export class ProcedureModule {}
