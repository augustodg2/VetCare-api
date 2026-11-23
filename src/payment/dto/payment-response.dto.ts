// src/payment/dto/payment-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProcedureType } from '../../generated/prisma/enums';

export class PaymentProcedureSummaryDto {
  @ApiProperty({ example: '45986740-79af-4dd6-97e0-4d6a4828b919' })
  @Expose()
  id!: string;

  @ApiProperty({
    enum: ProcedureType,
    enumName: 'ProcedureType',
    example: ProcedureType.CONSULTATION,
  })
  @Expose()
  type!: ProcedureType;

  @ApiProperty({ example: '2026-11-23T16:00:00.000Z' })
  @Expose()
  dateTime!: Date;
}

export class ItemPaymentResponseDto {
  @ApiProperty({ example: '8c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 150.0 })
  @Expose()
  amount!: number;

  @ApiProperty({
    example: 'Consulta de retorno',
    type: String,
    nullable: true,
  })
  @Expose()
  description!: string | null;

  @ApiProperty({ type: () => PaymentProcedureSummaryDto })
  @Expose()
  @Type(() => PaymentProcedureSummaryDto)
  procedure!: PaymentProcedureSummaryDto;
}

export class PaymentResponseDto {
  @ApiProperty({ example: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'PIX' })
  @Expose()
  paymentMethod!: string;

  @ApiProperty({
    example: 200.0,
    description: 'Soma dos valores dos itens, antes do desconto',
  })
  @Expose()
  subtotal!: number;

  @ApiProperty({ example: 10.0 })
  @Expose()
  discount!: number;

  @ApiProperty({
    example: 190.0,
    description: 'Total pago: soma dos itens menos o desconto',
  })
  @Expose()
  total!: number;

  @ApiProperty({
    example: 'Pago em dinheiro, sem troco.',
    type: String,
    nullable: true,
  })
  @Expose()
  notes!: string | null;

  @ApiProperty({ type: () => [ItemPaymentResponseDto] })
  @Expose()
  @Type(() => ItemPaymentResponseDto)
  items!: ItemPaymentResponseDto[];

  @ApiProperty({ example: '2026-11-23T14:31:02.000Z' })
  @Expose()
  createdAt!: Date;
}