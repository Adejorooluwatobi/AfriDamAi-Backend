import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/domain/services/chat.service';
import { AppGateway } from './app.gateway';
import { CreateChatMessageDto } from 'src/application/DTOs/chat/create-chat.dto';
export declare class ChatGateway {
    private readonly chatService;
    private readonly appGateway;
    server: Server;
    private readonly logger;
    constructor(chatService: ChatService, appGateway: AppGateway);
    handleMessage(data: CreateChatMessageDto, client: Socket): Promise<{
        success: boolean;
        message: import("../../domain/entities/chat.entity").ChatMessageEntity;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    handleTyping(data: {
        chatId: string;
        senderId: string;
        isTyping: boolean;
    }): Promise<void>;
    handleMarkAsRead(data: {
        messageId: string;
    }, client: Socket): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
}
