import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVetDto {
  @ApiProperty({ description: 'Registro no CRMV', example: 'CRMV-BA 12345' })
  @IsString({ message: 'A crmv deve ser válido' })
  @IsNotEmpty({ message: 'A crmv não pode estar vazia' })
  crmv: string;

  @ApiProperty({ description: 'CPF do veterinário', example: '12345678900' })
  @IsString({ message: 'A cpf deve ser válido' })
  @IsNotEmpty({ message: 'A cpf não pode estar vazio' })
  cpf: string;

  @ApiProperty({
    description: 'ID do usuário existente (com role VET) que será vinculado',
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  })
  @IsString({ message: 'A usuário deve ser válido' })
  @IsNotEmpty({ message: 'A usuário não pode estar vazio' })
  userId: string;
}