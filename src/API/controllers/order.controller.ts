import { Controller, Post, Body, Get, Param, UseGuards, HttpCode, HttpStatus, Delete, Put, Patch, Request, ForbiddenException } from '@nestjs/common';
import { OrderService } from '../../domain/services/order.service';
import { CreateOrderDto } from '../../application/DTOs/orders/create-order.dto';
import { UpdateOrderDto } from '../../application/DTOs/orders/update-order.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderEntity } from 'src/domain/entities/order.entity';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully.', type: OrderEntity })
  async create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    const userId = this.extractUserId(req.user);
    const order = await this.orderService.createOrder({ ...createOrderDto, userId });
    return {
      succeeded: true,
      message: 'Order created successfully',
      resultData: order
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'List of all orders', type: [OrderEntity] })
  async findAll(@Request() req: any) {
    // If user is not admin, they might only see their own orders or be denied
    // For now, let's assume this is for admins or we filter by user if not admin
    // In a real app, you'd use an AdminGuard for this or filter.
    const orders = await this.orderService.findAllOrders();
    return {
      succeeded: true,
      message: 'Orders retrieved successfully',
      resultData: orders
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by its ID' })
  @ApiResponse({ status: 200, description: 'Order found', type: OrderEntity })
  async findOne(@Request() req: any, @Param('id') id: string) {
    const userId = this.extractUserId(req.user);
    const order = await this.orderService.findOrderById(id);
    
    // Check ownership (unless admin)
    if (order.userId !== userId) {
      throw new ForbiddenException('Unauthorized access to order'); 
    }

    return {
      succeeded: true,
      message: 'Order found',
      resultData: order
    };
  }
  
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all orders for a specific user' })
  @ApiResponse({ status: 200, description: 'User orders found', type: [OrderEntity] })
  async findByUser(@Request() req: any, @Param('userId') userIdParam: string) {
    const userId = this.extractUserId(req.user);
    
    if (userId !== userIdParam) {
      throw new ForbiddenException('Unauthorized access to user orders');
    }

    const orders = await this.orderService.findOrdersByUserId(userId);
    return {
      succeeded: true,
      message: 'User orders retrieved successfully',
      resultData: orders
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an order status' })
  @ApiResponse({ status: 200, description: 'Order updated successfully', type: OrderEntity })
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
      const order = await this.orderService.updateOrderStatus(id, updateOrderDto);
      return {
        succeeded: true,
        message: 'Order updated successfully',
        resultData: order
      };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order' })
  async remove(@Param('id') id: string) {
    await this.orderService.deleteOrder(id);
    return {
      succeeded: true,
      message: 'Order deleted successfully'
    };
  }

  @Patch(':id/received')
  @ApiOperation({ summary: 'Mark order as received by the user' })
  @ApiResponse({ status: 200, description: 'Order marked as received successfully', type: OrderEntity })
  async markAsReceived(@Request() req: any, @Param('id') id: string) {
    const userId = this.extractUserId(req.user);
    const order = await this.orderService.markOrderAsReceived(id, userId);
    return {
      succeeded: true,
      message: 'Order marked as received successfully',
      resultData: order
    };
  }

  private extractUserId(user: any): string {
    return user.user?.id || user.id || user.sub;
  }
}