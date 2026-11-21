import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AppointmentRepository } from './appointment.repository';
import { PetRepository } from '../pet/pet.repository';
import { VetsRepository } from '../vets/vets.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ResponseAppointmentDto } from './dto/response-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly petsRepository: PetRepository,
    private readonly vetsRepository: VetsRepository,
  ) {}

  async create(data: CreateAppointmentDto) {
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
}