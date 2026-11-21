import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus, Prisma, ProcedureType } from '../generated/prisma/client';

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

  findByRange(params: {
  from?: Date;
  to?: Date;
  vetId?: string;
  status?: AppointmentStatus;
  type?: ProcedureType
}) {
  const where: Prisma.AppointmentWhereInput = {
    dateTime: { gte: params.from, lt: params.to },
    ...(params.vetId && { vetId: params.vetId }),
    ...(params.status && { status: params.status }),
    ...(params.type && { type: params.type})
  };

  return this.prisma.$transaction([
    this.prisma.appointment.findMany({
      where,
      orderBy: { dateTime: 'asc' },
      select: {
        id: true,
        dateTime: true,
        createdAt: true,
        obs: true,
        status: true,
        type: true,
        pet: { select: { id: true, name: true, species: true } },
        vet: { select: { id: true, user: { select: { name: true } } } },
      },
    }),
    this.prisma.appointment.count({ where }),
  ]);
}

  findAll(){
    return this.prisma.appointment.findMany();
  }
}