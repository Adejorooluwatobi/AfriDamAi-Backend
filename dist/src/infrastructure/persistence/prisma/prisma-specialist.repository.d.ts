import { ISpecialistRepository } from '../../../domain/repositories/specialist.repository.interface';
import { SpecialistEntity } from '../../../domain/entities/specialist.entity';
import { CreateSpecialistParams, UpdateSpecialistParams } from 'src/utils/type';
import { SpecialistStatus, SpecialistType } from '@prisma/client';
import { PrismaService } from './prisma.service';
export declare class SpecialistRepository implements ISpecialistRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<SpecialistEntity | null>;
    findByEmail(email: string): Promise<SpecialistEntity | null>;
    findByType(type: SpecialistType): Promise<SpecialistEntity[]>;
    findByStatus(status: SpecialistStatus): Promise<SpecialistEntity[]>;
    findByOrganization(organizationId: string): Promise<SpecialistEntity[]>;
    findAll(): Promise<SpecialistEntity[]>;
    create(params: CreateSpecialistParams): Promise<SpecialistEntity>;
    update(id: string, params: Partial<UpdateSpecialistParams>): Promise<SpecialistEntity>;
    delete(id: string): Promise<void>;
}
