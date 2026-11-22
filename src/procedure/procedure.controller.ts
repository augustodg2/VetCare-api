// src/procedure/procedure.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProcedureService } from './procedure.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';

@ApiTags('Procedures')
@ApiBearerAuth()
@Controller('procedures')
export class ProcedureController {
  constructor(private readonly procedureService: ProcedureService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um procedimento',
    description:
      'Registra um novo procedimento (consulta, vacina ou exame) para um pet, vinculado a um veterinário.',
  })
  @ApiCreatedResponse({
    description: 'Procedimento criado com sucesso',
    schema: {
      example: {
        id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        type: 'CONSULTATION',
        notes: 'Paciente apresentou febre e perda de apetite.',
        dateTime: '2026-11-22T14:30:00.000Z',
        petId: '3f2b8c1e-4a5d-4e8f-9b7a-1c2d3e4f5a6b',
        vetId: '9a8b7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d',
        createdAt: '2026-11-22T14:31:02.000Z',
        extraNotes: [],
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos no corpo da requisição' })
  @ApiNotFoundResponse({ description: 'Pet ou veterinário não encontrado' })
  create(@Body() dto: CreateProcedureDto) {
    return this.procedureService.create(dto);
  }
}
