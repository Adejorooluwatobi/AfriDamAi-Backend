import * as bcrypt from 'bcryptjs';
import { 
  BadRequestException, 
  ConflictException, 
  Inject, 
  Injectable, 
  Logger, 
  NotFoundException 
} from '@nestjs/common';
import { SpecialistEntity } from '../entities/specialist.entity';
import { ISpecialistRepository } from '../repositories/specialist.repository.interface';
import { CreateSpecialistParams, UpdateSpecialistParams } from 'src/utils/type';
import { SpecialistStatus, SpecialistType, WalletOwnerType } from '@prisma/client'; // Import WalletOwnerType
import { WalletService } from './wallet.service'; // Import WalletService
import { Wallet } from '../entities/wallet.entity'; // Import Wallet
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';

@Injectable()
export class SpecialistService {
  private readonly logger = new Logger(SpecialistService.name);
  
  constructor(
    @Inject('ISpecialistRepository') private readonly specialistRepository: ISpecialistRepository,
    private readonly walletService: WalletService, // Inject WalletService
    private readonly mailService: MailService,
  ) {}


  async createSpecialist(params: CreateSpecialistParams): Promise<SpecialistEntity> {
    const existingSpecialist = await this.specialistRepository.findByEmail(params.email);
    if (existingSpecialist) {
      throw new ConflictException(`Specialist with email ${params.email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(params.password, 10);
    const newSpecialist = await this.specialistRepository.create({
      ...params,
      password: hashedPassword,
    });
    this.logger.log(`Specialist created successfully: ${newSpecialist.id}`);

    // Create a wallet for the new specialist
    await this.walletService.createWallet({
        ownerId: newSpecialist.id,
        ownerType: WalletOwnerType.SPECIALIST,
        initialBalance: 0,
    });
    this.logger.log(`Wallet created for specialist: ${newSpecialist.id}`);

    return newSpecialist;
  }

  async findById(id: string): Promise<{ specialist: SpecialistEntity; wallet: Wallet | null }> {
    const specialist = await this.specialistRepository.findById(id);
    if (!specialist) {
      throw new NotFoundException(`Specialist with id ${id} not found`);
    }
    
    let wallet: Wallet | null = null;
    try {
      wallet = await this.walletService.getWalletByOwner(id, WalletOwnerType.SPECIALIST);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.log(`Wallet not found for specialist ${id}, creating one...`);
        wallet = await this.walletService.createWallet({
          ownerId: id,
          ownerType: WalletOwnerType.SPECIALIST,
          initialBalance: 0,
        });
      } else {
        throw error;
      }
    }
    
    return { specialist, wallet };
  }

  async findByEmail(email: string): Promise<SpecialistEntity> {
    const specialist = await this.specialistRepository.findByEmail(email);
    if (!specialist) {
      throw new NotFoundException(`Specialist with email ${email} not found`);
    }
    return specialist;
  }

  async findByType(type: SpecialistType): Promise<SpecialistEntity[]> {
    return this.specialistRepository.findByType(type);
  }

  async findByStatus(status: SpecialistStatus): Promise<SpecialistEntity[]> {
    return this.specialistRepository.findByStatus(status);
  }

  async findByOrganization(organizationId: string): Promise<{ specialist: SpecialistEntity; wallet: Wallet | null }[]> {
    const specialists = await this.specialistRepository.findByOrganization(organizationId);
    return Promise.all(
      specialists.map(async (specialist) => {
        let wallet: Wallet | null = null;
        try {
          wallet = await this.walletService.getWalletByOwner(specialist.id, WalletOwnerType.SPECIALIST);
        } catch (error) {
           // Ignore if no wallet
        }
        return { specialist, wallet };
      })
    );
  }

  async findAll(): Promise<SpecialistEntity[]> {
    return this.specialistRepository.findAll();
  }

  async updateSpecialist(id: string, params: Partial<UpdateSpecialistParams>): Promise<SpecialistEntity> {
    const specialist = await this.findById(id); 
    // findById throws NotFound if not found, so we are safe here
    
    const updatedSpecialist = await this.specialistRepository.update(id, params);
    this.logger.log(`Specialist updated successfully: ${updatedSpecialist.id}`);
    return updatedSpecialist;
  }

  async deleteSpecialist(id: string): Promise<void> {
    await this.findById(id); // Ensure existence
    await this.specialistRepository.delete(id);
    this.logger.log(`Specialist deleted successfully: ${id}`);
  }

  async updateSpecialistStatus(id: string, status: SpecialistStatus): Promise<SpecialistEntity> {
    await this.findById(id); // Ensure the specialist exists
    const updatedSpecialist = await this.specialistRepository.update(id, { status });
    this.logger.log(`Specialist status updated successfully: ${updatedSpecialist.id} to ${status}`);
    return updatedSpecialist;
  }

  async updateSpecialistActiveStatus(id: string, isActive: boolean): Promise<SpecialistEntity> {
    const specialist = await this.specialistRepository.findById(id);
    if (!specialist) throw new NotFoundException('Specialist not found');
    const updatedSpecialist = await this.specialistRepository.update(id, { isActive } as any);
    this.logger.log(`Specialist active status updated: ${id} is now ${isActive ? 'active' : 'inactive'}`);
    
    // 📧 Notify Specialist
    await this.mailService.sendAccountStatusEmail(
        specialist.email,
        specialist.firstName || 'Specialist',
        isActive ? 'ACTIVATED' : 'DEACTIVATED',
        'SPECIALIST'
    );

    return updatedSpecialist;
  }

  async updateSpecialistSuspensionStatus(id: string, isSuspended: boolean): Promise<SpecialistEntity> {
    const specialist = await this.specialistRepository.findById(id);
    if (!specialist) throw new NotFoundException('Specialist not found');
    const updatedSpecialist = await this.specialistRepository.update(id, { isSuspended } as any);
    this.logger.log(`Specialist suspension status updated: ${id} is now ${isSuspended ? 'suspended' : 'not suspended'}`);

    // 📧 Notify Specialist
    await this.mailService.sendAccountStatusEmail(
        specialist.email,
        specialist.firstName || 'Specialist',
        isSuspended ? 'SUSPENDED' : 'UNSUSPENDED',
        'SPECIALIST'
    );

    return updatedSpecialist;
  }
}
