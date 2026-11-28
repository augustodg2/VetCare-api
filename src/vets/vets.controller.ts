import {
  Controller, Get, Post, Body, Param, Delete, UseGuards, Query,
  Patch,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VetsService } from './vets.service';
import { CreateVetDto } from './dto/create-vet.dto';
import { ListVetsQueryDto } from './dto/listsVetsQuery.dto';
import { ResponseVetsDto } from './dto/response-vets.dto';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { UpdateVetDto } from './dto/update-vet.dto';
import { Role } from '../generated/prisma/enums';
import { StatusGuard } from '../auth/guards/status.guard';
import { AllowedStatus } from '../auth/decorator/status.decorator';

@ApiTags('Vets')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
@ApiForbiddenResponse({ description: 'Acesso restrito a administradores' })
@UseGuards(AuthGuard('jwt'), RolesGuard, StatusGuard)
@Roles('ADMIN')
@AllowedStatus('ACTIVE')
@Controller('vets')
export class VetsController {
  constructor(private readonly vetsService: VetsService) {}

  @ApiOperation({
    summary: 'Cadastrar veterinário',
    description:
      'Cria um veterinário vinculado a um usuário existente que tenha a role VET. Apenas ADMIN.',
  })
  @ApiCreatedResponse({
    description: 'Veterinário criado com sucesso',
    type: ResponseVetsDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos, usuário inexistente ou usuário sem role VET',
  })
  @Post()
  create(@Body() createVetDto: CreateVetDto) {
    return this.vetsService.create(createVetDto);
  }

  @ApiOperation({
    summary: 'Listar veterinários',
    description:
      'Lista veterinários ativos com busca opcional e paginação. Apenas ADMIN.',
  })
  @ApiOkResponse({
    description: 'Lista de veterinários retornada com sucesso',
    type: ResponseVetsDto,
    isArray: true,
  })
  @Get()
  lists(@Query() query: ListVetsQueryDto) {
    return this.vetsService.list(query);
  }

  
  @ApiOperation({
    summary: 'Buscar veterinário por ID',
    description: 'Retorna os dados de um veterinário. Apenas ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do veterinário',
    example: '3f2b8c1e-9a4d-4c7e-8f21-5b6a7d9e0c12',
  })
  @ApiOkResponse({
    description: 'Veterinário encontrado',
    type: ResponseVetsDto,
  })
  @ApiNotFoundResponse({ description: 'Veterinário não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vetsService.findOne(id);
  }


  @ApiOperation({
    summary: 'Atualizar veterinário',
    description:
      'Atualiza parcialmente os dados de um veterinário. ' +
      'ADMIN pode atualizar qualquer veterinário; VET só pode atualizar o próprio cadastro.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do veterinário',
    example: '3f2b8c1e-9a4d-4c7e-8f21-5b6a7d9e0c12',
  })
  @ApiBody({ type: UpdateVetDto })
  @ApiOkResponse({
    description: 'Veterinário atualizado com sucesso',
    type: ResponseVetsDto,
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  @ApiNotFoundResponse({ description: 'Veterinário não encontrado' })
  @ApiForbiddenResponse({
    description: 'VET tentando atualizar o cadastro de outro veterinário',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVetDto: UpdateVetDto,
    @Req() req: { user: { id: string }, role: Role },
  ) {
    if (req.role == 'VET' && req.user.id !== id) {
      throw new ForbiddenException('Usuário sem permissão.');
    }

    return this.vetsService.update(id, updateVetDto);
  }


  @ApiOperation({
    summary: 'Remover veterinário',
    description: 'Realiza a exclusão lógica (soft delete) do veterinário. Apenas ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do veterinário',
    example: '3f2b8c1e-9a4d-4c7e-8f21-5b6a7d9e0c12',
  })
  @ApiOkResponse({ description: 'Veterinário removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Veterinário não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vetsService.softDelete(id);
  }
}