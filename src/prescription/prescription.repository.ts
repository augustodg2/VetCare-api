import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const prescriptionInclude = {
  pet: {
    select: {
      id: true,
      name: true,
      species: true,
    },
  },
  vet: {
    select: {
      id: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  },
} satisfies Prisma.PrescriptionInclude;

export type PrescriptionWithRelations = Prisma.PrescriptionGetPayload<{
  include: typeof prescriptionInclude;
}>;

export interface FindManyPrescriptionsParams {
  vetId?: string;
  petId?: string;
  skip: number;
  take: number;
}

@Injectable()
export class PrescriptionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: Prisma.PrescriptionUncheckedCreateInput,
  ): Promise<PrescriptionWithRelations> {
    return this.prisma.prescription.create({
      data,
      include: prescriptionInclude,
    });
  }

  findById(id: string): Promise<PrescriptionWithRelations | null> {
    return this.prisma.prescription.findUnique({
      where: { id },
      include: prescriptionInclude,
    });
  }

  async findAndCount({ vetId, petId, skip, take }: FindManyPrescriptionsParams) {
    const where: Prisma.PrescriptionWhereInput = {
      ...(vetId && { vetId }),
      ...(petId && { petId }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.prescription.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: prescriptionInclude,
      }),
      this.prisma.prescription.count({ where }),
    ]);

    return { items, total };
  }
}