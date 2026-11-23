 // dto/list-procedures-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { ProcedureResponseDto } from './response-procedure.dto';

export class ListProceduresResponseDto {
  @ApiProperty({ type: () => [ProcedureResponseDto] })
  @Expose()
  @Type(() => ProcedureResponseDto)
  data!: ProcedureResponseDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  @Expose()
  @Type(() => PaginationMetaDto)
  meta!: PaginationMetaDto;
}