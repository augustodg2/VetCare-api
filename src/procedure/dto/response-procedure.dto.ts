// src/procedure/dto/procedure-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProcedureType } from '../../generated/prisma/enums';
import { PetSummaryDto, VetSummaryDto } from './summarys.dto'; // ajuste para o caminho real
import { ExtraNoteDto, ExtraNoteResponseDto } from './extra-note.dto';

export class ProcedureResponseDto {
  @ApiProperty({ example: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d' })
  @Expose()
  id!: string;

  @ApiProperty({
    enum: ProcedureType,
    enumName: 'ProcedureType',
    example: ProcedureType.CONSULTATION,
  })
  @Expose()
  type!: ProcedureType;

  @ApiProperty({
    example: 'Paciente apresentou febre e perda de apetite.',
    type: String,
  })
  @Expose()
  notes!: string | null;

  @ApiProperty({ example: '2026-11-22T14:30:00.000Z' })
  @Expose()
  dateTime!: Date;

  @ApiProperty({ type: () => PetSummaryDto })
  @Expose()
  @Type(() => PetSummaryDto)
  pet!: PetSummaryDto;

  @ApiProperty({ type: () => VetSummaryDto })
  @Expose()
  @Type(() => VetSummaryDto)
  vet!: VetSummaryDto;

  @ApiPropertyOptional({ type: () => [ExtraNoteResponseDto] })
  @Expose()
  @Type(() => ExtraNoteResponseDto)
  extraNotes!: ExtraNoteResponseDto[];

  @ApiProperty({ example: '2026-11-22T14:31:02.000Z' })
  @Expose()
  createdAt!: Date;
}