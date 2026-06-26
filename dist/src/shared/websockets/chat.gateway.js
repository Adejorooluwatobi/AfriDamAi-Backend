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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const chat_service_1 = require("../../domain/services/chat.service");
const app_gateway_1 = require("./app.gateway");
const create_chat_dto_1 = require("../../application/DTOs/chat/create-chat.dto");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(chatService, appGateway) {
        this.chatService = chatService;
        this.appGateway = appGateway;
        this.logger = new common_1.Logger(ChatGateway_1.name);
    }
    async handleMessage(data, client) {
        try {
            const message = await this.chatService.sendMessage({
                chatId: data.chatId,
                senderId: data.senderId,
                message: data.message,
                type: data.type,
                attachmentUrl: data.attachmentUrl,
                mimeType: data.mimeType,
                fileSize: data.fileSize,
                duration: data.duration,
            });
            const chat = await this.chatService.getChatById(data.chatId);
            const receiverId = chat.participant1Id === data.senderId
                ? chat.participant2Id
                : chat.participant1Id;
            this.appGateway.sendToUser(receiverId, 'newMessage', message);
            client.emit('messageSent', message);
            this.logger.log(`Message sent from ${data.senderId} to ${receiverId}`);
            return { success: true, message };
        }
        catch (error) {
            this.logger.error(`Error sending message: ${error.message}`);
            client.emit('error', { message: 'Failed to send message' });
            return { success: false, error: error.message };
        }
    }
    async handleTyping(data) {
        const chat = await this.chatService.getChatById(data.chatId);
        const receiverId = chat.participant1Id === data.senderId
            ? chat.participant2Id
            : chat.participant1Id;
        this.appGateway.sendToUser(receiverId, 'userTyping', {
            chatId: data.chatId,
            userId: data.senderId,
            isTyping: data.isTyping,
        });
    }
    async handleMarkAsRead(data, client) {
        try {
            const message = await this.chatService.markMessageAsRead(data.messageId);
            const chat = await this.chatService.getChatById(message.chatId);
            const receiverId = chat.participant1Id === message.senderId
                ? chat.participant2Id
                : chat.participant1Id;
            this.appGateway.sendToUser(receiverId, 'messageRead', { messageId: data.messageId });
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Error marking message as read: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_dto_1.CreateChatMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkAsRead", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true, namespace: '/chat' }),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_service_1.ChatService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => app_gateway_1.AppGateway))),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        app_gateway_1.AppGateway])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map