// src/payment/dto/list-payments-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { PaymentResponseDto } from './payment-response.dto';

export class ListPaymentsResponseDto {
  @ApiProperty({ type: () => [PaymentResponseDto] })
  @Expose()
  @Type(() => PaymentResponseDto)
  data!: PaymentResponseDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  @Expose()
  @Type(() => PaginationMetaDto)
  meta!: PaginationMetaDto;
}