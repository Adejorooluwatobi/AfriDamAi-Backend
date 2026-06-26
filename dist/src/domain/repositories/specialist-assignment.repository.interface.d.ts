import { SpecialistAssignmentEntity, SpecialistAssignmentStatus } from '../entities/specialist-assignment.entity';
export interface ISpecialistAssignmentRepository {
    create(assignment: Partial<SpecialistAssignmentEntity>): Promise<SpecialistAssignmentEntity>;
    findById(id: string): Promise<SpecialistAssignmentEntity | null>;
    findByAppointmentId(appointmentId: string): Promise<SpecialistAssignmentEntity[]>;
    findBySpecialistId(specialistId: string, status?: SpecialistAssignmentStatus): Promise<SpecialistAssignmentEntity[]>;
    update(id: string, data: Partial<SpecialistAssignmentEntity>): Promise<SpecialistAssignmentEntity>;
    cancelOtherAssignments(appointmentId: string, acceptedAssignmentId: string): Promise<number>;
    findAll(): Promise<SpecialistAssignmentEntity[]>;
}
