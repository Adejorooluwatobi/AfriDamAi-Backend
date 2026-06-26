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
exports.PrismaSpecialistAssignmentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const specialist_assignment_mapper_1 = require("../../mappers/specialist-assignment.mapper");
let PrismaSpecialistAssignmentRepository = class PrismaSpecialistAssignmentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(assignment) {
        const created = await this.prisma.specialistAssignment.create({
            data: {
                appointmentId: assignment.appointmentId,
                specialistId: assignment.specialistId,
                assignedBy: assignment.assignedBy,
                status: assignment.status || 'PENDING',
            },
            include: {
                appointment: true,
                specialist: true,
            },
        });
        return specialist_assignment_mapper_1.SpecialistAssignmentMapper.toDomain(created);
    }
    async findById(id) {
        const assignment = await this.prisma.specialistAssignment.findUnique({
            where: { id },
            include: {
                appointment: true,
                specialist: true,
            },
        });
        return assignment ? specialist_assignment_mapper_1.SpecialistAssignmentMapper.toDomain(assignment) : null;
    }
    async findByAppointmentId(appointmentId) {
        const assignments = await this.prisma.specialistAssignment.findMany({
            where: { appointmentId },
            include: {
                appointment: true,
                specialist: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return assignments.map(specialist_assignment_mapper_1.SpecialistAssignmentMapper.toDomain);
    }
    async findBySpecialistId(specialistId, status) {
        const assignments = await this.prisma.specialistAssignment.findMany({
            where: {
                specialistId,
                ...(status && { status }),
            },
            include: {
                appointment: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                profile: true,
                            },
                        },
                    },
                },
                specialist: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return assignments.map(specialist_assignment_mapper_1.SpecialistAssignmentMapper.toDomain);
    }
    async update(id, data) {
        const updated = await this.prisma.specialistAssignment.update({
            where: { id },
            data: {
                ...(data.status && { status: data.status }),
                ...(data.respondedAt && { respondedAt: data.respondedAt }),
            },
            include: {
                appointment: true,
                specialist: true,
            },
        });
        return specialist_assignment_mapper_1.SpecialistAssignmentMapper.toDomain(updated);
    }
    async cancelOtherAssignments(appointmentId, acceptedAssignmentId) {
        const result = await this.prisma.specialistAssignment.updateMany({
            where: {
                appointmentId,
                id: { not: acceptedAssignmentId },
                status: 'PENDING',
            },
            data: {
                status: 'CANCELLED',
                respondedAt: new Date(),
            },
        });
        return result.count;
    }
    async findAll() {
        const assignments = await this.prisma.specialistAssignment.findMany({
            include: {
                appointment: true,
                specialist: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return assignments.map(specialist_assignment_mapper_1.SpecialistAssignmentMapper.toDomain);
    }
};
exports.PrismaSpecialistAssignmentRepository = PrismaSpecialistAssignmentRepository;
exports.PrismaSpecialistAssignmentRepository = PrismaSpecialistAssignmentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaSpecialistAssignmentRepository);
//# sourceMappingURL=prisma-specialist-assignment.repository.js.map