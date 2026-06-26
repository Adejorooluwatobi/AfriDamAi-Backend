import { SpecialtyTier } from '@prisma/client';
export declare class CreateAppointmentDto {
    subscriptionId: string;
    specialty: SpecialtyTier;
    scheduledAt?: string;
    notes?: string;
    organizationId?: string;
}
