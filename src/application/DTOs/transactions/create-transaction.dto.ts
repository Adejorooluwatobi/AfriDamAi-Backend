import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateTransactionDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    orderId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    appointmentId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    pricingPlanId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    subscriptionId?: string;

    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsString()
    @IsIn(['STRIPE', 'PAYPAL', 'FLUTTERWAVE', 'PAYSTACK'])
    gateway: 'STRIPE' | 'PAYPAL' | 'FLUTTERWAVE' | 'PAYSTACK';

    @ApiProperty()
    @IsOptional()
    @IsString()
    gatewayTransactionId?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    paymentMethod?: string;
}