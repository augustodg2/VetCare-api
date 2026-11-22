import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { UserStatus } from '../../generated/prisma/enums';

export class ListUsersDto {
  @ApiPropertyOptional({
    description:
      'Filtra por status. Aceita um ou mais valores separados por vírgula; sem o parâmetro, retorna todos',
    example: 'ACTIVE,PENDING_INVITE',
    enum: UserStatus,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((s) => s.trim()).filter(Boolean)
      : value,
  )
  @IsEnum(UserStatus, { each: true })
  status?: UserStatus[];

  @ApiPropertyOptional({
    description: 'Termo de busca para filtrar usuários (ex.: nome ou email)',
    example: 'maria',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  search?: string;

  @ApiPropertyOptional({
    description: 'Número da página a ser retornada',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  @IsInt()
  @Min(1)
  page?: number;
}