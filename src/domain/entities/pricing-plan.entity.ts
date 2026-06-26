import { ApiProperty } from "@nestjs/swagger";

export class PricingPlan {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  durationDays?: number;       // Admin sets e.g. 30
  @ApiProperty()
  appointmentLimit?: number;   // Admin sets e.g. 10
  @ApiProperty()
  isInstantSession?: boolean;  // Admin toggles for "one-and-done"
  @ApiProperty()
  description: string[]; // Changed to string[]
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  isDeleted: boolean;
  @ApiProperty()
  deletedAt?: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  paystackPlanCode?: string;
  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<PricingPlan>) {
          Object.assign(this, partial);
      }  
}