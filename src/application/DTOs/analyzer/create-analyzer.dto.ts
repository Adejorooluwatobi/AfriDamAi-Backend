import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString } from "class-validator";

export class CreateAnalyzerDto {
    @ApiProperty({ example: 'success' })
    @IsString()
    status: string;

    @ApiProperty({ example: 'uploads/skin-123.jpg' })
    @IsString()
    imageUrl: string;

    @ApiProperty({ example: { 'Psoriasis': 0.64, 'Acne': 0.05 } })
    @IsObject() // This is a JSON object, not a string
    @IsOptional()
    predictions?: Record<string, number>;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string; // Fixed typo from 'discription'
}