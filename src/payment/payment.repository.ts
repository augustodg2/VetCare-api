// src/payment/payment.repository.ts
import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
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
}