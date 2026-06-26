import { CreateVendorParams, UpdateVendorParams } from 'src/utils/type';
import { VendorEntity } from '../entities/vendor.entity';

export interface IVendorRepository {
  findById(id: string): Promise<VendorEntity | null>;
  findAll(): Promise<VendorEntity[]>; 
  findByEmail(email: string): Promise<VendorEntity | null>;
  create(user: CreateVendorParams): Promise<VendorEntity>;
  update(id: string, user: Partial<UpdateVendorParams>): Promise<VendorEntity>;
  delete(id: string): Promise<void>;
}