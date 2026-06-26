export declare enum SpecialistAssignmentStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED",
    CANCELLED = "CANCELLED"
}
export declare class SpecialistAssignmentEntity {
    id: string;
    appointmentId: string;
    specialistId: string;
    assignedBy: string;
    status: SpecialistAssignmentStatus;
    assignedAt: Date;
    respondedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    appointment?: any;
    constructor(partial: Partial<SpecialistAssignmentEntity>);
}
