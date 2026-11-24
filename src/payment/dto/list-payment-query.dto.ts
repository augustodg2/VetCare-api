// src/payment/dto/list-payments-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PaymentStatus } from '../../generated/prisma/enums';

export class ListPaymentsQueryDto {
  @ApiPropertyOptional({
    enum: PaymentStatus,
    enumName: 'PaymentStatus',
    description: 'Filtra pelo status do pagamento',
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-11-01T00:00:00.000Z',
    description: 'Data de criação inicial (inclusive)',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-11-30T23:59:59.999Z',
    description: 'Data de criação final (inclusive)',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
    default: 1,
    description: 'Número da página (o tamanho da página é fixo no servidor)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
}