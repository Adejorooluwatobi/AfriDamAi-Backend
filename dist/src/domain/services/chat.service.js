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
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const app_gateway_1 = require("../../shared/websockets/app.gateway");
const notification_service_1 = require("./notification.service");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
const client_1 = require("@prisma/client");
const common_2 = require("@nestjs/common");
const appointment_service_1 = require("./appointment.service");
let ChatService = ChatService_1 = class ChatService {
    constructor(chatRepository, appGateway, notificationService, prisma, appointmentService) {
        this.chatRepository = chatRepository;
        this.appGateway = appGateway;
        this.notificationService = notificationService;
        this.prisma = prisma;
        this.appointmentService = appointmentService;
        this.logger = new common_1.Logger(ChatService_1.name);
    }
    async initiateChat(params) {
        const chat = await this.chatRepository.createChat(params);
        this.appGateway.sendToUser(params.participant2Id, 'newChatRequest', {
            chatId: chat.id,
            fromUserId: params.participant1Id,
            message: 'You have a new chat request'
        });
        try {
            await this.notificationService.createNotification({
                title: 'New Chat Request',
                message: 'Someone wants to chat with you',
                specialistId: params.participant2Id,
            });
        }
        catch (error) {
            try {
                await this.notificationService.createNotification({
                    title: 'New Chat Request',
                    message: 'Someone wants to chat with you',
                    userId: params.participant2Id,
                });
            }
            catch (err) {
                this.logger.warn(`Could not create notification for ${params.participant2Id}`);
            }
        }
        this.logger.log(`Chat initiated and notification sent to ${params.participant2Id}`);
        return chat;
    }
    async getChatById(id) {
        const chat = await this.chatRepository.findChatById(id);
        if (!chat) {
            throw new common_1.NotFoundException(`Chat with id ${id} not found`);
        }
        return chat;
    }
    async getUserChats(userId) {
        return this.chatRepository.findChatsByParticipantId(userId);
    }
    async sendMessage(params) {
        const message = await this.chatRepository.addMessage(params);
        const chat = await this.chatRepository.findChatById(params.chatId);
        if (chat) {
            const receiverId = chat.participant1Id === params.senderId ? chat.participant2Id : chat.participant1Id;
            const activeAppointment = await this.prisma.appointment.findFirst({
                where: {
                    OR: [
                        { userId: params.senderId, specialistId: receiverId },
                        { userId: receiverId, specialistId: params.senderId },
                    ],
                    status: client_1.AppointmentStatus.IN_PROGRESS,
                },
            });
            if (activeAppointment) {
                const now = new Date();
                if (activeAppointment.endedAt && now > activeAppointment.endedAt && !activeAppointment.isExtended) {
                    this.logger.log(`Session ${activeAppointment.id} expired. Auto-completing via Chat enforcement.`);
                    await this.appointmentService.completeAppointment(activeAppointment.id, 'SYSTEM');
                    throw new common_1.ForbiddenException('The appointment session has ended. Chat is no longer available.');
                }
            }
            else {
                throw new common_1.ForbiddenException('Chat is only available during an active appointment session.');
            }
            const sent = this.appGateway.sendToUser(receiverId, 'newMessage', message);
            if (sent) {
                this.logger.log(`Real-time message delivered to ${receiverId} for chat ${chat.id}`);
            }
            else {
                this.logger.warn(`User ${receiverId} is offline. Message saved to database.`);
            }
            const notificationText = params.message
                ? `You have a new message: "${params.message.substring(0, 50)}${params.message.length > 50 ? '...' : ''}"`
                : `You have a new ${params.type || 'multimedia'} message`;
            try {
                await this.notificationService.createNotification({
                    title: 'New Chat Message',
                    message: notificationText,
                    specialistId: receiverId,
                });
            }
            catch (error) {
                try {
                    await this.notificationService.createNotification({
                        title: 'New Chat Message',
                        message: notificationText,
                        userId: receiverId,
                    });
                }
                catch (err) {
                    this.logger.warn(`Could not create notification for ${receiverId}`);
                }
            }
            this.logger.log(`Database notification created for ${receiverId}`);
        }
        return message;
    }
    async getChatMessages(chatId) {
        return this.chatRepository.getMessages(chatId);
    }
    async markMessageAsRead(messageId) {
        return this.chatRepository.markMessageAsRead(messageId);
    }
    async recordMissedCall(chatId, senderId) {
        const chat = await this.chatRepository.findChatById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException(`Chat with id ${chatId} not found`);
        }
        const recentMessages = await this.chatRepository.getMessages(chatId);
        const hasAnswered = recentMessages.some(m => m.type === 'SYSTEM' &&
            m.message.startsWith('CALL_ANSWER:') &&
            new Date(m.createdAt).getTime() > Date.now() - 60000);
        if (hasAnswered) {
            this.logger.log(`Skipping missed call record for ${chatId}: Durable check found a recent CALL_ANSWER.`);
            return null;
        }
        const message = await this.chatRepository.addMessage({
            chatId,
            senderId,
            message: 'Missed Call',
            type: 'MISSED_CALL',
        });
        const receiverId = chat.participant1Id === senderId ? chat.participant2Id : chat.participant1Id;
        this.appGateway.sendToUser(receiverId, 'newMessage', message);
        try {
            await this.notificationService.createNotification({
                title: 'Missed Call',
                message: 'You have a missed call from a participant',
                specialistId: receiverId,
            });
        }
        catch (error) {
            try {
                await this.notificationService.createNotification({
                    title: 'Missed Call',
                    message: 'You have a missed call from a participant',
                    userId: receiverId,
                });
            }
            catch (err) {
                this.logger.warn(`Could not create missed call notification for ${receiverId}`);
            }
        }
        return message;
    }
    async isCallStillActive(chatId) {
        const chat = await this.chatRepository.findChatById(chatId);
        if (!chat)
            return false;
        const activeAppointment = await this.prisma.appointment.findFirst({
            where: {
                OR: [
                    { userId: chat.participant1Id, specialistId: chat.participant2Id },
                    { userId: chat.participant2Id, specialistId: chat.participant1Id },
                ],
                status: client_1.AppointmentStatus.IN_PROGRESS,
            },
        });
        return !!activeAppointment;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IChatRepository')),
    __param(1, (0, common_1.Inject)((0, common_2.forwardRef)(() => app_gateway_1.AppGateway))),
    __param(4, (0, common_1.Inject)((0, common_2.forwardRef)(() => appointment_service_1.AppointmentService))),
    __metadata("design:paramtypes", [Object, app_gateway_1.AppGateway,
        notification_service_1.NotificationService,
        prisma_service_1.PrismaService,
        appointment_service_1.AppointmentService])
], ChatService);
//# sourceMappingURL=chat.service.js.map