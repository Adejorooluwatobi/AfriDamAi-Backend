import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @IsString()
  @ApiProperty({ example: 'Aloe Vera Serum' })
  userId: string;
}
