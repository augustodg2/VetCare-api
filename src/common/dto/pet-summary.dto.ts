import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class PetSummaryDto {
@ApiProperty({
    description: 'ID do pet',
    example: '3f2b8c1e-9a4d-4c7e-8f21-5b6a7d9e0c12',
  })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Nome do pet', example: 'Rex' })
  @Expose()
  name!: string;

  @ApiProperty({ description: 'Espécie do pet', example: 'Cachorro' })
  @Expose()
  species!: string;
}
