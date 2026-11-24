// src/payment/payment.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaymentRepository, PaymentWithItems } from './payment.repository';
import { ListPaymentsQueryDto } from './dto/list-payment-query.dto';
import { ListPaymentsResponseDto } from './dto/list-payments-response.dto';
import { PaymentStatus } from '../generated/prisma/enums';

const PAGE_SIZE = 20

const toCents = (value: { toString(): string } | number): number =>
  Math.round(Number(value.toString()) * 100);

@Injectable()
export class PaymentService {
  constructor(private readonly repository: PaymentRepository) {}

  async create(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const procedureIds = dto.items.map((item) => item.procedureId);

    if (new Set(procedureIds).size !== procedureIds.length) {
      throw new BadRequestException(
        'Um mesmo procedimento não pode aparecer duas vezes no pagamento',
      );
    }

    const subtotalCents = dto.items.reduce(
      (sum, item) => sum + toCents(item.amount),
      0,
    );

    if (toCents(dto.discount? dto.discount : 0) > subtotalCents) {
      throw new BadRequestException(
        'O desconto não pode ser maior que a soma dos itens',
      );
    }

    const existingIds = await this.repository.findExistingProcedureIds(
      procedureIds,
    );
    const missingIds = procedureIds.filter((id) => !existingIds.includes(id));

    if (missingIds.length > 0) {
      throw new NotFoundException(
        `Procedimento(s) não encontrado(s): ${missingIds.join(', ')}`,
      );
    }

    const payment = await this.repository.create({
      paymentMethod: dto.paymentMethod,
      discount: dto.discount? dto.discount : 0,
      notes: dto.notes,
      items: dto.items,
    });

    return this.toResponse(payment);
  }

  private toResponse(payment: PaymentWithItems): PaymentResponseDto {
    const subtotalCents = payment.items.reduce(
      (sum, item) => sum + toCents(item.amount),
      0,
    );
    const discountCents = toCents(payment.discount);

    return plainToInstance(
      PaymentResponseDto,
      {
        ...payment,
        discount: discountCents / 100,
        subtotal: subtotalCents / 100,
        total: (subtotalCents - discountCents) / 100,
        items: payment.items.map((item) => ({
          ...item,
          amount: toCents(item.amount) / 100,
        })),
      },
      { excludeExtraneousValues: true },
    );
  }

  async list(query: ListPaymentsQueryDto): Promise<ListPaymentsResponseDto> {
  const { page, ...filters } = query;

  if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
    throw new BadRequestException('dateFrom não pode ser maior que dateTo');
  }

  const { items, total } = await this.repository.findMany({
    filters,
    page,
    limit: PAGE_SIZE,
  });

  return plainToInstance(ListPaymentsResponseDto, {
    data: items.map((payment) => this.toResponse(payment)),
    meta: {
      total,
      page,
      PAGE_SIZE
    }
  }, {excludeExtraneousValues: true})
  }

  cancel(id: string): Promise<PaymentResponseDto> {
    return this.changeStatusFromPaid(id, PaymentStatus.CANCELED, 'cancelar');
  }

  refund(id: string): Promise<PaymentResponseDto> {
    return this.changeStatusFromPaid(id, PaymentStatus.REFUNDED, 'estornar');
  }

  private async changeStatusFromPaid(
    id: string,
    newStatus: Exclude<PaymentStatus, 'PAID'>,
    action: string,
  ): Promise<PaymentResponseDto> {
    const payment = await this.repository.findById(id);

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    if (payment.status !== PaymentStatus.PAID) {
      throw new ConflictException(
        `Não é possível ${action} um pagamento com status ${payment.status}`,
      );
    }

    const updated = await this.repository.changeStatusIfPaid(id, newStatus);

    if (!updated) {
      throw new ConflictException(
        'O status do pagamento foi alterado. Tente novamente.',
      );
    }

    return this.toResponse(updated);
  }
}