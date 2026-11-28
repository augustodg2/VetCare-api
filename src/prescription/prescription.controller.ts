// src/prescription/prescription.controller.ts
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PrescriptionsService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { ListPrescriptionsQueryDto } from './dto/list-prescriptions-query.dto';
import {
  PaginatedPrescriptionsResponseDto,
  PrescriptionResponseDto,
} from './dto/prescription-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { StatusGuard } from '../auth/guards/status.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { AllowedStatus } from '../auth/decorator/status.decorator';

const CREATE_PRESCRIPTION_EXAMPLE = {
  id: '770e8400-e29b-41d4-a716-446655440002',
  title: 'Tratamento Dermatite',
  content: 'Amoxicilina 500mg - 1 comprimido a cada 12h por 7 dias.',
  vetId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  petId: '3f2b8c1e-9a4d-4c7e-8f21-5b6a7d9e0c12',
  vet: {
    id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    name: 'Dra. Ana Souza',
  },
  pet: {
    id: '3f2b8c1e-9a4d-4c7e-8f21-5b6a7d9e0c12',
    name: 'Rex',
    species: 'Cachorro',
  },
  createdAt: '2026-11-26T21:14:00.000Z',
  updatedAt: '2026-11-26T21:14:00.000Z',
};

@UseGuards(AuthGuard('jwt'), RolesGuard, StatusGuard)
@Roles('ADMIN', 'VET')
@AllowedStatus('ACTIVE')
@ApiTags('Prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria uma prescrição',
    description:
      'Registra uma nova prescrição para um pet, vinculada a um veterinário.',
  })
  @ApiCreatedResponse({
    description: 'Prescrição criada com sucesso',
    content: {
      'application/json': {
        example: CREATE_PRESCRIPTION_EXAMPLE,
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos no corpo da requisição' })
  @ApiNotFoundResponse({ description: 'Pet ou veterinário não encontrado' })
  create(@Body() dto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista prescrições',
    description:
      'Retorna as prescrições paginadas, ordenadas da mais recente para a mais antiga (`createdAt` desc). Os filtros `vetId` e `petId` são opcionais e combináveis.',
  })
  @ApiOkResponse({
    description: 'Lista paginada de prescrições',
    type: PaginatedPrescriptionsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros de query inválidos',
  })
  list(@Query() query: ListPrescriptionsQueryDto) {
    return this.prescriptionsService.list(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Busca uma prescrição pelo ID',
    description:
      'Retorna a prescrição com o resumo do pet e o resumo do veterinário.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'ID da prescrição',
    example: '770e8400-e29b-41d4-a716-446655440002',
  })
  @ApiOkResponse({
    description: 'Prescrição encontrada',
    type: PrescriptionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'ID inválido (não é um UUID)' })
  @ApiNotFoundResponse({ description: 'Prescrição não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PrescriptionResponseDto> {
    return this.prescriptionsService.getById(id);
  }
}