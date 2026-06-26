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
exports.PrismaSpecialistDocumentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../persistence/prisma/prisma.service");
const specialist_document_mapper_1 = require("../mappers/specialist-document.mapper");
let PrismaSpecialistDocumentRepository = class PrismaSpecialistDocumentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findBySpecialistId(specialistId) {
        const raw = await this.prisma.specialistDocument.findUnique({ where: { specialistId } });
        return raw ? specialist_document_mapper_1.SpecialistDocumentMapper.toDomain(raw) : null;
    }
    async upsert(specialistId, data) {
        const persistence = specialist_document_mapper_1.SpecialistDocumentMapper.toPersistence(data);
        const raw = await this.prisma.specialistDocument.upsert({
            where: { specialistId },
            create: { specialistId, ...persistence },
            update: persistence,
        });
        return specialist_document_mapper_1.SpecialistDocumentMapper.toDomain(raw);
    }
};
exports.PrismaSpecialistDocumentRepository = PrismaSpecialistDocumentRepository;
exports.PrismaSpecialistDocumentRepository = PrismaSpecialistDocumentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaSpecialistDocumentRepository);
//# sourceMappingURL=prisma-specialist-document.repository.js.map