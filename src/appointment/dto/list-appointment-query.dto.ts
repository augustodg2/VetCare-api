import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { AppointmentStatus, ProcedureType } from '../../generated/prisma/enums';

export class ListAppointmentsQueryDto {
  @ApiProperty({
    description: 'Início do intervalo (ISO 8601, inclusivo)',
    example: '2026-12-01T00:00:00-03:00',
  })
  @Type(() => Date)
  @IsDate({ message: 'A data inicial deve ser uma data e hora válidas' })
  @IsNotEmpty()
  from: Date;

  @ApiProperty({
    description: 'Fim do intervalo (ISO 8601, exclusivo)',
    example: '2026-12-02T00:00:00-03:00',
  })
  @Type(() => Date)
  @IsDate({ message: 'A data final deve ser uma data e hora válidas' })
  @IsNotEmpty()
  to: Date;

  @ApiPropertyOptional({
    description: 'Filtrar por veterinário',
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  })
  @IsOptional()
  @IsString()
  vetId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por pet',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsOptional()
  @IsString()
  petId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por status',
    enum: AppointmentStatus,
    enumName: 'AppointmentStatus',
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({
    description: 'Filtrar por procedimento',
    enum: ProcedureType,
    enumName: 'Procedimentos'
  })
  @IsOptional()
  @IsEnum(ProcedureType)
  type?: ProcedureType;

  @ApiPropertyOptional({
    description: 'Ordem por data e hora',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({
    description: 'Número da página (começa em 1). Sem `page`, a lista não é paginada.',
    minimum: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;
}
