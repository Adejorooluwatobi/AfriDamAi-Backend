import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from 'src/domain/services/subscription.service';
import { CreateSubscriptionDto } from 'src/application/DTOs/subscriptions/create-subscription.dto';
import { UpdateSubscriptionDto } from 'src/application/DTOs/subscriptions/update-subscription.dto';
import { GrantSubscriptionDto } from 'src/application/DTOs/subscriptions/grant-subscription.dto';
import { JwtAuthGuard } from 'src/API/auth/guards/jwt-auth.guard';
import { AdminGuard, AdminRoleGuard } from 'src/API/auth/guards';
import { Roles } from 'src/API/auth/decorators/roles.decorator';
import { AdminType } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ValidationPipe, Query } from '@nestjs/common';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get current active subscription for logged-in user' })
  async getMyActiveSubscription(@Request() req) {
    return this.subscriptionService.findActiveSubscription(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all my subscriptions history' })
  async getMySubscriptions(@Request() req) {
    return this.subscriptionService.getUserSubscriptions(req.user.id);
  }

  // 🛡️ Admin or System Internal Use primarily, but exposed for flexibility
  @Post()
  @ApiOperation({ summary: 'Manually create a subscription (Admin/Internal)' })
  async createSubscription(@Body() createDto: CreateSubscriptionDto) {
    // startDate and endDate will be handled by the service based on PricingPlan
    // Convert startDate and endDate from string to Date objects if they exist
    const params = {
        ...createDto,
        startDate: createDto.startDate ? new Date(createDto.startDate) : undefined,
        endDate: createDto.endDate ? new Date(createDto.endDate) : undefined,
    };
    return this.subscriptionService.createSubscription(params);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update/Cancel subscription' })
  async updateSubscription(@Param('id') id: string, @Body() updateDto: UpdateSubscriptionDto) {
     // Convert startDate and endDate from string to Date objects if they exist
     const params = {
        ...updateDto,
        startDate: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
        endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
    };
    return this.subscriptionService.update(id, params); // Assuming a generic update method in service
  }

  @Patch(':id/auto-renew')
  @ApiOperation({ summary: 'Start or Stop auto-renewal for a subscription' })
  async toggleAutoRenew(@Param('id') id: string, @Body() body: { autoRenew: boolean }) {
    return this.subscriptionService.toggleAutoRenew(id, body.autoRenew);
  }

  @Patch(':id/end-instant-session')
  @ApiOperation({ summary: 'End an instant session subscription' })
  async endInstantSession(@Param('id') id: string) {
    return this.subscriptionService.endInstantSession(id);
  }

  @Patch(':id/sessions')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Manually update remaining sessions (Admin Only)' })
  async updateSessions(@Param('id') id: string, @Body() body: { sessions: number }) {
    return this.subscriptionService.updateRemainingSessions(id, body.sessions);
  }

  @Patch('grant-sessions')
  @UseGuards(AdminRoleGuard)
  @Roles(AdminType.SUPER_ADMIN, AdminType.OPERATIONS_ADMIN)
  @ApiOperation({ 
    summary: 'Grant sessions to a user (Super/Operations Admin Only)',
    description: 'Allows granting sessions to any user, even if they dont have a subscription. Creates a subscription if needed. Access restricted to SUPER_ADMIN and OPERATIONS_ADMIN.'
  })
  async grantSessions(@Body() body: { userId: string; sessions: number }) {
    return this.subscriptionService.grantSessionsToUser(body.userId, body.sessions);
  }

  @Post('grant-plan')
  @UseGuards(AdminRoleGuard)
  @Roles(AdminType.SUPER_ADMIN, AdminType.OPERATIONS_ADMIN)
  @ApiOperation({ 
    summary: 'Grant a full subscription plan to a user (Super/Operations Admin Only)',
    description: 'Creates an active subscription for the user with the specified plan. Access restricted to SUPER_ADMIN and OPERATIONS_ADMIN.'
  })
  async grantPlan(@Body(new ValidationPipe()) grantDto: GrantSubscriptionDto) {
    return this.subscriptionService.adminGrantSubscription(grantDto);
  }

  @Get('users/active')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all users with active subscriptions (Admin Only)' })
  async getActiveUsers() {
    return this.subscriptionService.getUsersWithSubscriptionStatus('ACTIVE');
  }

  @Get('users/expired')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all users with expired subscriptions (Admin Only)' })
  async getExpiredUsers() {
    return this.subscriptionService.getUsersWithSubscriptionStatus('EXPIRED');
  }
}
