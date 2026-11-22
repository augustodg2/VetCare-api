// src/procedure/procedure.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { ProcedureRepository } from './procedure.repository';

@Injectable()
export class ProcedureService {
  constructor(private readonly repository: ProcedureRepository) {}

  async create(dto: CreateProcedureDto) {
    const [petExists, vetExists] = await Promise.all([
      this.repository.petExists(dto.petId),
      this.repository.vetExists(dto.vetId),
    ]);

    if (!petExists) throw new NotFoundException('Pet não encontrado');
    if (!vetExists) throw new NotFoundException('Veterinário não encontrado');

    const procedure = this.repository.create({
      type: dto.type,
      notes: dto.notes,
      dateTime: new Date(dto.dateTime),
      petId: dto.petId,
      vetId: dto.vetId,
    });

    return 
  }
}