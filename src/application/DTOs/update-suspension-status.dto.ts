import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSuspensionStatusDto {
  @ApiProperty({ description: 'The suspension status of the account' })
  @IsBoolean()
  isSuspended: boolean;
}
