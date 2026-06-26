import { CreateChatParams, CreateChatMessageParams } from 'src/utils/type';
import { ChatEntity, ChatMessageEntity } from '../entities/chat.entity';
export interface IChatRepository {
    createChat(params: CreateChatParams): Promise<ChatEntity>;
    findChatById(id: string): Promise<ChatEntity | null>;
    findChatsByParticipantId(participantId: string): Promise<ChatEntity[]>;
    addMessage(params: CreateChatMessageParams): Promise<ChatMessageEntity>;
    getMessages(chatId: string): Promise<ChatMessageEntity[]>;
    markMessageAsRead(messageId: string): Promise<ChatMessageEntity>;
    deleteChat(id: string): Promise<void>;
}
