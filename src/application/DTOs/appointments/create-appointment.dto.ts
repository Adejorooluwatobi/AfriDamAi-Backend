import { ApiProperty } from '@nestjs/swagger';
import { SpecialistType, SpecialtyTier } from '@prisma/client';
import { IsEnum, IsOptional, IsDateString, IsString, IsUUID } from 'class-validator';


export class CreateAppointmentDto {
  @ApiProperty({ 
    description: 'The unique ID of the user subscription to link the appointment to' 
  })
  @IsString()
  subscriptionId: string; // Changed from planId, now required

  @ApiProperty({ enum: SpecialtyTier })
  @IsEnum(SpecialtyTier)
  specialty: SpecialtyTier;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ 
    description: 'Optional ID of the hospital/organization if the patient is booking directly with a facility',
    required: false 
  })
  @IsOptional()
  @IsUUID()
  organizationId?: string;
}