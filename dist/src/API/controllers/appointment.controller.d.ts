import { AppointmentService } from '../../domain/services/appointment.service';
import { SpecialistAssignmentService } from '../../domain/services/specialist-assignment.service';
import { SubscriptionValidationService } from '../../domain/services/subscription-validation.service';
import { CreateAppointmentDto } from 'src/application/DTOs/appointments/create-appointment.dto';
import { AssignSpecialistsDto } from 'src/application/DTOs/appointments/assign-specialists.dto';
import { SubscriptionEligibilityDto } from 'src/application/DTOs/appointments/subscription-eligibility.dto';
import { Appointment } from 'src/domain/entities/appointment.entity';
export declare class AppointmentController {
    private readonly appointmentService;
    private readonly subscriptionValidationService;
    private readonly specialistAssignmentService;
    constructor(appointmentService: AppointmentService, subscriptionValidationService: SubscriptionValidationService, specialistAssignmentService: SpecialistAssignmentService);
    createAppointment(req: any, createAppointmentDto: CreateAppointmentDto): Promise<any>;
    checkEligibility(req: any): Promise<SubscriptionEligibilityDto>;
    getAllAppointments(): Promise<Appointment[]>;
    getUserAppointments(req: any): Promise<Appointment[]>;
    getMyAcceptedAppointments(req: any): Promise<Appointment[]>;
    getPricing(): Promise<void>;
    scheduleAppointment(id: string, body: {
        scheduledAt: Date;
        notes?: string;
    }): Promise<Appointment>;
    updateAppointmentStatus(id: string, body: {
        status: string;
    }): Promise<Appointment>;
    assignSpecialists(id: string, dto: AssignSpecialistsDto, req: any): Promise<import("../../domain/entities/specialist-assignment.entity").SpecialistAssignmentEntity[]>;
    acceptAssignment(assignmentId: string, req: any): Promise<any>;
    declineAssignment(assignmentId: string, req: any): Promise<import("../../domain/entities/specialist-assignment.entity").SpecialistAssignmentEntity>;
    getMyAssignments(req: any): Promise<any[]>;
    getAllAssignments(): Promise<import("../../domain/entities/specialist-assignment.entity").SpecialistAssignmentEntity[]>;
    getAssignmentsForAppointment(id: string): Promise<import("../../domain/entities/specialist-assignment.entity").SpecialistAssignmentEntity[]>;
    completeAppointment(id: string, req: any): Promise<Appointment>;
    cancelAppointment(id: string, req: any): Promise<Appointment>;
    getAppointmentById(id: string, req: any): Promise<Appointment>;
    getActiveAppointmentWith(otherUserId: string, req: any): Promise<any>;
    createMeetForAppointment(body: {
        otherUserId: string;
    }, req: any): Promise<{
        meetLink: string;
        appointmentId: string;
    }>;
    startSession(id: string, req: any): Promise<Appointment & {
        chatId?: string;
    }>;
    joinSession(id: string, req: any): Promise<{
        meetLink: string;
    }>;
    endSession(id: string, req: any): Promise<Appointment>;
    requestEndSession(id: string, req: any): Promise<Appointment>;
    approveEndSession(id: string, req: any): Promise<Appointment>;
    declineEndSession(id: string, req: any): Promise<Appointment>;
    extendSession(id: string, req: any): Promise<Appointment>;
    revertPayout(id: string): Promise<{
        succeeded: boolean;
        message: string;
    }>;
}
