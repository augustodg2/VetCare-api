import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { VetCreateInput, VetUpdateInput } from "../generated/prisma/models";
import { Prisma } from "../generated/prisma/client";


const withUser = { user: true } satisfies Prisma.VetInclude;
 const PAGE_SIZE = 10
@Injectable()
export class VetsRepository{

  constructor(private readonly prisma: PrismaService) {}


  async create(data: VetCreateInput){
    console.log('checkpoin3')

    return await this.prisma.vet.create({data, include: withUser});
  }

  async search(search: string | undefined, page: number) {
    const term = search?.trim();

    const where: Prisma.VetWhereInput = {
      deletedAt: null,
      ...(term && {
        OR: [
          { cpf: { contains: term, mode: 'insensitive' } },
          { user: { name: { contains: term, mode: 'insensitive' } } },
          { user : { email: { contains: term, mode: 'insensitive' }}},
          { crmv: { contains: term, mode: 'insensitive' }  },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.vet.findMany({
        where,
        include: { user: true },
        orderBy: { user: { name: 'asc' } },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      this.prisma.vet.count({ where }),
    ]);
    const pageSize = PAGE_SIZE

    return { data, total, page, pageSize};
  }

  async getById(id: string){
    return await this.prisma.vet.findUnique({where:{id: id}});
  }

  async getByUserId(userId: string) {
    return await this.prisma.vet.findFirst({ where: { userId, deletedAt: null } });
  }

  async vetAlreadyExists(cpf:string, crmv: string, userId: string) {
    if (await this.prisma.vet.findUnique({ where: { userId: userId } }) ||
        await this.prisma.vet.findUnique({where:{cpf: cpf}}) || 
        await this.prisma.vet.findUnique({where:{crmv: crmv}})){
      return true
    }
    return false
  }

  async getAll(){
    return await this.prisma.vet.findMany();
  }
  async update(id: string, data: VetUpdateInput){
    return await this.prisma.vet.update({where: {id:id}, data})
  }

  async softDelete(id: string) {
  await this.prisma.vet.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  }

  async delete(id: string){
    return await this.prisma.vet.delete({where:{id: id}})
  }
}