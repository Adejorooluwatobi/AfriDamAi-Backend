import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SpecialistStatus } from '@prisma/client';

export class UpdateSpecialistStatusDto {
  @ApiProperty({ enum: SpecialistStatus })
  @IsEnum(SpecialistStatus)
  @IsNotEmpty()
  status: SpecialistStatus;
}
