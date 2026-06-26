import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateTransactionDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsIn(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'])
    status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

    @ApiProperty()
    @IsOptional()
    @IsString()
    gatewayTransactionId?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    paymentMethod?: string;
}