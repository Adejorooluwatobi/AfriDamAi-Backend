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
var OrderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const cart_service_1 = require("./cart.service");
const product_attribute_service_1 = require("./product-attribute.service");
const app_gateway_1 = require("../../shared/websockets/app.gateway");
const notification_service_1 = require("./notification.service");
const client_1 = require("@prisma/client");
const admin_service_1 = require("./admin.service");
let OrderService = OrderService_1 = class OrderService {
    constructor(orderRepository, productService, cartService, productAttributeService, appGateway, notificationService, adminService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.cartService = cartService;
        this.productAttributeService = productAttributeService;
        this.appGateway = appGateway;
        this.notificationService = notificationService;
        this.adminService = adminService;
        this.logger = new common_1.Logger(OrderService_1.name);
    }
    async createOrder(params) {
        const { userId, items, shippingAddress } = params;
        const validatedItems = [];
        let totalAmount = 0;
        for (const item of items) {
            const product = await this.productService.findOneProductById(item.productId);
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
            }
            if (!product.isActive) {
                throw new common_1.BadRequestException(`Product ${product.name} is currently unavailable`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for product ${product.name}`);
            }
            const price = product.basePrice;
            totalAmount += price * item.quantity;
            validatedItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: price,
            });
        }
        const order = await this.orderRepository.createTransactional({
            userId,
            shippingAddress,
            totalAmount,
            items: validatedItems,
        });
        try {
            await this.cartService.clearCart(userId);
        }
        catch (e) {
            this.logger.error(`Failed to clear cart for user ${userId}`, e);
        }
        return order;
    }
    async findOrderById(id) {
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID "${id}" not found`);
        }
        return order;
    }
    async findOrdersByUserId(userId) {
        return this.orderRepository.findByUserId(userId);
    }
    async findAllOrders() {
        return this.orderRepository.findAll();
    }
    async updateOrderStatus(id, params) {
        const existingOrder = await this.orderRepository.findById(id);
        if (!existingOrder) {
            throw new common_1.NotFoundException(`Order with ID "${id}" not found`);
        }
        const oldStatus = existingOrder.status;
        if (params.status === client_1.OrderStatus.CONFIRMED && existingOrder.status !== client_1.OrderStatus.CONFIRMED) {
            for (const item of existingOrder.items) {
                const product = await this.productService.findOneProductById(item.productId);
                const newStock = product.stock - item.quantity;
                await this.productService.updateProduct(item.productId, { stock: newStock });
            }
        }
        const updatedOrder = await this.orderRepository.update(id, params);
        if (updatedOrder.status === client_1.OrderStatus.DELIVERED && oldStatus !== client_1.OrderStatus.DELIVERED) {
            this.logger.log(`Order ${id} status changed to DELIVERED. Sending notifications.`);
            const fullOrder = await this.orderRepository.findById(id);
            if (!fullOrder) {
                this.logger.error(`Could not fetch full order ${id} for notification purposes.`);
                return updatedOrder;
            }
            const admins = await this.adminService.findAllAdmin();
            for (const admin of admins) {
                if (admin.isActive) {
                    const title = 'New Order Completed!';
                    const message = `Order #${fullOrder.id} has been delivered and completed by user ${fullOrder.userId}. Total amount: ${fullOrder.totalAmount}.`;
                    await this.notificationService.createNotification({
                        adminId: admin.id,
                        title,
                        message,
                    });
                    this.appGateway.sendToUser(admin.id, 'newNotification', { title, message, orderId: fullOrder.id, type: 'orderCompletedAdmin' });
                }
            }
            const vendorsToNotify = new Map();
            fullOrder.items.forEach(item => {
                if (item.product?.vendorId && item.product.vendor) {
                    if (!vendorsToNotify.has(item.product.vendorId)) {
                        vendorsToNotify.set(item.product.vendorId, { vendorId: item.product.vendorId, products: [] });
                    }
                    vendorsToNotify.get(item.product.vendorId).products.push({
                        name: item.product.name,
                        quantity: item.quantity,
                    });
                }
            });
            for (const [vendorId, vendorData] of vendorsToNotify) {
                const title = 'Your Product(s) Sold!';
                const productList = vendorData.products.map(p => `${p.name} (x${p.quantity})`).join(', ');
                const message = `Products "${productList}" from Order #${fullOrder.id} have been sold.`;
                await this.notificationService.createNotification({
                    vendorId: vendorId,
                    title,
                    message,
                });
                this.appGateway.sendToUser(vendorId, 'newNotification', { title, message, orderId: fullOrder.id, products: vendorData.products, type: 'orderCompletedVendor' });
            }
        }
        return updatedOrder;
    }
    async deleteOrder(id) {
        await this.findOrderById(id);
        await this.orderRepository.delete(id);
    }
    async restoreStock(id) {
        const order = await this.findOrderById(id);
        if (!order.items)
            return;
        for (const item of order.items) {
            await this.productService.updateProduct(item.productId, {
                stock: (await this.productService.findOneProductById(item.productId)).stock + item.quantity
            });
        }
    }
    async markOrderAsReceived(orderId, userId) {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID "${orderId}" not found`);
        }
        if (order.userId !== userId) {
            throw new common_1.ForbiddenException('You can only mark your own orders as received');
        }
        if (order.status !== client_1.OrderStatus.SHIPPED && order.status !== client_1.OrderStatus.CONFIRMED) {
        }
        return this.orderRepository.update(orderId, { status: client_1.OrderStatus.DELIVERED });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = OrderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IOrderRepository')),
    __metadata("design:paramtypes", [Object, product_service_1.ProductService,
        cart_service_1.CartService,
        product_attribute_service_1.ProductAttributeService,
        app_gateway_1.AppGateway,
        notification_service_1.NotificationService,
        admin_service_1.AdminService])
], OrderService);
//# sourceMappingURL=order.service.js.map