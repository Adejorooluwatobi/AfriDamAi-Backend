import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountStatusDto {
  @ApiProperty({ description: 'The active status of the account' })
  @IsBoolean()
  isActive: boolean;
}
