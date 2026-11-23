// src/procedure/procedure.repository.ts
import { Injectable } from '@nestjs/common';
import { Prisma, ProcedureType } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const procedureInclude = {
  pet: { select: { id: true, name: true, species: true } },
  vet: { select: { id: true, user: { select: { name: true } } } },
  extraNotes: {
    orderBy: { createdAt: 'asc' }
  },
}satisfies Prisma.ProcedureInclude;
export type ProcedureWithNotes = Prisma.ProcedureGetPayload<{
  include: typeof procedureInclude;
}>;

export interface FindProceduresFilters {
  type?: ProcedureType;
  petId?: string;
  vetId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface FindProceduresParams {
  filters: FindProceduresFilters;
  page: number;
  limit: number;
}

@Injectable()
export class ProcedureRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ProcedureCreateInput) {
    return this.prisma.procedure.create({
      data,
      include: procedureInclude,
    });
  }

  async petExists(petId: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      select: { id: true },
    });
    return pet;
  }

  async vetExists(vetId: string) {
    const vet = await this.prisma.vet.findUnique({
      where: { id: vetId },
      select: { id: true },
    });
    return vet;
  }

async findMany({ filters, page, limit }: FindProceduresParams) {
  const where = this.buildWhere(filters);

  const [items, total] = await this.prisma.$transaction([
    this.prisma.procedure.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { dateTime: 'desc' },
      include: procedureInclude,
    }),
    this.prisma.procedure.count({ where }),
  ]);

  return { items, total };
}

  private buildWhere(filters: FindProceduresFilters): Prisma.ProcedureWhereInput {
    const { type, petId, vetId, dateFrom, dateTo } = filters;

    return {
      ...(type && { type }),
      ...(petId && { petId }),
      ...(vetId && { vetId }),
      ...((dateFrom || dateTo) && {
        dateTime: {
          ...(dateFrom && { gte: dateFrom }),
          ...(dateTo && { lte: dateTo }),
        },
      }),
    };
  }

  async procedureExists(procedureId: string) {
  return this.prisma.procedure.findUnique({
    where: { id: procedureId }
  });
}

  async addExtraNote(procedureId: string, content: string) {
    return await this.prisma.procedure.update({
      where: { id: procedureId },
      data: {
        extraNotes: { create: { content } },
      },
      include: procedureInclude,
    });
  }
}