import { IChatRepository } from '../../../domain/repositories/chat.repository.interface';
import { ChatEntity, ChatMessageEntity } from '../../../domain/entities/chat.entity';
import { CreateChatParams, CreateChatMessageParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
export declare class ChatRepository implements IChatRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createChat(params: CreateChatParams): Promise<ChatEntity>;
    findChatById(id: string): Promise<ChatEntity | null>;
    findChatsByParticipantId(participantId: string): Promise<ChatEntity[]>;
    addMessage(params: CreateChatMessageParams): Promise<ChatMessageEntity>;
    getMessages(chatId: string): Promise<ChatMessageEntity[]>;
    markMessageAsRead(messageId: string): Promise<ChatMessageEntity>;
    deleteChat(id: string): Promise<void>;
}
