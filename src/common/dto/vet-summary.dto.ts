import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";

export class VetSummaryDto {
  @ApiProperty({
    description: 'ID do veterinário',
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Dra. Ana Souza' })
  @Expose()
  @Transform(({ obj }) => obj.user?.name)
  name!: string;
}