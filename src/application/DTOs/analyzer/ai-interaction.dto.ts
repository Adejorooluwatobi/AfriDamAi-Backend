import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AiInteractionDto {
    @ApiProperty({ example: 'What is eczema?', description: 'The question or ingredient list to analyze' })
    @IsNotEmpty()
    @IsString()
    query: string;

    @ApiProperty({ example: 'User has dry skin', description: 'Additional context for the AI', required: false })
    @IsOptional()
    @IsString()
    moreInfo?: string;
}
