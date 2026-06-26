import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class AssignSpecialistsDto {
  @ApiProperty({ 
    description: 'Array of specialist IDs to assign to the appointment',
    type: [String],
    example: ['specialist_id_1', 'specialist_id_2']
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one specialist must be assigned' })
  @IsString({ each: true })
  specialistIds: string[];
}
