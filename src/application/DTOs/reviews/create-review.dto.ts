import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateReviewDto {
    @ApiProperty()
    @IsString()
    productId: string;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    comment?: string;
}