import { ShippingAddressEntity } from 'src/domain/entities/shipping-address.entity';
import { ShippingAddress } from '@prisma/client';
export declare class ShippingAddressMapper {
    static toDomain(prismaAddress: ShippingAddress): ShippingAddressEntity;
    static toPrisma(address: ShippingAddressEntity): Omit<ShippingAddress, 'createdAt' | 'updatedAt'>;
}
