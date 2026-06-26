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
exports.PrismaConsultationRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let PrismaConsultationRepository = class PrismaConsultationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(consultation) {
        const newConsultation = await this.prisma.consultation.create({
            data: consultation,
        });
        return newConsultation;
    }
    async findById(id) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id },
        });
        return consultation;
    }
    async findAll() {
        const consultations = await this.prisma.consultation.findMany();
        return consultations;
    }
    async update(id, consultation) {
        const updatedConsultation = await this.prisma.consultation.update({
            where: { id },
            data: consultation,
        });
        return updatedConsultation;
    }
    async delete(id) {
        await this.prisma.consultation.delete({ where: { id } });
    }
};
exports.PrismaConsultationRepository = PrismaConsultationRepository;
exports.PrismaConsultationRepository = PrismaConsultationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaConsultationRepository);
//# sourceMappingURL=prisma-consultation.repository.js.map