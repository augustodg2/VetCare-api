import { BadRequestException, HttpCode, Injectable } from '@nestjs/common';
import { CreateVetDto } from './dto/create-vet.dto';
import { UpdateVetDto } from './dto/update-vet.dto';
import { UsersRepository } from './../users/users.repository'
import { VetsRepository } from './vets.repository';
import { ListVetsQueryDto } from './dto/listsVetsQuery.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseVetsDto } from './dto/response-vets.dto';

@Injectable()
export class VetsService {

  constructor(private readonly userRepository: UsersRepository, private readonly vetsRepository: VetsRepository){}

  async create(data: CreateVetDto) {
    const user = await this.userRepository.findById(data.userId);
    if(!user){
      throw new BadRequestException('Usuário não existe')
    }
    if(user.role != "VET"){
      throw new BadRequestException("Usuário não pode ser veterinário")
    }
    if (await this.vetsRepository.vetAlreadyExists(data.cpf, data.crmv, data.userId)){
      throw new BadRequestException("Veterinário já existe")
    }
    const newData = {
      crmv: data.crmv,
      cpf: data.cpf,
      user: {
        connect: {
          id: user.id,
    },},};

    const vet = await this.vetsRepository.create(newData)
    return plainToInstance(ResponseVetsDto, vet, {excludeExtraneousValues: true}) ;
  }
  async list({ search, page }: ListVetsQueryDto) {
    const { data, ...pagination } = await this.vetsRepository.search(search, page);

    return {
      ...pagination,
      data: plainToInstance(ResponseVetsDto, data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  async findAll() {
    return await this.vetsRepository.getAll();
  }

  async findOne(id: string) {
    const vet = await this.vetsRepository.getById(id)
    if (!vet){
      throw new BadRequestException('veterinário não existe')
    }
    return plainToInstance(ResponseVetsDto, vet, {excludeExtraneousValues: false});
  }

  async update(id: string, data: UpdateVetDto) {
    const vet = await this.vetsRepository.getById(id);
    if(!vet){
      throw new BadRequestException('veterinário não existe')
    }
    if(data.userId){
      const user = await this.userRepository.findById(data.userId);
      if(!user){
        throw new BadRequestException('Usuário não existe')
      }
      if(user.role != "VET"){
        throw new BadRequestException("Usuário não pode ser veterinário")
      }
    }
    const newvet = this.vetsRepository.update(id, data)
    return plainToInstance(ResponseVetsDto, newvet, {excludeExtraneousValues: false});;
  }

  async softDelete(id: string) {
    const vet = await this.vetsRepository.getById(id);
    if(!vet){
      throw new BadRequestException('veterinário não existe')
    }
    this.vetsRepository.softDelete(id)
    return 
  }
}
