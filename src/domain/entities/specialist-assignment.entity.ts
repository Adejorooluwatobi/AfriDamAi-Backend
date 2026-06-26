import { ApiProperty } from '@nestjs/swagger';

export enum SpecialistAssignmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
}

export class SpecialistAssignmentEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  appointmentId: string;

  @ApiProperty()
  specialistId: string;

  @ApiProperty()
  assignedBy: string;

  @ApiProperty({ enum: SpecialistAssignmentStatus })
  status: SpecialistAssignmentStatus;

  @ApiProperty()
  assignedAt: Date;

  @ApiProperty({ required: false })
  respondedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  appointment?: any;

  constructor(partial: Partial<SpecialistAssignmentEntity>) {
    Object.assign(this, partial);
  }
}
