import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

create(data: Prisma.AppointmentCreateInput) {
  return this.prisma.appointment.create({
    data,
    select: {
      id: true,
      dateTime: true,
      createdAt: true,
      obs: true,
      status: true,
      pet: { select: { id: true, name: true, species: true } },
      vet: { select: { id: true, user: { select: { name: true } } } },
    },
  });
}

  // Verifica se o vet já tem consulta ativa nesse horário
  findActiveByVetAndDateTime(vetId: string, dateTime: Date) {
    return this.prisma.appointment.findFirst({
      where: { vetId, dateTime, status: 'ACTIVE' },
    });
  }
}