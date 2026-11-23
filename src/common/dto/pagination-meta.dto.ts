// common/dto/pagination-meta.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaginationMetaDto {
  @ApiProperty({ example: 42 })
  @Expose()
  total!: number;

  @ApiProperty({ example: 1 })
  @Expose()
  page!: number;

  @ApiProperty({ example: 20 })
  @Expose()
  pagesize!: number;

  @ApiProperty({ example: 3 })
  @Expose()
  totalPages!: number;
}