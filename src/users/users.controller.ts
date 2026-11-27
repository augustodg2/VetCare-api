import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
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
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorator/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { InviteUserDto } from './dto/invite-user.dto';
import { StatusGuard } from '../auth/guards/status.guard';
import { AllowedStatus } from '../auth/decorator/status.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { ListUsersDto } from './dto/list-user.dto';
import { ResponseUserByIdDto } from './dto/response-user-byId.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { ResponseMeDto } from './dto/response-me.dto';

@ApiTags('Users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token JWT ausente, inválido ou expirado' })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //create
  @ApiOperation({
    summary: 'Criar usuário',
    description: 'Cria um novo usuário diretamente, com senha definida. Restrito a administradores com status ativo.',
  })
  @ApiCreatedResponse({ description: 'Usuário criado com sucesso' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou email já cadastrado' })
  @ApiForbiddenResponse({ description: 'Acesso restrito a administradores ativos' })
  //@UseGuards(AuthGuard('jwt'), RolesGuard, StatusGuard)
  @Roles('ADMIN')
  @AllowedStatus('ACTIVE')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //invite
  @ApiOperation({
    summary: 'Convidar usuário',
    description: 'Envia um convite para o email informado, com o perfil de acesso definido. Restrito a administradores com status ativo.',
  })
  @ApiCreatedResponse({ description: 'Convite criado com sucesso', type: ResponseUserDto })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou email já cadastrado' })
  @ApiForbiddenResponse({ description: 'Acesso restrito a administradores ativos' })
  @UseGuards(AuthGuard('jwt'), RolesGuard, StatusGuard)
  @Roles('ADMIN')
  @AllowedStatus('ACTIVE')
  @Post('invite')
  invite(@Body() inviteUserDto: InviteUserDto) {
    return this.usersService.invite(inviteUserDto);
  }

  //resend invite
  @Post(':id/resend-invite')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard, StatusGuard)
  @Roles('ADMIN')
  @AllowedStatus('ACTIVE')
  @ApiOperation({
    summary: 'Reenviar convite',
    description:
      'Gera um novo token e reenvia o e-mail de convite para um usuário com status `PENDING_INVITE`. ' +
      'Atualiza `inviteSentAt`. Restrito a administradores com status ativo.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'ID do usuário com convite pendente',
  })
  @ApiOkResponse({
    description: 'Convite reenviado com sucesso',
    type: ResponseUserByIdDto,
  })
  @ApiBadRequestResponse({ description: 'ID inválido (não é um UUID)' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente, inválido ou expirado' })
  @ApiForbiddenResponse({ description: 'Acesso restrito a administradores ativos' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiConflictResponse({ description: 'O usuário não está com convite pendente' })
  @ApiInternalServerErrorResponse({ description: 'Falha ao enviar o e-mail' })
  resendInvite(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.resendInvite(id);
  }

  //deactivate
  @ApiOperation({
    summary: 'Desativar usuário',
    description: 'Altera o status do usuário para inativo. Restrito a administradores com status ativo.',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário a ser desativado' })
  @ApiCreatedResponse({ description: 'Usuário desativado com sucesso' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiForbiddenResponse({ description: 'Acesso restrito a administradores ativos' })
  @UseGuards(AuthGuard('jwt'), RolesGuard, StatusGuard)
  @Roles('ADMIN')
  @AllowedStatus('ACTIVE')
  @Post(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  //reactivate
  @Post(':id/reactivate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard, StatusGuard)
  @Roles('ADMIN')
  @AllowedStatus('ACTIVE')
  @ApiOperation({
    summary: 'Reativar usuário',
    description:
      'Altera o status do usuário de `DEACTIVATED` para `ACTIVE`. ' +
      'Não se aplica a usuários com convite pendente (use o reenvio de convite). ' +
      'Restrito a administradores com status ativo.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'ID do usuário a ser reativado',
  })
  @ApiOkResponse({
    description: 'Usuário reativado com sucesso',
    type: ResponseUserByIdDto,
  })
  @ApiBadRequestResponse({ description: 'ID inválido (não é um UUID)' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente, inválido ou expirado' })
  @ApiForbiddenResponse({ description: 'Acesso restrito a administradores ativos' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiConflictResponse({ description: 'O usuário não está com status DEACTIVATED' })
  reactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.reactivate(id);
  }


  //refresh
  @ApiOperation({
    summary: 'Obter usuário logado',
    description: 'Retorna os dados do usuário autenticado. Útil para restaurar a sessão no front-end.',
  })
  @ApiOkResponse({ description: 'Dados do usuário autenticado', type: ResponseMeDto })
  @ApiForbiddenResponse({ description: 'Usuário sem status ativo' })
  @UseGuards(AuthGuard('jwt'), StatusGuard)
  @AllowedStatus('ACTIVE')
  @Get('me')
  refresh(@CurrentUser('id') userId: string) {
    return this.usersService.refresh(userId);
  }


  //list
  @ApiOperation({
    summary: 'Listar usuários',
    description: 'Lista usuários com busca opcional, filtro por status e paginação. Restrito a administradores com status ativo.',
  })
  @ApiOkResponse({ description: 'Lista de usuários', type: [ResponseUserByIdDto] })
  @ApiForbiddenResponse({ description: 'Acesso restrito a administradores ativos' })
  //@UseGuards(AuthGuard('jwt'), RolesGuard, StatusGuard)
  @Roles('ADMIN')
  @AllowedStatus('ACTIVE')
  @Get()
  findAll(@Query() query: ListUsersDto) {
    return this.usersService.findAll(query);
  }

  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna os dados de um usuário específico. Restrito a administradores com status ativo.',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
 @ApiOkResponse({ description: 'Dados do usuário', type: ResponseUserByIdDto })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiForbiddenResponse({ description: 'Acesso restrito a administradores ativos' })
  @UseGuards(AuthGuard('jwt'), RolesGuard, StatusGuard)
  @Roles('ADMIN')
  @AllowedStatus('ACTIVE')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  //Patch
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza parcialmente os dados de um usuário. Restrito a administradores com status ativo.',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário a ser atualizado' })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso', type: ResponseUserDto })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiForbiddenResponse({ description: 'Acesso restrito a administradores ativos' })
  @UseGuards(AuthGuard('jwt'), RolesGuard, StatusGuard)
  @Roles('ADMIN')
  @AllowedStatus('ACTIVE')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Post(':id/reset-password')
  @HttpCode(HttpStatus.OK)
  //@UseGuards(AuthGuard('jwt'), RolesGuard, StatusGuard)
  @Roles('ADMIN')
  @AllowedStatus('ACTIVE')
  @ApiOperation({
    summary: 'Recuperar senha',
    description:
      'Envia ao usuário um e-mail com link (válido por 24 horas) para definir uma nova senha. ' +
      'A senha atual não é enviada nem exibida. Só vale para usuários `ACTIVE`. ' +
      'Restrito a administradores com status ativo.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'ID do usuário que receberá o e-mail',
  })
  @ApiBadRequestResponse({ description: 'ID inválido (não é um UUID)' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente, inválido ou expirado' })
  @ApiForbiddenResponse({ description: 'Acesso restrito a administradores ativos' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiConflictResponse({ description: 'O usuário não está com status ACTIVE' })
  @ApiInternalServerErrorResponse({ description: 'Falha ao enviar o e-mail' })
  resendPassword(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.resendPassword(id);
  }
}