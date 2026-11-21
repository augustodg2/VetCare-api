import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ResponseAppointmentDto } from './dto/response-appointment.dto';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorator/role.decorator';

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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }
}