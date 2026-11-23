import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AppointmentRepository } from './appointment.repository';
import { PetRepository } from '../pet/pet.repository';
import { VetsRepository } from '../vets/vets.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ResponseAppointmentDto } from './dto/response-appointment.dto';
import { ListAppointmentsQueryDto } from './dto/list-appointment-query.dto';
import { ListPendingAppointmentsQueryDto } from './dto/list-pending-appointments-query.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentMinAggregateOutputType } from '../generated/prisma/models';
import { AuthenticatedUser } from '../auth/decorator/current-user.decorator';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly petsRepository: PetRepository,
    private readonly vetsRepository: VetsRepository,
  ) {}

  async create(input: CreateAppointmentDto, user?: AuthenticatedUser) {
    let resolvedVetId = input.vetId;
    if (user?.role === 'VET') {
      const ownVet = await this.vetsRepository.getByUserId(user.id);
      if (!ownVet) {
        throw new ForbiddenException('Cadastro de veterinário não encontrado para este usuário');
      }
      resolvedVetId = ownVet.id;
    }
    if (!resolvedVetId) {
      throw new BadRequestException('O veterinário deve ser informado');
    }
    const data = { ...input, vetId: resolvedVetId };

    if (data.dateTime.getTime() <= Date.now()) {
      throw new BadRequestException('A data da consulta deve ser futura');
    }

    const pet = await this.petsRepository.findById(data.petId);
    if (!pet || pet.deletedAt) {
      throw new NotFoundException('Pet não encontrado');
    }

    const vet = await this.vetsRepository.getById(data.vetId);
    if (!vet || vet.deletedAt) {
      throw new NotFoundException('Veterinário não encontrado');
    }

    const conflict = await this.appointmentRepository.findActiveByVetAndDateTime(
      data.vetId,
      data.dateTime,
    );
    if (conflict) {
      throw new ConflictException('O veterinário já possui uma consulta nesse horário');
    }

    const { petId, vetId, ...appointmentData } = data;
    const appointment = await this.appointmentRepository.create({
      ...appointmentData,
      pet: { connect: { id: petId } },
      vet: { connect: { id: vetId } },
    });

    return plainToInstance(
      ResponseAppointmentDto,
      {
        ...appointment,
        vet: {
          id: appointment.vet.id,
          name: appointment.vet.user.name, // acessa o name do usuário
        },
      },
      { excludeExtraneousValues: true },
    );
  }

  async list(query: ListAppointmentsQueryDto, user?: AuthenticatedUser) {
    if (user?.role === 'VET') {
      const vet = await this.vetsRepository.getByUserId(user.id);
      if (!vet) {
        throw new ForbiddenException('Cadastro de veterinário não encontrado para este usuário');
      }
      query.vetId = vet.id;
    }

    if (query.from >= query.to) {
      throw new BadRequestException('A data inicial deve ser anterior à data final');
    }

    const maxRangeMs = 31 * 24 * 60 * 60 * 1000; // 31 dias
    if (query.to.getTime() - query.from.getTime() > maxRangeMs) {
      throw new BadRequestException('O intervalo máximo permitido é de 31 dias');
    }

    const [items, total] = await this.appointmentRepository.findByRange({
      from: query.from,
      to: query.to,
      vetId: query.vetId,
      status: query.status,
      type: query.type
    });

    return {
      data: items.map((appointment) => plainToInstance(ResponseAppointmentDto,{
        ...appointment,
        vet: {
          id: appointment.vet.id,
          name: appointment.vet.user.name, // acessa o name do usuário
        },
      }, {
      excludeExtraneousValues: true})),
      total,
    };
  }

private readonly PENDING_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 horas

  async listPending(query: ListPendingAppointmentsQueryDto) {
    const take = 20;
    const skip = (query.page - 1) * take;
    const olderThan = new Date(Date.now() - this.PENDING_THRESHOLD_MS);

    const [items, total] = await this.appointmentRepository.findPending({
      olderThan,
      vetId: query.vetId,
      skip,
      take,
    });

    return {
      data: items.map((appointment) => plainToInstance(ResponseAppointmentDto,{
        ...appointment,
        vet: {
          id: appointment.vet.id,
          name: appointment.vet.user.name,
        },
      }, {
      excludeExtraneousValues: true})),
      total,
      pageSize: take,
    };
 }


  private async assertCanManage(appointment: { vetId: string }, user?: AuthenticatedUser) {
    if (user?.role !== 'VET') return;
    const ownVet = await this.vetsRepository.getByUserId(user.id);
    if (!ownVet || ownVet.id !== appointment.vetId) {
      throw new ForbiddenException('Você só pode alterar as suas próprias consultas');
    }
  }

  async update(id: string, data: UpdateAppointmentDto, user?: AuthenticatedUser) {
    if (data.dateTime === undefined && data.type === undefined && data.obs === undefined) {
      throw new BadRequestException('Informe ao menos um campo para atualizar');
    }

    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }
    await this.assertCanManage(appointment, user);

    if (appointment.status !== 'ACTIVE') {
      throw new BadRequestException('Apenas consultas ativas podem ser alteradas');
    }

    if (data.dateTime !== undefined) {
      if (data.dateTime.getTime() <= Date.now()) {
        throw new BadRequestException('A data da consulta deve ser futura');
      }

      const conflict = await this.appointmentRepository.findActiveByVetAndDateTime(
        appointment.vetId,
        data.dateTime,
      );
      if (conflict && conflict.id !== appointment.id) {
        throw new ConflictException('O veterinário já possui uma consulta nesse horário');
      }
    }

    const updated = await this.appointmentRepository.update(id, {
      ...(data.dateTime !== undefined && { dateTime: data.dateTime }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.obs !== undefined && { obs: data.obs }),
    });

    return plainToInstance(ResponseAppointmentDto,{
        ...updated,
        vet: {
          id: updated.vet.id,
          name: updated.vet.user.name,
        } 
    })
  }

  async cancel(id: string, user?: AuthenticatedUser) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }
    await this.assertCanManage(appointment, user);

    if (appointment.status === 'CANCELLED') {
      throw new BadRequestException('A consulta já está cancelada');
    }

    if (appointment.status === 'DONE') {
      throw new BadRequestException('Uma consulta concluída não pode ser cancelada');
    }

    const cancelled = await this.appointmentRepository.updateStatus(id, "CANCELLED");

    return plainToInstance(ResponseAppointmentDto,{
        ...cancelled,
        vet: {
          id: cancelled.vet.id,
          name: cancelled.vet.user.name,
        } 
    })
  }

  async complete(id: string) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }

    if (appointment.status === 'DONE') {
      throw new BadRequestException('A consulta já está concluída');
    }

    if (appointment.status === 'CANCELLED') {
      throw new BadRequestException('Uma consulta cancelada não pode ser concluída');
    }

    if (appointment.dateTime.getTime() > Date.now()) {
      throw new BadRequestException('Não é possível concluir uma consulta que ainda não começou');
    }

    const completed = await this.appointmentRepository.updateStatus(id, 'DONE');

    return plainToInstance(ResponseAppointmentDto,{
        ...completed,
        vet: {
          id: completed.vet.id,
          name: completed.vet.user.name,
        } 
    })
  }
  async getAll() {
    return await this.appointmentRepository.findAll();
  }
}