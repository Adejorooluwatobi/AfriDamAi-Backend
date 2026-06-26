import { EnvironmentService } from './environment.service';
export declare class EmailService {
    private readonly envService;
    private readonly logger;
    constructor(envService: EnvironmentService);
    sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
    sendWelcomeEmail(email: string, _firstName: string): Promise<void>;
    sendAppointmentConfirmation(email: string, _appointmentDetails: any): Promise<void>;
}
