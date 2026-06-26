import { PrismaService } from './prisma.service';
import { VendorEntity } from '../../../domain/entities/vendor.entity';
import { IVendorRepository } from 'src/domain/repositories/vendor.repository.interface';
import { CreateVendorParams, UpdateVendorParams } from 'src/utils/type';
export declare class PrismaVendorRepository implements IVendorRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<VendorEntity | null>;
    findByEmail(email: string): Promise<VendorEntity | null>;
    findAll(): Promise<VendorEntity[]>;
    create(vendorData: CreateVendorParams): Promise<VendorEntity>;
    update(id: string, vendorData: Partial<UpdateVendorParams>): Promise<VendorEntity>;
    delete(id: string): Promise<void>;
}
