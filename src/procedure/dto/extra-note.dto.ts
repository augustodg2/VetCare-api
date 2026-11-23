// src/procedure/dto/extra-note.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExtraNoteResponseDto {
  @ApiProperty({
    readOnly: true,
    example: '7c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Retorno em 7 dias para reavaliação.' })
  @Expose()
  content!: string;

  @ApiProperty({
    readOnly: true,
    example: '2026-11-22T15:00:00.000Z',
  })
  @Expose()
  createdAt!: Date;

}


export class ExtraNoteDto {

  @ApiProperty({ example: 'Retorno em 7 dias para reavaliação.' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ example: '7c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f'})
  @IsNotEmpty()
  @IsString()
  procedureId: string

}