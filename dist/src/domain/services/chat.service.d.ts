import { ChatEntity, ChatMessageEntity } from '../entities/chat.entity';
import { IChatRepository } from '../repositories/chat.repository.interface';
import { CreateChatParams, CreateChatMessageParams } from 'src/utils/type';
import { AppGateway } from 'src/shared/websockets/app.gateway';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AppointmentService } from './appointment.service';
export declare class ChatService {
    private readonly chatRepository;
    private readonly appGateway;
    private readonly notificationService;
    private readonly prisma;
    private readonly appointmentService;
    private readonly logger;
    constructor(chatRepository: IChatRepository, appGateway: AppGateway, notificationService: NotificationService, prisma: PrismaService, appointmentService: AppointmentService);
    initiateChat(params: CreateChatParams): Promise<ChatEntity>;
    getChatById(id: string): Promise<ChatEntity>;
    getUserChats(userId: string): Promise<ChatEntity[]>;
    sendMessage(params: CreateChatMessageParams): Promise<ChatMessageEntity>;
    getChatMessages(chatId: string): Promise<ChatMessageEntity[]>;
    markMessageAsRead(messageId: string): Promise<ChatMessageEntity>;
    recordMissedCall(chatId: string, senderId: string): Promise<ChatMessageEntity | null>;
    isCallStillActive(chatId: string): Promise<boolean>;
}
