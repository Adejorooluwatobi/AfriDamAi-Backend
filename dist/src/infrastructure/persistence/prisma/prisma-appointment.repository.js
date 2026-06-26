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
exports.PrismaAppointmentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const appointment_mapper_1 = require("../../mappers/appointment.mapper");
let PrismaAppointmentRepository = class PrismaAppointmentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(appointment) {
        const data = appointment_mapper_1.AppointmentMapper.toPersistence(appointment);
        const created = await this.prisma.appointment.create({
            data: data,
        });
        return appointment_mapper_1.AppointmentMapper.toDomain(created);
    }
    async findAll() {
        const appointments = await this.prisma.appointment.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return appointment_mapper_1.AppointmentMapper.toDomainArray(appointments);
    }
    async findById(id) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
            include: {
                user: {
                    include: {
                        profile: true
                    }
                },
                specialist: true,
            }
        });
        return appointment ? appointment_mapper_1.AppointmentMapper.toDomain(appointment) : null;
    }
    async findByUserId(userId) {
        const appointments = await this.prisma.appointment.findMany({
            where: { userId },
            include: {
                specialist: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return appointment_mapper_1.AppointmentMapper.toDomainArray(appointments);
    }
    async findByStatus(status) {
        const appointments = await this.prisma.appointment.findMany({
            where: { status },
            orderBy: { createdAt: 'desc' },
        });
        return appointment_mapper_1.AppointmentMapper.toDomainArray(appointments);
    }
    async findBySpecialty(specialty) {
        const appointments = await this.prisma.appointment.findMany({
            where: { specialty: specialty },
            orderBy: { createdAt: 'desc' },
        });
        return appointment_mapper_1.AppointmentMapper.toDomainArray(appointments);
    }
    async findBySpecialistId(specialistId, statuses) {
        const where = { specialistId };
        if (statuses && statuses.length > 0) {
            where.status = { in: statuses };
        }
        const appointments = await this.prisma.appointment.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNo: true,
                        profile: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        return appointment_mapper_1.AppointmentMapper.toDomainArray(appointments);
    }
    async update(id, params) {
        const updated = await this.prisma.appointment.update({
            where: { id },
            data: params,
        });
        return appointment_mapper_1.AppointmentMapper.toDomain(updated);
    }
    async delete(id) {
        await this.prisma.appointment.delete({ where: { id } });
    }
};
exports.PrismaAppointmentRepository = PrismaAppointmentRepository;
exports.PrismaAppointmentRepository = PrismaAppointmentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaAppointmentRepository);
//# sourceMappingURL=prisma-appointment.repository.js.map