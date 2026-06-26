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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("../../domain/services/order.service");
const create_order_dto_1 = require("../../application/DTOs/orders/create-order.dto");
const update_order_dto_1 = require("../../application/DTOs/orders/update-order.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const order_entity_1 = require("../../domain/entities/order.entity");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async create(req, createOrderDto) {
        const userId = this.extractUserId(req.user);
        const order = await this.orderService.createOrder({ ...createOrderDto, userId });
        return {
            succeeded: true,
            message: 'Order created successfully',
            resultData: order
        };
    }
    async findAll(req) {
        const orders = await this.orderService.findAllOrders();
        return {
            succeeded: true,
            message: 'Orders retrieved successfully',
            resultData: orders
        };
    }
    async findOne(req, id) {
        const userId = this.extractUserId(req.user);
        const order = await this.orderService.findOrderById(id);
        if (order.userId !== userId) {
            throw new common_1.ForbiddenException('Unauthorized access to order');
        }
        return {
            succeeded: true,
            message: 'Order found',
            resultData: order
        };
    }
    async findByUser(req, userIdParam) {
        const userId = this.extractUserId(req.user);
        if (userId !== userIdParam) {
            throw new common_1.ForbiddenException('Unauthorized access to user orders');
        }
        const orders = await this.orderService.findOrdersByUserId(userId);
        return {
            succeeded: true,
            message: 'User orders retrieved successfully',
            resultData: orders
        };
    }
    async update(id, updateOrderDto) {
        const order = await this.orderService.updateOrderStatus(id, updateOrderDto);
        return {
            succeeded: true,
            message: 'Order updated successfully',
            resultData: order
        };
    }
    async remove(id) {
        await this.orderService.deleteOrder(id);
        return {
            succeeded: true,
            message: 'Order deleted successfully'
        };
    }
    async markAsReceived(req, id) {
        const userId = this.extractUserId(req.user);
        const order = await this.orderService.markOrderAsReceived(id, userId);
        return {
            succeeded: true,
            message: 'Order marked as received successfully',
            resultData: order
        };
    }
    extractUserId(user) {
        return user.user?.id || user.id || user.sub;
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created successfully.', type: order_entity_1.OrderEntity }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all orders', type: [order_entity_1.OrderEntity] }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an order by its ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order found', type: order_entity_1.OrderEntity }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders for a specific user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User orders found', type: [order_entity_1.OrderEntity] }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an order status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order updated successfully', type: order_entity_1.OrderEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an order' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/received'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark order as received by the user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order marked as received successfully', type: order_entity_1.OrderEntity }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "markAsReceived", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map