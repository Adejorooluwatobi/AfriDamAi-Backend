import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AppointmentService } from './appointment.service';
export declare class SessionCronService {
    private readonly prisma;
    private readonly appointmentService;
    private readonly logger;
    constructor(prisma: PrismaService, appointmentService: AppointmentService);
    handleExpiredSessions(): Promise<void>;
}
