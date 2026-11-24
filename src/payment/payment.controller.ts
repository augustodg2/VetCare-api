// src/payment/payment.controller.ts
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaymentService } from './payment.service';
import { ListPaymentsResponseDto } from './dto/list-payments-response.dto';
import { ListPaymentsQueryDto } from './dto/list-payment-query.dto';

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


  @Get()
  @ApiOperation({
    summary: 'Lista pagamentos',
    description:
      'Retorna os pagamentos paginados, do mais recente para o mais antigo (`createdAt` desc). ' +
      'Os filtros por `status` e por intervalo de data de criação (`dateFrom`/`dateTo`) são opcionais e combináveis. ' +
      'Cada pagamento traz `subtotal`, `discount` e `total`.',
  })
  @ApiOkResponse({
    description: 'Lista paginada de pagamentos',
    type: ListPaymentsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros de query inválidos ou `dateFrom` maior que `dateTo`',
  })
  list(@Query() query: ListPaymentsQueryDto): Promise<ListPaymentsResponseDto> {
    return this.service.list(query);
  }
}