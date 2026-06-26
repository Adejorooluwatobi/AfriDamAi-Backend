import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GrantSubscriptionDto {
  @ApiProperty({ description: 'The ID of the user to grant the subscription to' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'The ID of the pricing plan to grant' })
  @IsString()
  @IsNotEmpty()
  planId: string;
}
