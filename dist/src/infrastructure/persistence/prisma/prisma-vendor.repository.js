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
exports.PrismaVendorRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const vendor_mapper_1 = require("../../mappers/vendor.mapper");
let PrismaVendorRepository = class PrismaVendorRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { id },
        });
        return vendor ? vendor_mapper_1.VendorMapper.toDomain(vendor) : null;
    }
    async findByEmail(email) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { email },
        });
        return vendor ? vendor_mapper_1.VendorMapper.toDomain(vendor) : null;
    }
    async findAll() {
        const vendor = await this.prisma.vendor.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return vendor_mapper_1.VendorMapper.toDomainArray(vendor);
    }
    async create(vendorData) {
        const vendor = await this.prisma.vendor.create({
            data: vendor_mapper_1.VendorMapper.toPersistence(vendorData)
        });
        return vendor_mapper_1.VendorMapper.toDomain(vendor);
    }
    async update(id, vendorData) {
        const { status, ...rest } = vendorData;
        const vendor = await this.prisma.vendor.update({
            where: { id },
            data: {
                ...rest,
                status: status
            }
        });
        return vendor_mapper_1.VendorMapper.toDomain(vendor);
    }
    async delete(id) {
        await this.prisma.vendor.delete({ where: { id } });
    }
};
exports.PrismaVendorRepository = PrismaVendorRepository;
exports.PrismaVendorRepository = PrismaVendorRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaVendorRepository);
//# sourceMappingURL=prisma-vendor.repository.js.map