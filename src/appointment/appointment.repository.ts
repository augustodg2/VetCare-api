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

  findActiveByVetAndDateTime(vetId: string, dateTime: Date) {
    return this.prisma.appointment.findFirst({
      where: { vetId, dateTime, status: 'ACTIVE' },
    });
  }

  findById(id: string) {
    return this.prisma.appointment.findUnique({ where: { id } });
    }

  findByRange(params: {
  from?: Date;
  to?: Date;
  vetId?: string;
  petId?: string;
  status?: AppointmentStatus;
  type?: ProcedureType;
  order?: 'asc' | 'desc';
  skip?: number;
  take?: number;
  }) {
  const where: Prisma.AppointmentWhereInput = {
    dateTime: { gte: params.from, lt: params.to },
    ...(params.vetId && { vetId: params.vetId }),
    ...(params.petId && { petId: params.petId }),
    ...(params.status && { status: params.status }),
    ...(params.type && { type: params.type})
  };

    return this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        orderBy: { dateTime: params.order ?? 'asc' },
        skip: params.skip,
        take: params.take,
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

  findPending(params: {
  olderThan: Date;
  vetId?: string;
  skip: number;
  take: number;
}) {
  const where: Prisma.AppointmentWhereInput = {
    status: 'ACTIVE',
    dateTime: { lte: params.olderThan },
    ...(params.vetId && { vetId: params.vetId }),
  };

    return this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        orderBy: { dateTime: 'asc' }, // as mais antigas primeiro
        skip: params.skip,
        take: params.take,
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

  update(id: string, data: Prisma.AppointmentUpdateInput) {
    return this.prisma.appointment.update({
      where: { id },
      data,
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
    });
  }
  updateStatus(id: string, status: AppointmentStatus) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: status },
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
    });
  }

  findAll(){
    return this.prisma.appointment.findMany();
  }
}