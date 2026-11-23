// src/payment/dto/create-payment.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePaymentItemDto {
  @ApiProperty({
    format: 'uuid',
    example: '45986740-79af-4dd6-97e0-4d6a4828b919',
    description: 'ID do procedimento que está sendo pago',
  })
  @IsUUID()
  procedureId!: string;

  @ApiProperty({
    example: 150.0,
    description: 'Valor cobrado por este procedimento (até 2 casas decimais)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @IsPositive()
  amount!: number;

  @ApiPropertyOptional({
    example: 'Consulta de retorno',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}

export class CreatePaymentDto {
  @ApiProperty({
    example: 'PIX',
    maxLength: 50,
    description: 'Forma de pagamento (texto livre)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  paymentMethod!: string;

  @ApiPropertyOptional({
    example: 10.0,
    minimum: 0,
    description:
      'Desconto aplicado ao pagamento como um todo. Se omitido, nenhum desconto é aplicado.',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discount?: number;

  @ApiPropertyOptional({
    example: 'Pago em dinheiro, sem troco.',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiProperty({
    type: () => [CreatePaymentItemDto],
    description: 'Itens do pagamento (um por procedimento, sem repetição)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CreatePaymentItemDto)
  items!: CreatePaymentItemDto[];
}