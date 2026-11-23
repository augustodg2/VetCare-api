// src/payment/payment.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaymentService } from './payment.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registra um pagamento',
    description:
      'Registra um pagamento com um ou mais itens, cada um vinculado a um procedimento. ' +
      'O `createdAt` marca o momento da transação. O `total` retornado é a soma dos itens menos o desconto.',
  })
  @ApiCreatedResponse({
    description: 'Pagamento registrado com sucesso',
    type: PaymentResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Dados inválidos, procedimento repetido nos itens ou desconto maior que a soma dos itens',
  })
  @ApiNotFoundResponse({
    description: 'Um ou mais procedimentos não foram encontrados',
  })
  create(@Body() dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    return this.service.create(dto);
  }
}