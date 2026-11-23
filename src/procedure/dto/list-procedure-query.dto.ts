// dto/list-procedures-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProcedureType } from '../../generated/prisma/enums';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class ListProceduresQueryDto {
  @ApiPropertyOptional({
    enum: ProcedureType,
    enumName: 'ProcedureType',
    description: 'Filtra pelo tipo do procedimento',
  })
  @IsOptional()
  @IsEnum(ProcedureType)
  type?: ProcedureType;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Filtra pelo ID do pet',
  })
  @IsOptional()
  @IsUUID()
  petId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Filtra pelo ID do veterinário',
  })
  @IsOptional()
  @IsUUID()
  vetId?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-01-01T00:00:00.000Z',
    description: 'Data inicial (inclusive) do procedimento',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-11-30T23:59:59.999Z',
    description: 'Data final (inclusive) do procedimento',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
    default: 1,
    description: 'Número da página',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
}