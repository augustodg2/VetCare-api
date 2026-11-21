import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseUserDto } from '../../users/dto/response-user.dto';

export class ResponseVetsDto {
  @ApiProperty({
    description: 'Identificador único do veterinário',
    example: '3f2b8c1e-9a4d-4c7e-8f21-5b6a7d9e0c12',
  })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'CPF do veterinário', example: '12345678900' })
  @Expose()
  cpf!: string;

  @ApiProperty({ description: 'Registro no CRMV', example: 'CRMV-BA 12345' })
  @Expose()
  crmv!: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2026-11-21T12:00:00.000Z',
  })
  @Expose()
  createdAt!: Date;

  @ApiProperty({
    description: 'Data de exclusão lógica (null se o registro estiver ativo)',
    example: null,
    nullable: true,
    type: String,
    format: 'date-time',
  })
  @Expose()
  deletedAt!: Date | null;

  @ApiProperty({
    description: 'Usuário vinculado ao veterinário',
    type: () => ResponseUserDto,
  })
  @Expose()
  @Type(() => ResponseUserDto)
  user!: ResponseUserDto;
}