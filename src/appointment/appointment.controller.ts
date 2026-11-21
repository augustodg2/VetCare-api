import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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

@ApiTags('Appointments')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
@ApiForbiddenResponse({ description: 'Sem permissão para esta ação' })
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

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

  @Get('all')
  getAll(){
    return this.appointmentService.getAll()
  }
}