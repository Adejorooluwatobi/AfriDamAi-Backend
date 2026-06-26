import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentService } from '../../domain/services/appointment.service';
import { SpecialistAssignmentService } from '../../domain/services/specialist-assignment.service';
import { SubscriptionValidationService } from '../../domain/services/subscription-validation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateAppointmentDto } from 'src/application/DTOs/appointments/create-appointment.dto';
import { AssignSpecialistsDto } from 'src/application/DTOs/appointments/assign-specialists.dto';
import { SubscriptionEligibilityDto } from 'src/application/DTOs/appointments/subscription-eligibility.dto';
import { Appointment } from 'src/domain/entities/appointment.entity';
import { AdminType, SpecialistType } from '@prisma/client';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly subscriptionValidationService: SubscriptionValidationService,
    private readonly specialistAssignmentService: SpecialistAssignmentService,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create appointment',
    description: 'Create a new appointment. Requires an active subscription with available sessions or valid duration. Validates eligibility before creation.'
  })
  @ApiResponse({ status: 201, description: 'Appointment and pending transaction created' })
  @ApiResponse({ status: 400, description: 'Bad request - No active subscription or eligibility failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createAppointment(
    @Request() req,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    const params = {
      userId: req.user.id,
      subscriptionId: createAppointmentDto.subscriptionId,
      specialty: createAppointmentDto.specialty as SpecialistType,
      scheduledAt: createAppointmentDto.scheduledAt ? new Date(createAppointmentDto.scheduledAt) : undefined,
      notes: createAppointmentDto.notes,
      organizationId: createAppointmentDto.organizationId,
    };
    return this.appointmentService.createAppointment(params as any);
  }

  @Get('eligibility')
  @ApiOperation({ summary: 'Check if user is eligible to book an appointment' })
  @ApiResponse({ status: 200, description: 'Eligibility status retrieved', type: SubscriptionEligibilityDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkEligibility(@Request() req): Promise<SubscriptionEligibilityDto> {
    const eligibility = await this.subscriptionValidationService.validateSubscriptionForAppointment(req.user.id);
    return {
      eligible: eligibility.eligible,
      reason: eligibility.reason,
      daysRemaining: eligibility.daysRemaining,
      remainingSessions: eligibility.subscription?.remainingSessions ?? undefined,
    };
  }

  @Get('all')
  @ApiOperation({ 
    summary: 'Get all appointments (Admin)',
    description: 'Retrieve all appointments in the system. Typically used by admins for monitoring and management.'
  })
  @ApiResponse({ status: 200, description: 'Appointments retrieved successfully', type: [Appointment] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllAppointments() {
    return this.appointmentService.findAll();
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get my appointments',
    description: 'Retrieve all appointments for the authenticated user'
  })
  @ApiResponse({ status: 200, description: 'Appointments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserAppointments(@Request() req) {
    return this.appointmentService.getUserAppointments(req.user.id);
  }

  @Get('specialist/me')
  @ApiOperation({ 
    summary: 'Get my specialist appointments (accepted/in-progress)',
    description: 'Retrieve all confirmed and in-progress appointments assigned to the authenticated specialist.'
  })
  @ApiResponse({ status: 200, description: 'Appointments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyAcceptedAppointments(@Request() req) {
    return this.appointmentService.getSpecialistAppointments(req.user.id);
  }

  @Get('pricing')
  @ApiOperation({ summary: 'Get live appointment pricing information from database' })
  @ApiResponse({ status: 200, description: 'Active pricing plans retrieved' })
  async getPricing() {
    // This method needs to be removed or adjusted as pricingPlanService is no longer injected
    // For now, I will remove it as it depends on pricingPlanService
    throw new Error('This endpoint is no longer supported directly by AppointmentController. Please use PricingPlanController to get pricing plans.');
  }

  @Put(':id/schedule')
  @ApiOperation({ 
    summary: 'Schedule appointment',
    description: 'Set or update the scheduled date/time for an appointment'
  })
  @ApiResponse({ status: 200, description: 'Appointment scheduled successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async scheduleAppointment(
    @Param('id') id: string,
    @Body() body: { scheduledAt: Date; notes?: string },
  ) {
    return this.appointmentService.scheduleAppointment(
      id,
      new Date(body.scheduledAt),
      body.notes,
    );
  }

  @Put(':id/status')
  @ApiOperation({ 
    summary: 'Update appointment status',
    description: 'Update the status of an appointment (PENDING, CONFIRMED, COMPLETED, CANCELLED)'
  })
  @ApiResponse({ status: 200, description: 'Appointment status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async updateAppointmentStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.appointmentService.updateAppointmentStatus(
      id,
      body.status as any,
    );
  }

  @Post(':id/assign-specialists')
  @UseGuards(AdminRoleGuard)
  @Roles(AdminType.OPERATIONS_ADMIN, AdminType.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Assign specialists to appointment (Admin only)',
    description: 'Assign one or more specialists to a pending appointment. First specialist to accept gets the appointment. Requires OPERATIONS_ADMIN or SUPER_ADMIN role.'
  })
  @ApiResponse({ status: 201, description: 'Specialists assigned successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid appointment or specialists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Appointment or specialist not found' })
  async assignSpecialists(
    @Param('id') id: string,
    @Body() dto: AssignSpecialistsDto,
    @Request() req,
  ) {
    return this.specialistAssignmentService.assignSpecialists(
      id,
      dto.specialistIds,
      req.user.id,
    );
  }

  @Post('assignments/:assignmentId/accept')
  @ApiOperation({ 
    summary: 'Accept specialist assignment (Specialist only)',
    description: 'Accept an assignment. This confirms the appointment, cancels other pending assignments, and notifies the user with specialist details.'
  })
  @ApiResponse({ status: 200, description: 'Assignment accepted successfully' })
  @ApiResponse({ status: 400, description: 'Assignment already responded to or appointment not pending' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Can only accept your own assignments' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async acceptAssignment(
    @Param('assignmentId') assignmentId: string,
    @Request() req,
  ) {
    return this.specialistAssignmentService.acceptAssignment(assignmentId, req.user.id);
  }

  @Post('assignments/:assignmentId/decline')
  @ApiOperation({ 
    summary: 'Decline specialist assignment (Specialist only)',
    description: 'Decline an assignment. The appointment remains available for other assigned specialists to accept.'
  })
  @ApiResponse({ status: 200, description: 'Assignment declined successfully' })
  @ApiResponse({ status: 400, description: 'Assignment already responded to' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Can only decline your own assignments' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async declineAssignment(
    @Param('assignmentId') assignmentId: string,
    @Request() req,
  ) {
    return this.specialistAssignmentService.declineAssignment(assignmentId, req.user.id);
  }

  @Get('assignments/me')
  @ApiOperation({ 
    summary: 'Get my specialist assignments (Specialist only)',
    description: 'Retrieve all assignments for the authenticated specialist. Shows pending, accepted, declined, and cancelled assignments with appointment details.'
  })
  @ApiResponse({ status: 200, description: 'Assignments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyAssignments(@Request() req) {
    return this.specialistAssignmentService.getSpecialistAssignments(req.user.id);
  }

  @Get('assignments')
  @ApiOperation({ 
    summary: 'Get all specialist assignments (Admin only)',
    description: 'Retrieve all specialist assignments. Requires admin privileges.'
  })
  @ApiResponse({ status: 200, description: 'Assignments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminRoleGuard)
  @Roles(AdminType.OPERATIONS_ADMIN, AdminType.SUPER_ADMIN)
  async getAllAssignments() {
    return this.specialistAssignmentService.findAllAssignments();
  }

  @Get(':id/assignments')
  @ApiOperation({ 
    summary: 'Get all specialist assignments for an appointment (Admin only)',
    description: 'Retrieve all specialist assignments for a given appointment. Requires admin privileges.'
  })
  @ApiResponse({ status: 200, description: 'Assignments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminRoleGuard)
  @Roles(AdminType.OPERATIONS_ADMIN, AdminType.SUPER_ADMIN)
  async getAssignmentsForAppointment(@Param('id') id: string) {
    return this.specialistAssignmentService.getAssignmentsForAppointment(id);
  }

  @Put(':id/complete')
  @ApiOperation({ 
    summary: 'Mark appointment as completed',
    description: 'Mark an appointment as completed. Can be done by either the user or the assigned specialist. Increments specialist completed appointments counter.'
  })
  @ApiResponse({ status: 200, description: 'Appointment completed successfully' })
  @ApiResponse({ status: 400, description: 'Only confirmed appointments can be completed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Can only complete your own appointments' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async completeAppointment(
    @Param('id') id: string,
    @Request() req,
  ) {
    // Check if user is specialist (has 'type' field) or regular user
    const isSpecialist = req.user.type !== undefined;
    return this.appointmentService.completeAppointment(id, req.user.id, isSpecialist);
  }

  @Put(':id/cancel')
  @ApiOperation({
    summary: 'Cancel appointment',
    description: 'Cancel an appointment. Can be done by either the user or the assigned specialist.'
  })
  @ApiResponse({ status: 200, description: 'Appointment cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Only confirmed appointments can be cancelled' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Can only cancel your own appointments' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async cancelAppointment(
    @Param('id') id: string,
    @Request() req,
  ) {
    // Check if user is specialist (has 'type' field) or regular user
    const isSpecialist = req.user.type !== undefined;
    return this.appointmentService.cancelAppointment(id, req.user.id);
  }

@Get(':id')
  @ApiOperation({
    summary: 'Get appointment by ID',
    description: 'Get an appointment by ID. Can be done by either the user or the assigned specialist.'
  })
  @ApiResponse({ status: 200, description: 'Appointment retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async getAppointmentById(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.appointmentService.getAppointmentById(id);
  }

  @Get('active-with/:otherUserId')
  @ApiOperation({
    summary: 'Get active appointment with another user',
    description: 'Get the active (CONFIRMED or IN_PROGRESS) appointment between the authenticated user and another user (by userId).'
  })
  @ApiResponse({ status: 200, description: 'Appointment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No active appointment found' })
  async getActiveAppointmentWith(
    @Param('otherUserId') otherUserId: string,
    @Request() req,
  ) {
    return this.appointmentService.getActiveAppointmentBetween(req.user.id, otherUserId);
  }

  @Post('create-meet')
  @ApiOperation({
    summary: 'Create a Google Meet for the active appointment',
    description: 'Generates a Google Meet link for the active appointment with the specified other participant. Either party can call this. Notifies both parties via WebSocket.'
  })
  @ApiResponse({ status: 200, description: 'Meeting link created successfully' })
  @ApiResponse({ status: 404, description: 'No active appointment found' })
  async createMeetForAppointment(
    @Body() body: { otherUserId: string },
    @Request() req,
  ) {
    return this.appointmentService.createMeetingForParticipants(req.user.id, body.otherUserId);
  }

  @Post(':id/start-session')
  @ApiOperation({ 
    summary: 'Start appointment session',
    description: 'Start the session for a confirmed appointment. Sets status to IN_PROGRESS and starts the 1-hour timer.'
  })
  @ApiResponse({ status: 200, description: 'Session started successfully' })
  @ApiResponse({ status: 400, description: 'Appointment must be CONFIRMED or session already active' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - User not a participant' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async startSession(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.appointmentService.startSession(id, req.user.id);
  }

  @Get(':id/join')
  @ApiOperation({ 
    summary: 'Join appointment session',
    description: 'Get the Google Meet link for an active appointment session.'
  })
  @ApiResponse({ status: 200, description: 'Meet link retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - User not a participant' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async joinSession(
    @Param('id') id: string,
    @Request() req,
  ) {
    const appointment = await this.appointmentService.getAppointmentById(id);
    // Check if user is participant (or admin, but for now just participant)
    if (appointment.userId !== req.user.id && appointment.specialistId !== req.user.id) {
        // If not a participant, we could check if they are an admin, but let's keep it simple for now based on the original logic
        const isAdmin = req.user.type !== undefined && req.user.type.includes('ADMIN');
        if (!isAdmin) {
             throw new ForbiddenException('You are not a participant in this appointment');
        }
    }
    return { meetLink: appointment.meetingLink };
  }

  @Post(':id/end-session')
  @ApiOperation({ 
    summary: 'End appointment session',
    description: 'Manually end the session for an in-progress appointment. Sets status to COMPLETED.'
  })
  @ApiResponse({ status: 200, description: 'Session ended successfully' })
  @ApiResponse({ status: 400, description: 'Session is not in progress' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - User not a participant' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async endSession(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.appointmentService.endSession(id, req.user.id);
  }

  @Post(':id/request-end')
  @ApiOperation({ 
    summary: 'Request to end session',
    description: 'Request to end the session. Requires approval from the other party.'
  })
  @ApiResponse({ status: 200, description: 'End session request sent' })
  async requestEndSession(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.appointmentService.requestEndSession(id, req.user.id);
  }

  @Post(':id/approve-end')
  @ApiOperation({ 
    summary: 'Approve end session request',
    description: 'Approve a pending end session request.'
  })
  @ApiResponse({ status: 200, description: 'Session ended successfully' })
  async approveEndSession(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.appointmentService.approveEndSession(id, req.user.id);
  }

  @Post(':id/decline-end')
  @ApiOperation({ 
    summary: 'Decline end session request',
    description: 'Decline a pending end session request.'
  })
  @ApiResponse({ status: 200, description: 'End session request declined' })
  async declineEndSession(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.appointmentService.declineEndSession(id, req.user.id);
  }

  @Post(':id/extend-session')
  @ApiOperation({ 
    summary: 'Extend session',
    description: 'Extend the current session. Only available to the Specialist.'
  })
  @ApiResponse({ status: 200, description: 'Session extended successfully' })
  async extendSession(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.appointmentService.extendSession(id, req.user.id);
  }

  @Post(':id/revert-payout')
  @UseGuards(AdminRoleGuard)
  @Roles(AdminType.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Revert specialist payout (Admin Only)',
    description: 'Reverts the payout credited to a specialist for a completed appointment. Only SUPER_ADMIN can perform this.'
  })
  @ApiResponse({ status: 200, description: 'Payout reverted successfully' })
  @ApiResponse({ status: 404, description: 'Appointment or payout not found' })
  async revertPayout(@Param('id') id: string) {
    await this.appointmentService.revertSpecialistPayout(id);
    return { succeeded: true, message: 'Payout reverted successfully' };
  }
}