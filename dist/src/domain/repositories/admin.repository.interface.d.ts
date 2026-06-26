import { CreateAdminParams, UpdateAdminParams } from 'src/utils/type';
import { AdminEntity } from '../entities/admin.entity';
import { AdminType } from '@prisma/client';
export interface IAdminRepository {
    findById(id: string): Promise<AdminEntity | null>;
    findAll(): Promise<AdminEntity[]>;
    findByEmail(email: string): Promise<AdminEntity | null>;
    findByRole(role: AdminType): Promise<AdminEntity[]>;
    create(user: CreateAdminParams): Promise<AdminEntity>;
    update(id: string, user: Partial<UpdateAdminParams>): Promise<AdminEntity>;
    delete(id: string): Promise<void>;
}
