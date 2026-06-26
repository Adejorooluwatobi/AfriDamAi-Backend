"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const appointment_service_1 = require("../../domain/services/appointment.service");
const specialist_assignment_service_1 = require("../../domain/services/specialist-assignment.service");
const subscription_validation_service_1 = require("../../domain/services/subscription-validation.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_role_guard_1 = require("../auth/guards/admin-role.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const create_appointment_dto_1 = require("../../application/DTOs/appointments/create-appointment.dto");
const assign_specialists_dto_1 = require("../../application/DTOs/appointments/assign-specialists.dto");
const subscription_eligibility_dto_1 = require("../../application/DTOs/appointments/subscription-eligibility.dto");
const appointment_entity_1 = require("../../domain/entities/appointment.entity");
const client_1 = require("@prisma/client");
let AppointmentController = class AppointmentController {
    constructor(appointmentService, subscriptionValidationService, specialistAssignmentService) {
        this.appointmentService = appointmentService;
        this.subscriptionValidationService = subscriptionValidationService;
        this.specialistAssignmentService = specialistAssignmentService;
    }
    async createAppointment(req, createAppointmentDto) {
        const params = {
            userId: req.user.id,
            subscriptionId: createAppointmentDto.subscriptionId,
            specialty: createAppointmentDto.specialty,
            scheduledAt: createAppointmentDto.scheduledAt ? new Date(createAppointmentDto.scheduledAt) : undefined,
            notes: createAppointmentDto.notes,
            organizationId: createAppointmentDto.organizationId,
        };
        return this.appointmentService.createAppointment(params);
    }
    async checkEligibility(req) {
        const eligibility = await this.subscriptionValidationService.validateSubscriptionForAppointment(req.user.id);
        return {
            eligible: eligibility.eligible,
            reason: eligibility.reason,
            daysRemaining: eligibility.daysRemaining,
            remainingSessions: eligibility.subscription?.remainingSessions ?? undefined,
        };
    }
    async getAllAppointments() {
        return this.appointmentService.findAll();
    }
    async getUserAppointments(req) {
        return this.appointmentService.getUserAppointments(req.user.id);
    }
    async getMyAcceptedAppointments(req) {
        return this.appointmentService.getSpecialistAppointments(req.user.id);
    }
    async getPricing() {
        throw new Error('This endpoint is no longer supported directly by AppointmentController. Please use PricingPlanController to get pricing plans.');
    }
    async scheduleAppointment(id, body) {
        return this.appointmentService.scheduleAppointment(id, new Date(body.scheduledAt), body.notes);
    }
    async updateAppointmentStatus(id, body) {
        return this.appointmentService.updateAppointmentStatus(id, body.status);
    }
    async assignSpecialists(id, dto, req) {
        return this.specialistAssignmentService.assignSpecialists(id, dto.specialistIds, req.user.id);
    }
    async acceptAssignment(assignmentId, req) {
        return this.specialistAssignmentService.acceptAssignment(assignmentId, req.user.id);
    }
    async declineAssignment(assignmentId, req) {
        return this.specialistAssignmentService.declineAssignment(assignmentId, req.user.id);
    }
    async getMyAssignments(req) {
        return this.specialistAssignmentService.getSpecialistAssignments(req.user.id);
    }
    async getAllAssignments() {
        return this.specialistAssignmentService.findAllAssignments();
    }
    async getAssignmentsForAppointment(id) {
        return this.specialistAssignmentService.getAssignmentsForAppointment(id);
    }
    async completeAppointment(id, req) {
        const isSpecialist = req.user.type !== undefined;
        return this.appointmentService.completeAppointment(id, req.user.id, isSpecialist);
    }
    async cancelAppointment(id, req) {
        const isSpecialist = req.user.type !== undefined;
        return this.appointmentService.cancelAppointment(id, req.user.id);
    }
    async getAppointmentById(id, req) {
        return this.appointmentService.getAppointmentById(id);
    }
    async getActiveAppointmentWith(otherUserId, req) {
        return this.appointmentService.getActiveAppointmentBetween(req.user.id, otherUserId);
    }
    async createMeetForAppointment(body, req) {
        return this.appointmentService.createMeetingForParticipants(req.user.id, body.otherUserId);
    }
    async startSession(id, req) {
        return this.appointmentService.startSession(id, req.user.id);
    }
    async joinSession(id, req) {
        const appointment = await this.appointmentService.getAppointmentById(id);
        if (appointment.userId !== req.user.id && appointment.specialistId !== req.user.id) {
            const isAdmin = req.user.type !== undefined && req.user.type.includes('ADMIN');
            if (!isAdmin) {
                throw new common_1.ForbiddenException('You are not a participant in this appointment');
            }
        }
        return { meetLink: appointment.meetingLink };
    }
    async endSession(id, req) {
        return this.appointmentService.endSession(id, req.user.id);
    }
    async requestEndSession(id, req) {
        return this.appointmentService.requestEndSession(id, req.user.id);
    }
    async approveEndSession(id, req) {
        return this.appointmentService.approveEndSession(id, req.user.id);
    }
    async declineEndSession(id, req) {
        return this.appointmentService.declineEndSession(id, req.user.id);
    }
    async extendSession(id, req) {
        return this.appointmentService.extendSession(id, req.user.id);
    }
    async revertPayout(id) {
        await this.appointmentService.revertSpecialistPayout(id);
        return { succeeded: true, message: 'Payout reverted successfully' };
    }
};
exports.AppointmentController = AppointmentController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create appointment',
        description: 'Create a new appointment. Requires an active subscription with available sessions or valid duration. Validates eligibility before creation.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Appointment and pending transaction created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - No active subscription or eligibility failed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_appointment_dto_1.CreateAppointmentDto]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "createAppointment", null);
__decorate([
    (0, common_1.Get)('eligibility'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if user is eligible to book an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Eligibility status retrieved', type: subscription_eligibility_dto_1.SubscriptionEligibilityDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "checkEligibility", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all appointments (Admin)',
        description: 'Retrieve all appointments in the system. Typically used by admins for monitoring and management.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointments retrieved successfully', type: [appointment_entity_1.Appointment] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAllAppointments", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my appointments',
        description: 'Retrieve all appointments for the authenticated user'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointments retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getUserAppointments", null);
__decorate([
    (0, common_1.Get)('specialist/me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my specialist appointments (accepted/in-progress)',
        description: 'Retrieve all confirmed and in-progress appointments assigned to the authenticated specialist.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointments retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getMyAcceptedAppointments", null);
__decorate([
    (0, common_1.Get)('pricing'),
    (0, swagger_1.ApiOperation)({ summary: 'Get live appointment pricing information from database' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active pricing plans retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getPricing", null);
__decorate([
    (0, common_1.Put)(':id/schedule'),
    (0, swagger_1.ApiOperation)({
        summary: 'Schedule appointment',
        description: 'Set or update the scheduled date/time for an appointment'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment scheduled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "scheduleAppointment", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update appointment status',
        description: 'Update the status of an appointment (PENDING, CONFIRMED, COMPLETED, CANCELLED)'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "updateAppointmentStatus", null);
__decorate([
    (0, common_1.Post)(':id/assign-specialists'),
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    (0, roles_decorator_1.Roles)(client_1.AdminType.OPERATIONS_ADMIN, client_1.AdminType.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Assign specialists to appointment (Admin only)',
        description: 'Assign one or more specialists to a pending appointment. First specialist to accept gets the appointment. Requires OPERATIONS_ADMIN or SUPER_ADMIN role.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Specialists assigned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid appointment or specialists' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment or specialist not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_specialists_dto_1.AssignSpecialistsDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "assignSpecialists", null);
__decorate([
    (0, common_1.Post)('assignments/:assignmentId/accept'),
    (0, swagger_1.ApiOperation)({
        summary: 'Accept specialist assignment (Specialist only)',
        description: 'Accept an assignment. This confirms the appointment, cancels other pending assignments, and notifies the user with specialist details.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assignment accepted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Assignment already responded to or appointment not pending' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Can only accept your own assignments' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Assignment not found' }),
    __param(0, (0, common_1.Param)('assignmentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "acceptAssignment", null);
__decorate([
    (0, common_1.Post)('assignments/:assignmentId/decline'),
    (0, swagger_1.ApiOperation)({
        summary: 'Decline specialist assignment (Specialist only)',
        description: 'Decline an assignment. The appointment remains available for other assigned specialists to accept.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assignment declined successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Assignment already responded to' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Can only decline your own assignments' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Assignment not found' }),
    __param(0, (0, common_1.Param)('assignmentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "declineAssignment", null);
__decorate([
    (0, common_1.Get)('assignments/me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my specialist assignments (Specialist only)',
        description: 'Retrieve all assignments for the authenticated specialist. Shows pending, accepted, declined, and cancelled assignments with appointment details.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assignments retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getMyAssignments", null);
__decorate([
    (0, common_1.Get)('assignments'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all specialist assignments (Admin only)',
        description: 'Retrieve all specialist assignments. Requires admin privileges.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assignments retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    (0, roles_decorator_1.Roles)(client_1.AdminType.OPERATIONS_ADMIN, client_1.AdminType.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAllAssignments", null);
__decorate([
    (0, common_1.Get)(':id/assignments'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all specialist assignments for an appointment (Admin only)',
        description: 'Retrieve all specialist assignments for a given appointment. Requires admin privileges.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assignments retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    (0, roles_decorator_1.Roles)(client_1.AdminType.OPERATIONS_ADMIN, client_1.AdminType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAssignmentsForAppointment", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark appointment as completed',
        description: 'Mark an appointment as completed. Can be done by either the user or the assigned specialist. Increments specialist completed appointments counter.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Only confirmed appointments can be completed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Can only complete your own appointments' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "completeAppointment", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cancel appointment',
        description: 'Cancel an appointment. Can be done by either the user or the assigned specialist.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Only confirmed appointments can be cancelled' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Can only cancel your own appointments' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "cancelAppointment", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get appointment by ID',
        description: 'Get an appointment by ID. Can be done by either the user or the assigned specialist.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointmentById", null);
__decorate([
    (0, common_1.Get)('active-with/:otherUserId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get active appointment with another user',
        description: 'Get the active (CONFIRMED or IN_PROGRESS) appointment between the authenticated user and another user (by userId).'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No active appointment found' }),
    __param(0, (0, common_1.Param)('otherUserId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getActiveAppointmentWith", null);
__decorate([
    (0, common_1.Post)('create-meet'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a Google Meet for the active appointment',
        description: 'Generates a Google Meet link for the active appointment with the specified other participant. Either party can call this. Notifies both parties via WebSocket.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meeting link created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No active appointment found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "createMeetForAppointment", null);
__decorate([
    (0, common_1.Post)(':id/start-session'),
    (0, swagger_1.ApiOperation)({
        summary: 'Start appointment session',
        description: 'Start the session for a confirmed appointment. Sets status to IN_PROGRESS and starts the 1-hour timer.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Appointment must be CONFIRMED or session already active' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - User not a participant' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "startSession", null);
__decorate([
    (0, common_1.Get)(':id/join'),
    (0, swagger_1.ApiOperation)({
        summary: 'Join appointment session',
        description: 'Get the Google Meet link for an active appointment session.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meet link retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - User not a participant' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "joinSession", null);
__decorate([
    (0, common_1.Post)(':id/end-session'),
    (0, swagger_1.ApiOperation)({
        summary: 'End appointment session',
        description: 'Manually end the session for an in-progress appointment. Sets status to COMPLETED.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session ended successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Session is not in progress' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - User not a participant' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "endSession", null);
__decorate([
    (0, common_1.Post)(':id/request-end'),
    (0, swagger_1.ApiOperation)({
        summary: 'Request to end session',
        description: 'Request to end the session. Requires approval from the other party.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'End session request sent' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "requestEndSession", null);
__decorate([
    (0, common_1.Post)(':id/approve-end'),
    (0, swagger_1.ApiOperation)({
        summary: 'Approve end session request',
        description: 'Approve a pending end session request.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session ended successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "approveEndSession", null);
__decorate([
    (0, common_1.Post)(':id/decline-end'),
    (0, swagger_1.ApiOperation)({
        summary: 'Decline end session request',
        description: 'Decline a pending end session request.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'End session request declined' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "declineEndSession", null);
__decorate([
    (0, common_1.Post)(':id/extend-session'),
    (0, swagger_1.ApiOperation)({
        summary: 'Extend session',
        description: 'Extend the current session. Only available to the Specialist.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session extended successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "extendSession", null);
__decorate([
    (0, common_1.Post)(':id/revert-payout'),
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    (0, roles_decorator_1.Roles)(client_1.AdminType.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Revert specialist payout (Admin Only)',
        description: 'Reverts the payout credited to a specialist for a completed appointment. Only SUPER_ADMIN can perform this.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payout reverted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment or payout not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "revertPayout", null);
exports.AppointmentController = AppointmentController = __decorate([
    (0, swagger_1.ApiTags)('Appointments'),
    (0, common_1.Controller)('appointments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [appointment_service_1.AppointmentService,
        subscription_validation_service_1.SubscriptionValidationService,
        specialist_assignment_service_1.SpecialistAssignmentService])
], AppointmentController);
//# sourceMappingURL=appointment.controller.js.map