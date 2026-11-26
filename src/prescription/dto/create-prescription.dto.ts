// prescriptions/dto/create-prescription.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePrescriptionDto {
  @ApiPropertyOptional({ example: 'Tratamento Dermatite' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Amoxicilina 500mg - 1 comprimido a cada 12h por 7 dias.' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ example: '7c9e6679-7425-40de-944b-e07fc1f90ae7' })
  @IsUUID()
  vetId!: string;

  @ApiProperty({ example: '3f2b8c1e-9a4d-4c7e-8f21-5b6a7d9e0c12' })
  @IsUUID()
  petId!: string;
}