import { AppointmentStatus, SpecialtyTier } from '@prisma/client';
export declare class Appointment {
    id: string;
    userId: string;
    subscriptionId?: string;
    specialistId?: string;
    specialty: SpecialtyTier;
    type: string;
    status: AppointmentStatus;
    price: number;
    scheduledAt?: Date;
    startedAt?: Date;
    endedAt?: Date;
    endRequestedBy?: string;
    endRequestedAt?: Date;
    isExtended: boolean;
    notes?: string;
    meetingLink?: string;
    organizationId?: string;
    createdAt: Date;
    updatedAt: Date;
    user?: any;
    specialist?: any;
    constructor(partial: Partial<Appointment>);
}
