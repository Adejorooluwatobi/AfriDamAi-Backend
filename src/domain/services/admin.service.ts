import { ConflictException, Injectable, NotFoundException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AdminEntity } from '../entities/admin.entity';
import { CreateAdminParams } from 'src/utils/type';
import type { IAdminRepository } from '../repositories/admin.repository.interface';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';

@Injectable()
export class AdminService {
  constructor(
    @Inject('IAdminRepository') private readonly adminRepository: IAdminRepository,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async createAdmin(adminDetails: CreateAdminParams): Promise<AdminEntity> {
    if (!adminDetails.email || !adminDetails.password) {
      throw new NotFoundException('Email and password are required');
    }
    const existingAdmin = await this.adminRepository.findByEmail(adminDetails.email);
    if (existingAdmin) {
      throw new ConflictException(`Admin with email ${adminDetails.email} already exists`);
    }
    const hashedPassword = await bcrypt.hash(adminDetails.password, 10);
    const newAdmin = await this.adminRepository.create({
      ...adminDetails,
      password: hashedPassword,
      isActive: true,
    });
    console.log('Admin created successfully:', newAdmin.id);
    return newAdmin;
  }

  async findAllAdmin(): Promise<AdminEntity[]> {
    const admins = await this.adminRepository.findAll();
    return admins;
  }

  async findOneAdmin(id: string): Promise<AdminEntity | null> {
    const admin = await this.adminRepository.findById(id);
    return admin;
  }

  async updateAdmin(id: string, updateAdminDetails: Partial<AdminEntity>): Promise<AdminEntity> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }

    if (updateAdminDetails.password) {
      updateAdminDetails.password = await bcrypt.hash(updateAdminDetails.password, 10);
    }

    const finalUpdate = {
      ...admin,
      ...updateAdminDetails,
    };

    const updatedAdmin = await this.adminRepository.update(id, finalUpdate);
    console.log('Admin updated successfully:', updatedAdmin.id);
    return updatedAdmin;
  }

    async updateAdminActiveStatus(id: string, isActive: boolean): Promise<AdminEntity> {
        const admin = await this.adminRepository.findById(id);
        if (!admin) throw new NotFoundException('Admin not found');
        const updated = await this.adminRepository.update(id, { isActive } as any);
        
        // 📧 Notify Admin
        await this.mailService.sendAccountStatusEmail(
            admin.email,
            admin.firstName || 'Administrator',
            isActive ? 'ACTIVATED' : 'DEACTIVATED',
            'ADMIN'
        );
        
        return updated;
    }

    async updateAdminSuspensionStatus(id: string, isSuspended: boolean): Promise<AdminEntity> {
        const admin = await this.adminRepository.findById(id);
        if (!admin) throw new NotFoundException('Admin not found');
        const updated = await this.adminRepository.update(id, { isSuspended } as any);

        // 📧 Notify Admin
        await this.mailService.sendAccountStatusEmail(
            admin.email,
            admin.firstName || 'Administrator',
            isSuspended ? 'SUSPENDED' : 'UNSUSPENDED',
            'ADMIN'
        );

        return updated;
    }

  async deleteAdmin(id: string): Promise<void> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    await this.adminRepository.delete(id);
    console.log('Admin deleted successfully:', admin.id);
  }

    async findByEmail(email: string): Promise<AdminEntity | null> {

      const admin = await this.adminRepository.findByEmail(email);

      return admin;

    }

  

    async findByRole(role: any): Promise<AdminEntity[]> {

      const admins = await this.adminRepository.findByRole(role);

      return admins;

    }

    /**
     * 🚀 CEO LOGIC: Retrieve Webhook Logs for troubleshooting
     */
    async getWebhookLogs() {
      return this.prisma.webhookLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100, // Limit to last 100 logs
      });
    }

  }

  