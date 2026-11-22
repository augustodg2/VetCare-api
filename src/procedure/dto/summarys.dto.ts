import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";

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

export class VetSummaryDto {
  @ApiProperty({
    description: 'ID do veterinário',
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Nome do veterinário', example: 'Dra. Maria Silva' })
  @Expose()
  name!: string;
}