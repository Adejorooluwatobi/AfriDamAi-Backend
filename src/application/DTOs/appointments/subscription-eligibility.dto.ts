import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionEligibilityDto {
  @ApiProperty({ description: 'Whether the user is eligible to book an appointment' })
  eligible: boolean;

  @ApiProperty({ description: 'Reason for ineligibility if applicable', required: false })
  reason?: string;

  @ApiProperty({ description: 'Days remaining in subscription', required: false })
  daysRemaining?: number;

  @ApiProperty({ description: 'Remaining appointment slots', required: false })
  remainingSessions?: number;
}
