// src/procedure/procedure.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { ProcedureRepository } from './procedure.repository';
import { plainToInstance } from 'class-transformer';
import { ProcedureResponseDto } from './dto/response-procedure.dto';

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


    const {petId, vetId, ...rest } = dto;

    const procedure = await this.repository.create({
      ...rest,
      pet: { connect: { id: petId } },
      vet: { connect: { id: vetId } },
    });

    return plainToInstance(ProcedureResponseDto,
             {
        ...procedure,
        vet: {
          id: procedure.vet.id,
          name: procedure.vet.user.name, // acessa o name do usuário
        },
      }, 
       {excludeExtraneousValues:true})
  }
}