import { ApiProperty } from "@nestjs/swagger";
import { AppointmentStatus, SpecialtyTier } from '@prisma/client'; // Import enums from @prisma/client

// appointment.entity.ts
export class Appointment {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  subscriptionId?: string; // Essential to link back to the sub
  @ApiProperty({ required: false })
  specialistId?: string;
  @ApiProperty()
  specialty: SpecialtyTier;
  @ApiProperty()
  type: string;
  @ApiProperty()
  status: AppointmentStatus;
  @ApiProperty()
  price: number;
  @ApiProperty()
  scheduledAt?: Date;
  @ApiProperty({ required: false })
  startedAt?: Date; // Added startedAt
  @ApiProperty({ required: false })
  endedAt?: Date; // Added endedAt
  @ApiProperty({ required: false })
  endRequestedBy?: string;
  @ApiProperty({ required: false })
  endRequestedAt?: Date;
  @ApiProperty()
  isExtended: boolean;
  @ApiProperty({ required: false })
  notes?: string;
  @ApiProperty({ required: false })
  meetingLink?: string;
  @ApiProperty({ required: false })
  organizationId?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  user?: any;

  @ApiProperty({ required: false })
  specialist?: any;

  // Fix: Change the parameter type to Partial<Appointment> (the class itself)
  constructor(partial: Partial<Appointment>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
  }  
}
