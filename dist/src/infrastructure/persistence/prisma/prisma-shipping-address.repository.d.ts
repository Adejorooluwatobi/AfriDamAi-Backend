import { ShippingAddressRepositoryInterface } from 'src/domain/repositories/shipping-address.repository.interface';
import { ShippingAddressEntity } from 'src/domain/entities/shipping-address.entity';
import { CreateShippingAddressParams, UpdateShippingAddressParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
export declare class PrismaShippingAddressRepository implements ShippingAddressRepositoryInterface {
    private prisma;
    constructor(prisma: PrismaService);
    create(params: CreateShippingAddressParams): Promise<ShippingAddressEntity>;
    findById(id: string): Promise<ShippingAddressEntity | null>;
    findByUserId(userId: string): Promise<ShippingAddressEntity[]>;
    update(id: string, params: UpdateShippingAddressParams): Promise<ShippingAddressEntity>;
    delete(id: string): Promise<void>;
}
