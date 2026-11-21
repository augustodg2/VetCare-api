import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ResponseAppointmentDto } from './dto/response-appointment.dto';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { ListAppointmentsQueryDto } from './dto/list-appointment-query.dto';
import { ListPendingAppointmentsQueryDto } from './dto/list-pending-appointments-query.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('Appointments')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
@ApiForbiddenResponse({ description: 'Sem permissão para esta ação' })
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  //create appointment
  @ApiOperation({ summary: 'Agendar consulta' })
  @ApiCreatedResponse({ description: 'Consulta criada com sucesso', type: ResponseAppointmentDto })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou data no passado' })
  @ApiNotFoundResponse({ description: 'Pet ou veterinário não encontrado' })
  @ApiConflictResponse({ description: 'Veterinário já possui consulta nesse horário' })
  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  //Listar appointment
  @ApiOperation({
  summary: 'Listar consultas por intervalo de data e hora',
  description:
    'Retorna as consultas entre `from` (inclusivo) e `to` (exclusivo), com filtros opcionais de veterinário e status.',
  })
  @ApiOkResponse({
    description: 'Consultas retornadas com sucesso',
    type: [ResponseAppointmentDto],
  })
  @ApiBadRequestResponse({ description: 'Intervalo inválido' })
  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get()
  list(@Query() query: ListAppointmentsQueryDto) {
    return this.appointmentService.list(query);
  }


  //Listar pending appointment
  @ApiOperation({
  summary: 'Listar consultas pendentes de atualização',
  description:
    'Retorna consultas com status ACTIVE cujo horário já passou há mais de 2 horas, ou seja, que deveriam ter sido concluídas ou canceladas.',
  })
  @ApiOkResponse({
    description: 'Consultas pendentes retornadas com sucesso',
    type: [ResponseAppointmentDto],
  })
  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('pending')
  listPending(@Query() query: ListPendingAppointmentsQueryDto) {
    return this.appointmentService.listPending(query);
  }

  //Atualizar
  @ApiOperation({
  summary: 'Atualizar consulta',
  description:
    'Atualiza tipo, observações e/ou data e hora de uma consulta ativa. Apenas os campos enviados são alterados.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da consulta',
    example: '3f2b8c1e-9a4d-4c7e-8f21-5b6a7d9e0c12',
  })
  @ApiOkResponse({ description: 'Consulta atualizada com sucesso', type: ResponseAppointmentDto })
  @ApiBadRequestResponse({ description: 'Dados inválidos, consulta não ativa ou data no passado' })
  @ApiNotFoundResponse({ description: 'Consulta não encontrada' })
  @ApiConflictResponse({ description: 'Veterinário já possui consulta nesse horário' })
  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    console.log('ok')
    return this.appointmentService.update(id, dto);
  }

  @Get('all')
  getAll(){
    return this.appointmentService.getAll()
  }
}