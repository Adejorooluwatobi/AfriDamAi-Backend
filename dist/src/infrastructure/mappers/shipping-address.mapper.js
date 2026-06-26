"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingAddressMapper = void 0;
const shipping_address_entity_1 = require("../../domain/entities/shipping-address.entity");
class ShippingAddressMapper {
    static toDomain(prismaAddress) {
        return new shipping_address_entity_1.ShippingAddressEntity({
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
    static toPrisma(address) {
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
exports.ShippingAddressMapper = ShippingAddressMapper;
//# sourceMappingURL=shipping-address.mapper.js.map