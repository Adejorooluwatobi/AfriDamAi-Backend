import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../config/prisma.service';
import { INotificationRepository } from '../../../domain/repositories/notification.repository.interface';
import { NotificationEntity } from '../../../domain/entities/notification.entity';
import { NotificationMapper } from '../../mappers/notification.mapper';
import { CreateNotificationParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<NotificationEntity | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    return notification ? NotificationMapper.toDomain(notification) : null;
  }

  async findByUserId(userId: string): Promise<NotificationEntity[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return NotificationMapper.toDomainArray(notifications);
  }

  async findByAdminId(adminId: string): Promise<NotificationEntity[]> {
    const notifications = await this.prisma.notification.findMany({
        where: { adminId },
        orderBy: { createdAt: 'desc' },
    });
    return NotificationMapper.toDomainArray(notifications);
  }

  async findByVendorId(vendorId: string): Promise<NotificationEntity[]> {
    const notifications = await this.prisma.notification.findMany({
        where: { vendorId },
        orderBy: { createdAt: 'desc' },
    });
    return NotificationMapper.toDomainArray(notifications);
  }

  async findBySpecialistId(specialistId: string): Promise<NotificationEntity[]> {
    const notifications = await this.prisma.notification.findMany({
        where: { specialistId },
        orderBy: { createdAt: 'desc' },
    });
    return NotificationMapper.toDomainArray(notifications);
  }

  async findAll(): Promise<NotificationEntity[]> {
    const notifications = await this.prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return NotificationMapper.toDomainArray(notifications);
  }

  async create(params: CreateNotificationParams): Promise<NotificationEntity> {
    const notification = await this.prisma.notification.create({
      data: {
        userId: params.userId,
        adminId: params.adminId,
        vendorId: params.vendorId,
        specialistId: params.specialistId,
        isGeneral: params.isGeneral ?? false,
        title: params.title,
        message: params.message,
      },
    });
    return NotificationMapper.toDomain(notification);
  }

  async markAsRead(id: string): Promise<NotificationEntity> {
    const notification = await this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return NotificationMapper.toDomain(notification);
  }

  async markAllAsRead(id: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        OR: [
          { userId: id },
          { adminId: id },
          { specialistId: id },
          { vendorId: id },
        ],
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notification.delete({
      where: { id },
    });
  }
}
