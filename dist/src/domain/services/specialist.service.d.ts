import { SpecialistEntity } from '../entities/specialist.entity';
import { ISpecialistRepository } from '../repositories/specialist.repository.interface';
import { CreateSpecialistParams, UpdateSpecialistParams } from 'src/utils/type';
import { SpecialistStatus, SpecialistType } from '@prisma/client';
import { WalletService } from './wallet.service';
import { Wallet } from '../entities/wallet.entity';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';
export declare class SpecialistService {
    private readonly specialistRepository;
    private readonly walletService;
    private readonly mailService;
    private readonly logger;
    constructor(specialistRepository: ISpecialistRepository, walletService: WalletService, mailService: MailService);
    createSpecialist(params: CreateSpecialistParams): Promise<SpecialistEntity>;
    findById(id: string): Promise<{
        specialist: SpecialistEntity;
        wallet: Wallet | null;
    }>;
    findByEmail(email: string): Promise<SpecialistEntity>;
    findByType(type: SpecialistType): Promise<SpecialistEntity[]>;
    findByStatus(status: SpecialistStatus): Promise<SpecialistEntity[]>;
    findByOrganization(organizationId: string): Promise<{
        specialist: SpecialistEntity;
        wallet: Wallet | null;
    }[]>;
    findAll(): Promise<SpecialistEntity[]>;
    updateSpecialist(id: string, params: Partial<UpdateSpecialistParams>): Promise<SpecialistEntity>;
    deleteSpecialist(id: string): Promise<void>;
    updateSpecialistStatus(id: string, status: SpecialistStatus): Promise<SpecialistEntity>;
    updateSpecialistActiveStatus(id: string, isActive: boolean): Promise<SpecialistEntity>;
    updateSpecialistSuspensionStatus(id: string, isSuspended: boolean): Promise<SpecialistEntity>;
}
