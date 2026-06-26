import type { ConsultationRepositoryInterface } from "../repositories/consultation.interface";
import { CreateConsultationParams, UpdateConsultationParams } from "src/utils/type";
import { ConsultationEntity } from "../entities/consultation.entity";
import { AdminService } from "./admin.service";
import { NotificationService } from "./notification.service";
export declare class ConsultationService {
    private readonly consultationRepository;
    private readonly adminService;
    private readonly notificationService;
    constructor(consultationRepository: ConsultationRepositoryInterface, adminService: AdminService, notificationService: NotificationService);
    create(params: CreateConsultationParams): Promise<ConsultationEntity>;
    findById(id: string): Promise<ConsultationEntity | null>;
    findAll(): Promise<ConsultationEntity[]>;
    update(id: string, params: UpdateConsultationParams): Promise<ConsultationEntity>;
    delete(id: string): Promise<void>;
}
