import { 
  Controller, Get, Post, Delete, Body, Param, ValidationPipe, 
  UseGuards, Request, NotFoundException, Patch 
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationService } from 'src/domain/services/notification.service';
import { CreateNotificationDto } from 'src/application/DTOs/notification/create-notification.dto';
import { NotificationMapper } from 'src/infrastructure/mappers/notification.mapper';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a notification (Admin only)' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  async create(@Body(new ValidationPipe()) createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationService.createNotification(createNotificationDto);
    return {
      succeeded: true,
      message: 'Notification created successfully',
      resultData: NotificationMapper.toDto(notification)
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user notifications' })
  async getMyNotifications(@Request() req: any) {
    const userId = this.extractUserId(req.user);
    const userRole = req.user?.role || req.user?.user?.role;
    
    let notifications = [];
    
    // Fetch notifications based on user role
    if (userRole === 'specialist') {
      notifications = await this.notificationService.getSpecialistNotifications(userId);
    } else if (userRole === 'admin') {
      notifications = await this.notificationService.getAdminNotifications(userId);
    } else if (userRole === 'vendor') {
      notifications = await this.notificationService.getVendorNotifications(userId);
    } else {
      notifications = await this.notificationService.getUserNotifications(userId);
    }
    
    return {
      succeeded: true,
      message: 'Notifications retrieved successfully',
      resultData: notifications.map(n => NotificationMapper.toDto(n))
    };
  }

  @Get('all')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notifications (Admin only)' })
  async getAllNotifications() {
    const notifications = await this.notificationService.getAllNotifications();
    return {
      succeeded: true,
      message: 'All notifications retrieved successfully',
      resultData: notifications.map(n => NotificationMapper.toDto(n))
    };
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Param('id') id: string) {
    const notification = await this.notificationService.markAsRead(id);
    return {
      succeeded: true,
      message: 'Notification marked as read',
      resultData: NotificationMapper.toDto(notification)
    };
  }

  @Patch('mark-all-read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@Request() req: any) {
    const userId = this.extractUserId(req.user);
    await this.notificationService.markAllAsRead(userId);
    return {
      succeeded: true,
      message: 'All notifications marked as read'
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a notification' })
  async remove(@Param('id') id: string) {
    await this.notificationService.deleteNotification(id);
    return {
      succeeded: true,
      message: 'Notification deleted successfully'
    };
  }

  private extractUserId(user: any): string {
    const id = user.user?.id || user.id || user.sub;
    if (id) return id;
    throw new NotFoundException('User ID missing from session');
  }
}
