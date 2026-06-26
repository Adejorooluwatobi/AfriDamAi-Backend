import { ChatEntity, ChatMessageEntity } from '../../domain/entities/chat.entity';
import { Chat, ChatMessage } from '@prisma/client';
export declare class ChatMessageMapper {
    static toDomain(raw: ChatMessage): ChatMessageEntity;
    static toDomainArray(raws: ChatMessage[]): ChatMessageEntity[];
    static toPersistence(domain: ChatMessageEntity): ChatMessage;
    static toDto(entity: ChatMessageEntity): any;
}
export declare class ChatMapper {
    static toDomain(raw: any): ChatEntity;
    static toDomainArray(raws: any[]): ChatEntity[];
    static toDto(entity: ChatEntity): any;
    static toPersistence(domain: ChatEntity): Chat;
}
