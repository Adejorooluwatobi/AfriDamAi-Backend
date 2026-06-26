import { PrismaService } from './prisma.service';
import { AdminEntity } from '../../../domain/entities/admin.entity';
import { IAdminRepository } from 'src/domain/repositories/admin.repository.interface';
import { CreateAdminParams, UpdateAdminParams } from 'src/utils/type';
export declare class PrismaAdminRepository implements IAdminRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<AdminEntity | null>;
    findByEmail(email: string): Promise<AdminEntity | null>;
    findByRole(role: any): Promise<AdminEntity[]>;
    findAll(): Promise<AdminEntity[]>;
    create(adminData: CreateAdminParams): Promise<AdminEntity>;
    update(id: string, adminData: Partial<UpdateAdminParams>): Promise<AdminEntity>;
    delete(id: string): Promise<void>;
}
