// src/procedure/procedure.repository.ts
import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const procedureInclude = {
  pet: { select: { id: true, name: true, species: true } },
  vet: { select: { id: true, user: { select: { name: true } } } },
  extraNotes: {
    orderBy: { createdAt: 'asc' },
    include: { vet: { select: { id: true, user: { select: { name: true } } } },
  },
} satisfies Prisma.ProcedureInclude;
export type ProcedureWithNotes = Prisma.ProcedureGetPayload<{
  include: typeof procedureInclude;
}>;

@Injectable()
export class ProcedureRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ProcedureUncheckedCreateInput) {
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
}