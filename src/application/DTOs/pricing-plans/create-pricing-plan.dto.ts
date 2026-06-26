import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';


export class CreatePricingPlanDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNumber()
  price: number;

   @ApiProperty()
  @IsNumber()
  @IsOptional()
  durationDays?: number; 

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  appointmentLimit?: number;
  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isInstantSession?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  paystackPlanCode?: string;
 
  @ApiProperty({ 
    required: false, 
    type: [String], // Tells Swagger to expect an array of strings
    example: ['Feature 1', 'Feature 2'] 
  })
  @IsOptional()
  @IsArray() // Ensures the input is an array
  @IsString({ each: true }) // Ensures every item in the array is a string
  description?: string[];

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}