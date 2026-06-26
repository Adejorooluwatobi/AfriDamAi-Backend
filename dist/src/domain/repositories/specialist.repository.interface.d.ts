import { CreateSpecialistParams, UpdateSpecialistParams } from 'src/utils/type';
import { SpecialistEntity } from '../entities/specialist.entity';
import { SpecialistStatus, SpecialistType } from '@prisma/client';
export interface ISpecialistRepository {
    findById(id: string): Promise<SpecialistEntity | null>;
    findByEmail(email: string): Promise<SpecialistEntity | null>;
    findByType(type: SpecialistType): Promise<SpecialistEntity[]>;
    findByStatus(status: SpecialistStatus): Promise<SpecialistEntity[]>;
    findByOrganization(organizationId: string): Promise<SpecialistEntity[]>;
    findAll(): Promise<SpecialistEntity[]>;
    create(specialist: CreateSpecialistParams): Promise<SpecialistEntity>;
    update(id: string, specialist: Partial<UpdateSpecialistParams>): Promise<SpecialistEntity>;
    delete(id: string): Promise<void>;
}
