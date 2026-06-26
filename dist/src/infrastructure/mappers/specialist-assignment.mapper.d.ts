import { SpecialistAssignmentEntity } from 'src/domain/entities/specialist-assignment.entity';
export declare class SpecialistAssignmentMapper {
    static toDomain(prismaAssignment: any): SpecialistAssignmentEntity;
    static toDomainArray(prismaAssignments: any[]): SpecialistAssignmentEntity[];
}
