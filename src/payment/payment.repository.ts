// src/payment/payment.repository.ts
import { Injectable } from '@nestjs/common';
import { PaymentStatus, Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const paymentInclude = {
  items: {
    include: {
      procedure: { select: { id: true, type: true, dateTime: true } },
    },
  },
} satisfies Prisma.PaymentInclude;

export type PaymentWithItems = Prisma.PaymentGetPayload<{
  include: typeof paymentInclude;
}>;

export interface CreatePaymentData {
  paymentMethod: string;
  discount: number;
  notes?: string;
  items: { procedureId: string; amount: number; description?: string }[];
}

export interface FindPaymentsFilters {
  status?: PaymentStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface FindPaymentsParams {
  filters: FindPaymentsFilters;
  page: number;
  limit: number;
}

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findExistingProcedureIds(ids: string[]): Promise<string[]> {
    const procedures = await this.prisma.procedure.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    return procedures.map((p) => p.id);
  }

  create(data: CreatePaymentData): Promise<PaymentWithItems> {
    return this.prisma.payment.create({
      data: {
        paymentMethod: data.paymentMethod,
        discount: data.discount,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            amount: item.amount,
            description: item.description,
            procedure: { connect: { id: item.procedureId } },
          })),
        },
      },
      include: paymentInclude,
    });
  }

  async findMany({ filters, page, limit }: FindPaymentsParams) {
  const where = this.buildWhere(filters);

  const [items, total] = await this.prisma.$transaction([
    this.prisma.payment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: paymentInclude,
    }),
    this.prisma.payment.count({ where }),
  ]);

  return { items, total };
}

  private buildWhere(filters: FindPaymentsFilters): Prisma.PaymentWhereInput {
    const { status, dateFrom, dateTo } = filters;

    return {
      ...(status && { status }),
      ...((dateFrom || dateTo) && {
        createdAt: {
          ...(dateFrom && { gte: dateFrom }),
          ...(dateTo && { lte: dateTo }),
        },
      }),
    };
  }

  findById(id: string): Promise<PaymentWithItems | null> {
    return this.prisma.payment.findUnique({
      where: { id },
      include: paymentInclude,
    });
  }

  async changeStatusIfPaid(
    id: string,
    newStatus: Exclude<PaymentStatus, 'PAID'>,
  ): Promise<PaymentWithItems | null> {
    const { count } = await this.prisma.payment.updateMany({
      where: { id, status: PaymentStatus.PAID },
      data: { status: newStatus },
    });

    if (count === 0) return null;

    return this.findById(id);
  }


  

}