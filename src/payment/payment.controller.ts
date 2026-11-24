// src/payment/payment.controller.ts
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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

  
  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancela um pagamento',
    description:
      'Muda o status do pagamento de `PAID` para `CANCELED`. O registro não é apagado, ' +
      'preservando o histórico financeiro. Só é possível cancelar pagamentos com status `PAID`. ' +
      'Pagamentos `CANCELED` ou `REFUNDED` não podem ser alterados. ' +
      'Para corrigir valores ou itens, cancele e registre um novo pagamento.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'ID do pagamento',
  })
  @ApiOkResponse({
    description: 'Pagamento cancelado. Retorna o pagamento atualizado',
    type: PaymentResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Pagamento não encontrado' })
  @ApiConflictResponse({
    description: 'O pagamento não está com status `PAID` e não pode ser cancelado',
  })
  cancel(@Param('id', ParseUUIDPipe) id: string): Promise<PaymentResponseDto> {
    return this.service.cancel(id);
  }

  @Patch(':id/refund')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Estorna um pagamento',
    description:
      'Muda o status do pagamento de `PAID` para `REFUNDED`, indicando que o valor foi devolvido ao tutor. ' +
      'O registro não é apagado, preservando o histórico financeiro. ' +
      'Só é possível estornar pagamentos com status `PAID`. ' +
      'Pagamentos `CANCELED` ou `REFUNDED` não podem ser alterados.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'ID do pagamento',
  })
  @ApiOkResponse({
    description: 'Pagamento estornado. Retorna o pagamento atualizado',
    type: PaymentResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Pagamento não encontrado' })
  @ApiConflictResponse({
    description: 'O pagamento não está com status `PAID` e não pode ser estornado',
  })
  refund(@Param('id', ParseUUIDPipe) id: string): Promise<PaymentResponseDto> {
    return this.service.refund(id);
  }
}