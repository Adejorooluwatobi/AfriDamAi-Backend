"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaShippingAddressRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const shipping_address_mapper_1 = require("../../mappers/shipping-address.mapper");
let PrismaShippingAddressRepository = class PrismaShippingAddressRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(params) {
        const address = await this.prisma.shippingAddress.create({
            data: params,
        });
        return shipping_address_mapper_1.ShippingAddressMapper.toDomain(address);
    }
    async findById(id) {
        const address = await this.prisma.shippingAddress.findUnique({
            where: { id },
        });
        return address ? shipping_address_mapper_1.ShippingAddressMapper.toDomain(address) : null;
    }
    async findByUserId(userId) {
        const addresses = await this.prisma.shippingAddress.findMany({
            where: { userId },
        });
        return addresses.map(shipping_address_mapper_1.ShippingAddressMapper.toDomain);
    }
    async update(id, params) {
        const address = await this.prisma.shippingAddress.update({
            where: { id },
            data: params,
        });
        return shipping_address_mapper_1.ShippingAddressMapper.toDomain(address);
    }
    async delete(id) {
        await this.prisma.shippingAddress.delete({
            where: { id },
        });
    }
};
exports.PrismaShippingAddressRepository = PrismaShippingAddressRepository;
exports.PrismaShippingAddressRepository = PrismaShippingAddressRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaShippingAddressRepository);
//# sourceMappingURL=prisma-shipping-address.repository.js.map