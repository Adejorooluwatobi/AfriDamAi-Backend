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
exports.PrismaAnalyzerRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const analyzer_mapper_1 = require("../../mappers/analyzer.mapper");
let PrismaAnalyzerRepository = class PrismaAnalyzerRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const analyzer = await this.prisma.aI.findUnique({
            where: { id },
            include: { user: true }
        });
        return analyzer ? analyzer_mapper_1.AnalyzerMapper.toDomain(analyzer) : null;
    }
    async findAll() {
        const analyzers = await this.prisma.aI.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
        return analyzer_mapper_1.AnalyzerMapper.toDomainArray(analyzers);
    }
    async findByUserId(userId, userType = 'user') {
        const validUserTypes = ['user'];
        if (!validUserTypes.includes(userType)) {
            throw new common_1.NotFoundException('Invalid user type');
        }
        const whereClause = {};
        if (userType === 'user')
            whereClause.userId = userId;
        const analyzer = await this.prisma.aI.findFirst({
            where: whereClause,
            include: { user: true }
        });
        return analyzer ? analyzer_mapper_1.AnalyzerMapper.toDomain(analyzer) : null;
    }
    async create(analyzerData) {
        const analyzer = await this.prisma.aI.create({
            data: analyzer_mapper_1.AnalyzerMapper.toPersistence(analyzerData),
            include: { user: true }
        });
        return analyzer_mapper_1.AnalyzerMapper.toDomain(analyzer);
    }
    async update(id, analyzerData) {
        if (!id || typeof id !== 'string') {
            throw new common_1.NotFoundException('Invalid analyzer ID');
        }
        const analyzer = await this.prisma.aI.update({
            where: { id },
            data: analyzer_mapper_1.AnalyzerMapper.toPersistence(analyzerData),
            include: { user: true }
        });
        return analyzer_mapper_1.AnalyzerMapper.toDomain(analyzer);
    }
    async delete(id) {
        if (!id || typeof id !== 'string') {
            throw new common_1.NotFoundException('Invalid analyzer ID');
        }
        await this.prisma.aI.delete({ where: { id } });
    }
    async findAllByUserId(userId) {
        const analyzers = await this.prisma.aI.findMany({
            where: { userId },
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
        return analyzer_mapper_1.AnalyzerMapper.toDomainArray(analyzers);
    }
};
exports.PrismaAnalyzerRepository = PrismaAnalyzerRepository;
exports.PrismaAnalyzerRepository = PrismaAnalyzerRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaAnalyzerRepository);
//# sourceMappingURL=prisma-analyzer.repository.js.map