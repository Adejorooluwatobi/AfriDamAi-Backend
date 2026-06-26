import { ShippingAddressEntity } from 'src/domain/entities/shipping-address.entity';
import { ShippingAddress } from '@prisma/client';

export class ShippingAddressMapper {
    static toDomain(prismaAddress: ShippingAddress): ShippingAddressEntity {
        return new ShippingAddressEntity({
            id: prismaAddress.id,
            userId: prismaAddress.userId,
            fullName: prismaAddress.fullName,
            address: prismaAddress.address,
            city: prismaAddress.city,
            state: prismaAddress.state,
            zipCode: prismaAddress.zipCode,
            country: prismaAddress.country,
            phoneNumber: prismaAddress.phoneNumber,
            isDefault: prismaAddress.isDefault,
            createdAt: prismaAddress.createdAt,
            updatedAt: prismaAddress.updatedAt,
        });
    }

    static toPrisma(address: ShippingAddressEntity): Omit<ShippingAddress, 'createdAt' | 'updatedAt'> {
        return {
            id: address.id,
            userId: address.userId,
            fullName: address.fullName,
            address: address.address,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
            phoneNumber: address.phoneNumber,
            isDefault: address.isDefault,
        };
    }
}