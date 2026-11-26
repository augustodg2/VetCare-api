import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginationMetaDto } from '../common/dto/pagination-meta.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { ListPrescriptionsQueryDto } from './dto/list-prescriptions-query.dto';
import {
  PaginatedPrescriptionsResponseDto,
  PrescriptionResponseDto,
} from './dto/prescription-response.dto';
import { PrescriptionsRepository } from './prescription.repository';

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prescriptionsRepository: PrescriptionsRepository) {}

  async create(dto: CreatePrescriptionDto): Promise<PrescriptionResponseDto> {
    const created = await this.prescriptionsRepository.create({
      content: dto.content,
      vetId: dto.vetId,
      petId: dto.petId,
    });

    return plainToInstance(PrescriptionResponseDto, created, {
      excludeExtraneousValues: true,
    });
  }

  async getById(id: string): Promise<PrescriptionResponseDto> {
    const prescription = await this.prescriptionsRepository.findById(id);

    if (!prescription) {
      throw new NotFoundException(`Prescription with id "${id}" not found`);
    }

    return plainToInstance(PrescriptionResponseDto, prescription, {
      excludeExtraneousValues: true,
    });
  }

  async list(query: ListPrescriptionsQueryDto): Promise<PaginatedPrescriptionsResponseDto> {
    const page = query.page ?? 1;
    const pagesize = query.pagesize ?? 20;
    const skip = (page - 1) * pagesize;

    const { items, total } = await this.prescriptionsRepository.findAndCount({
      vetId: query.vetId,
      petId: query.petId,
      skip,
      take: pagesize,
    });

    const data = plainToInstance(PrescriptionResponseDto, items, {
      excludeExtraneousValues: true,
    });

    const meta = plainToInstance(
      PaginationMetaDto,
      {
        total,
        page,
        pagesize,
        totalPages: total === 0 ? 0 : Math.ceil(total / pagesize),
      },
      { excludeExtraneousValues: true },
    );

    return plainToInstance(
      PaginatedPrescriptionsResponseDto,
      { data, meta },
      { excludeExtraneousValues: true },
    );
  }
}