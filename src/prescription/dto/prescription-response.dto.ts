// prescriptions/dto/prescription-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { PetSummaryDto } from '../../common/dto/pet-summary.dto';
import { VetSummaryDto } from '../../common/dto/vet-summary.dto';

export class PrescriptionResponseDto {
  @ApiProperty({ example: '770e8400-e29b-41d4-a716-446655440002' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Amoxicilina 500mg - 1 comprimido a cada 12h por 7 dias.' })
  @Expose()
  content!: string;

  @ApiPropertyOptional({ type: VetSummaryDto })
  @Expose()
  @Type(() => VetSummaryDto)
  vet?: VetSummaryDto;

  @ApiPropertyOptional({ type: PetSummaryDto })
  @Expose()
  @Type(() => PetSummaryDto)
  pet?: PetSummaryDto;

  @ApiProperty({ example: '2026-11-26T21:14:00.000Z' })
  @Expose()
  createdAt!: Date;
}

export class PaginatedPrescriptionsResponseDto {
  @ApiProperty({ type: [PrescriptionResponseDto] })
  @Expose()
  @Type(() => PrescriptionResponseDto)
  data!: PrescriptionResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  @Expose()
  @Type(() => PaginationMetaDto)
  meta!: PaginationMetaDto;
}