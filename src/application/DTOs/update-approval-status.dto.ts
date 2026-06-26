import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class UpdateApprovalStatusDto {
  @ApiProperty({ enum: ApprovalStatus, description: 'The approval status of the account' })
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;
}
