import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProcedureType } from '../../generated/prisma/enums';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Data e hora da consulta (ISO 8601)',
    example: '2026-12-01T14:30:00.000Z',
  })
  @Type(() => Date)
  @IsDate({ message: 'A data e hora devem ser válidas' })
  dateTime: Date;

  @ApiProperty({
    description: 'Tipo da consulta',
    enum: ProcedureType,
    enumName: 'ProcedureType',
    example: ProcedureType.CONSULTATION,
  })
  @IsEnum(ProcedureType, {
    message: `O tipo deve ser um dos valores: ${Object.values(ProcedureType).join(', ')}`,
  })
  type: ProcedureType;

  @ApiPropertyOptional({
    description: 'Observações sobre a consulta',
    example: 'Retorno de vacina',
  })
  @IsOptional()
  @IsString({ message: 'A observação deve ser um texto' })
  @MaxLength(500, { message: 'A observação deve ter no máximo 500 caracteres' })
  obs?: string;

  @ApiProperty({
    description: 'ID do pet',
    example: '3f2b8c1e-9a4d-4c7e-8f21-5b6a7d9e0c12',
  })
  @IsString({ message: 'O pet deve ser válido' })
  @IsNotEmpty({ message: 'O pet não pode estar vazio' })
  petId: string;

  @ApiProperty({
    description: 'ID do veterinário',
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  })
  @IsString({ message: 'O veterinário deve ser válido' })
  @IsNotEmpty({ message: 'O veterinário não pode estar vazio' })
  vetId: string;
}