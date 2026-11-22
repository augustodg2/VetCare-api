// src/procedure/dto/create-procedure.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ProcedureType } from '../../generated/prisma/enums';

export class CreateProcedureDto {
  @ApiProperty({
    enum: ProcedureType,
    enumName: 'ProcedureType',
    example: ProcedureType.CONSULTATION,
    description: 'Tipo do procedimento',
  })
  @IsEnum(ProcedureType)
  type: ProcedureType;

  @ApiPropertyOptional({
    example: 'Paciente apresentou febre e perda de apetite.',
    description: 'Anotação principal do procedimento (texto longo)',
  })
  @IsNotEmpty()
  @IsString()
  notes: string;

  @ApiProperty({
    example: '2026-11-22T14:30:00.000Z',
    description: 'Data e hora do procedimento (ISO 8601)',
  })
  @IsDateString()
  dateTime: string;

  @ApiProperty({
    example: '3f2b8c1e-4a5d-4e8f-9b7a-1c2d3e4f5a6b',
    description: 'ID do pet',
  })
  @IsUUID()
  petId: string;

  @ApiProperty({
    example: '9a8b7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d',
    description: 'ID do veterinário responsável',
  })
  @IsUUID()
  vetId: string;
}
