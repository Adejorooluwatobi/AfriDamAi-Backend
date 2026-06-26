import { Controller, Get, Put, Param, UseGuards, Request, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard'; // Assuming this guard exists
import { Roles } from '../auth/decorators/roles.decorator'; // Assuming this decorator exists
import { AdminType, WithdrawalStatus } from '@prisma/client';
import { WithdrawalRequestService } from 'src/domain/services/withdrawal-request.service';
import { WithdrawalRequestEntity } from 'src/domain/entities/withdrawal-request.entity';
import { UpdateWithdrawalRequestParams } from 'src/utils/type';

@ApiTags('Admin Withdrawals')
@Controller('admin/withdrawals')
@UseGuards(JwtAuthGuard, AdminRoleGuard) // Protect with JWT and Admin Role Guard
@ApiBearerAuth()
@Roles(AdminType.SUPER_ADMIN, AdminType.FINANCE_ADMIN) // Only Super Admins and Finance Admins can manage withdrawals
export class AdminWithdrawalController {
  constructor(
    private readonly withdrawalRequestService: WithdrawalRequestService,
  ) {}

  @Get('pending')
  @ApiOperation({ summary: 'Admin: Get all pending withdrawal requests' })
  @ApiResponse({ status: 200, description: 'Pending withdrawal requests retrieved successfully', type: [WithdrawalRequestEntity] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getPendingWithdrawalRequests(): Promise<WithdrawalRequestEntity[]> {
    return this.withdrawalRequestService.getPendingWithdrawalRequests();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: Get a withdrawal request by ID' })
  @ApiResponse({ status: 200, description: 'Withdrawal request retrieved successfully', type: WithdrawalRequestEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Withdrawal request not found' })
  async getWithdrawalRequestById(@Param('id') id: string): Promise<WithdrawalRequestEntity> {
    return this.withdrawalRequestService.getWithdrawalRequestById(id);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Admin: Approve a pending withdrawal request' })
  @ApiResponse({ status: 200, description: 'Withdrawal request approved successfully', type: WithdrawalRequestEntity })
  @ApiResponse({ status: 400, description: 'Bad request (e.g., request not pending, insufficient funds)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Withdrawal request not found' })
  async approveWithdrawal(
    @Param('id') requestId: string,
    @Request() req,
    @Body('adminNotes') adminNotes?: string,
  ): Promise<WithdrawalRequestEntity> {
    return this.withdrawalRequestService.approveWithdrawal(requestId, req.user.id, adminNotes);
  }

  @Put(':id/mark-paid')
  @ApiOperation({ summary: 'Admin: Mark an approved withdrawal request as paid' })
  @ApiResponse({ status: 200, description: 'Withdrawal request marked as paid successfully', type: WithdrawalRequestEntity })
  @ApiResponse({ status: 400, description: 'Bad request (e.g., request not approved)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Withdrawal request not found' })
  async markWithdrawalAsPaid(
    @Param('id') requestId: string,
    @Request() req,
    @Body('adminNotes') adminNotes?: string,
  ): Promise<WithdrawalRequestEntity> {
    return this.withdrawalRequestService.markWithdrawalAsPaid(requestId, req.user.id, adminNotes);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Admin: Reject a pending withdrawal request' })
  @ApiResponse({ status: 200, description: 'Withdrawal request rejected successfully', type: WithdrawalRequestEntity })
  @ApiResponse({ status: 400, description: 'Bad request (e.g., request not pending)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Withdrawal request not found' })
  async rejectWithdrawal(
    @Param('id') requestId: string,
    @Request() req,
    @Body('reason') reason: string,
  ): Promise<WithdrawalRequestEntity> {
    if (!reason) {
      throw new BadRequestException('Rejection reason is required.');
    }
    return this.withdrawalRequestService.rejectWithdrawal(requestId, req.user.id, reason);
  }
}
