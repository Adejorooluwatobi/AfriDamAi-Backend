import { PrismaService } from './prisma.service';
import { ISpecialistAssignmentRepository } from 'src/domain/repositories/specialist-assignment.repository.interface';
import { SpecialistAssignmentEntity, SpecialistAssignmentStatus } from 'src/domain/entities/specialist-assignment.entity';
export declare class PrismaSpecialistAssignmentRepository implements ISpecialistAssignmentRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(assignment: Partial<SpecialistAssignmentEntity>): Promise<SpecialistAssignmentEntity>;
    findById(id: string): Promise<SpecialistAssignmentEntity | null>;
    findByAppointmentId(appointmentId: string): Promise<SpecialistAssignmentEntity[]>;
    findBySpecialistId(specialistId: string, status?: SpecialistAssignmentStatus): Promise<SpecialistAssignmentEntity[]>;
    update(id: string, data: Partial<SpecialistAssignmentEntity>): Promise<SpecialistAssignmentEntity>;
    cancelOtherAssignments(appointmentId: string, acceptedAssignmentId: string): Promise<number>;
    findAll(): Promise<SpecialistAssignmentEntity[]>;
}
