import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseUserDto } from './response-user.dto';

export class ResponseMeDto extends ResponseUserDto {
  @ApiProperty({
    description: 'ID do cadastro de veterinário do usuário (null se não for veterinário)',
    example: '3f2b8c1e-9a4d-4c7e-8f21-5b6a7d9e0c12',
    nullable: true,
    type: String,
  })
  @Expose()
  vetId!: string | null;
}
