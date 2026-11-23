// src/procedure/procedure.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { ProcedureRepository } from './procedure.repository';
import { plainToInstance } from 'class-transformer';
import { ProcedureResponseDto } from './dto/response-procedure.dto';
import { ListProceduresQueryDto } from './dto/list-procedure-query.dto';
import { ListProceduresResponseDto } from './dto/list-procedure-responser.dto';
import { ExtraNoteDto, ExtraNoteResponseDto } from './dto/extra-note.dto';

const PAGESIZE = 10
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


async list(
    query: ListProceduresQueryDto,
  ): Promise<ListProceduresResponseDto> {
    const { page, ...filters } = query;

    const { items, total } = await this.repository.findMany({
      filters,
      page,
      limit: PAGESIZE,
    });

    return plainToInstance(
      ListProceduresResponseDto,
      {
        data: items,
        meta: {
          total,
          page,
          PAGESIZE,
        },
      },
      { excludeExtraneousValues: true },
    );
  }

  async addExtraNote(
    procedureId: string,
    dto: ExtraNoteDto,
  ): Promise<ExtraNoteResponseDto> {
    const procedure = await this.repository.procedureExists(procedureId);

    if (!procedure) {
      throw new NotFoundException('Procedimento não encontrado');
    }

    const note = await this.repository.createExtraNote(
      procedureId,
      dto.content,
    );

    return plainToInstance(ExtraNoteResponseDto, note, {
      excludeExtraneousValues: true,
    });
  }
}