import { Inject, Injectable } from "@nestjs/common";
import type { ConsultationRepositoryInterface } from "../repositories/consultation.interface";
import { CreateConsultationParams, UpdateConsultationParams } from "src/utils/type";
import { ConsultationEntity } from "../entities/consultation.entity";

import { AdminService } from "./admin.service";
import { NotificationService } from "./notification.service";
import { AdminType } from "@prisma/client";

@Injectable()
export class ConsultationService {
    constructor(
        @Inject('ConsultationRepositoryInterface') private readonly consultationRepository: ConsultationRepositoryInterface,
        private readonly adminService: AdminService,
        private readonly notificationService: NotificationService
    ) {}

    async create(params: CreateConsultationParams): Promise<ConsultationEntity> {
        const newConsultation = await this.consultationRepository.create(params);

        // Fetch Super Admins and Operations Admins to notify
        const [superAdmins, operationsAdmins] = await Promise.all([
            this.adminService.findByRole(AdminType.SUPER_ADMIN),
            this.adminService.findByRole(AdminType.OPERATIONS_ADMIN)
        ]);

        const adminsToNotify = [...superAdmins, ...operationsAdmins];

        // Send notifications to all relevant admins
        const notificationPromises = adminsToNotify.map(admin => 
            this.notificationService.createNotification({
                adminId: admin.id,
                title: 'New Consultation Created',
                message: `A new consultation has been created by ${params.name} (${params.email}). Title: ${params.title}`,
                isGeneral: false
            })
        );

        await Promise.all(notificationPromises);

        return newConsultation;
    }

    async findById(id: string): Promise<ConsultationEntity | null> {
        const consultation = await this.consultationRepository.findById(id);
        return consultation;
    }

    async findAll(): Promise<ConsultationEntity[]> {
        const consultations = await this.consultationRepository.findAll();
        return consultations;
    }

    async update(id: string, params: UpdateConsultationParams): Promise<ConsultationEntity> {
        const updatedConsultation = await this.consultationRepository.update(id, params);
        return updatedConsultation;
    }

    async delete(id: string): Promise<void> {
        await this.consultationRepository.delete(id);
    }
}