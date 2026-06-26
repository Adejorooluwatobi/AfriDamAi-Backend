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
exports.PrismaVendorDocumentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../persistence/prisma/prisma.service");
const vendor_document_mapper_1 = require("../mappers/vendor-document.mapper");
let PrismaVendorDocumentRepository = class PrismaVendorDocumentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByVendorId(vendorId) {
        const raw = await this.prisma.vendorDocument.findUnique({ where: { vendorId } });
        return raw ? vendor_document_mapper_1.VendorDocumentMapper.toDomain(raw) : null;
    }
    async upsert(vendorId, data) {
        const persistence = vendor_document_mapper_1.VendorDocumentMapper.toPersistence(data);
        const raw = await this.prisma.vendorDocument.upsert({
            where: { vendorId },
            create: { vendorId, ...persistence },
            update: persistence,
        });
        return vendor_document_mapper_1.VendorDocumentMapper.toDomain(raw);
    }
};
exports.PrismaVendorDocumentRepository = PrismaVendorDocumentRepository;
exports.PrismaVendorDocumentRepository = PrismaVendorDocumentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaVendorDocumentRepository);
//# sourceMappingURL=prisma-vendor-document.repository.js.map