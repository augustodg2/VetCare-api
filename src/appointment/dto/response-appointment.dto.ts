import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AppointmentPetSummaryDto, AppointmentVetSummaryDto } from './summarys.dto';
import { ProcedureType } from '../../generated/prisma/enums';

export class ResponseAppointmentDto {
  @ApiProperty({ description: 'ID da consulta' })
  @Expose()
  id!: string;

  @ApiProperty({
    description: 'Data e hora da consulta',
    example: '2026-12-01T14:30:00.000Z',
  })
  @Expose()
  dateTime!: Date;

  @ApiProperty({ description: 'Data de criação do registro' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({
    description: 'Observações da consulta',
    nullable: true,
    type: String,
    example: 'Retorno de vacina',
  })
  @Expose()
  obs!: string | null;

  @ApiProperty({
    description: 'Status da consulta',
    enum: ['ACTIVE', 'CANCELLED', 'DONE'],
    example: 'ACTIVE',
  })
  @Expose()
  status!: string;

  @ApiProperty({
    description: 'Tipo da consulta',
    enum: ProcedureType,
    enumName: 'AppointmentType',
  })
  @Expose()
  type!: ProcedureType;

  @ApiProperty({ type: () => AppointmentPetSummaryDto })
  @Expose()
  @Type(() => AppointmentPetSummaryDto)
  pet!: AppointmentPetSummaryDto;

  @ApiProperty({ type: () => AppointmentVetSummaryDto })
  @Expose()
  @Type(() => AppointmentVetSummaryDto)
  vet!: AppointmentVetSummaryDto;
}