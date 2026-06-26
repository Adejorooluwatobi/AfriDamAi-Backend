import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AppointmentService } from './appointment.service';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class SessionCronService {
  private readonly logger = new Logger(SessionCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly appointmentService: AppointmentService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleExpiredSessions() {
    this.logger.log('Checking for expired appointment sessions...');

    const now = new Date();

    // Find sessions that are IN_PROGRESS and have passed their endedAt time
    const expiredSessions = await this.prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.IN_PROGRESS,
        endedAt: {
          lt: now,
        },
        isExtended: false, // Don't auto-stop if specialist extended it
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (expiredSessions.length > 0) {
      this.logger.log(`Found ${expiredSessions.length} expired sessions. Processing...`);

      for (const session of expiredSessions) {
        try {
          await this.appointmentService.endSession(session.id, 'SYSTEM');
          this.logger.log(`Automatically ended expired session ${session.id}`);
        } catch (error) {
          this.logger.error(`Failed to automatically end session ${session.id}`, error);
        }
      }
    } else {
      this.logger.log('No expired sessions found.');
    }
  }
}
