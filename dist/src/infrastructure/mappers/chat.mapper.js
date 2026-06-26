"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMapper = exports.ChatMessageMapper = void 0;
const chat_entity_1 = require("../../domain/entities/chat.entity");
class ChatMessageMapper {
    static toDomain(raw) {
        return new chat_entity_1.ChatMessageEntity({
            id: raw.id,
            chatId: raw.chatId,
            senderId: raw.senderId,
            message: raw.message ?? '',
            type: raw.type,
            attachmentUrl: raw.attachmentUrl ?? undefined,
            mimeType: raw.mimeType ?? undefined,
            fileSize: raw.fileSize ?? undefined,
            duration: raw.duration ?? undefined,
            isRead: raw.isRead,
            isDelivered: raw.isDelivered,
            readAt: raw.readAt ?? undefined,
            deliveredAt: raw.deliveredAt ?? undefined,
            createdAt: raw.createdAt,
        });
    }
    static toDomainArray(raws) {
        return raws.map(m => this.toDomain(m));
    }
    static toPersistence(domain) {
        return {
            id: domain.id,
            chatId: domain.chatId,
            senderId: domain.senderId,
            message: domain.message ?? null,
            type: domain.type,
            attachmentUrl: domain.attachmentUrl ?? null,
            mimeType: domain.mimeType ?? null,
            fileSize: domain.fileSize ?? null,
            duration: domain.duration ?? null,
            isRead: domain.isRead,
            isDelivered: domain.isDelivered,
            readAt: domain.readAt ?? null,
            deliveredAt: domain.deliveredAt ?? null,
            createdAt: domain.createdAt,
        };
    }
    static toDto(entity) {
        return {
            id: entity.id,
            chatId: entity.chatId,
            senderId: entity.senderId,
            message: entity.message,
            type: entity.type,
            attachmentUrl: entity.attachmentUrl,
            mimeType: entity.mimeType,
            fileSize: entity.fileSize,
            duration: entity.duration,
            isRead: entity.isRead,
            isDelivered: entity.isDelivered,
            readAt: entity.readAt,
            deliveredAt: entity.deliveredAt,
            createdAt: entity.createdAt,
        };
    }
}
exports.ChatMessageMapper = ChatMessageMapper;
class ChatMapper {
    static toDomain(raw) {
        return new chat_entity_1.ChatEntity({
            id: raw.id,
            participant1Id: raw.participant1Id,
            participant2Id: raw.participant2Id,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            messages: raw.messages ? ChatMessageMapper.toDomainArray(raw.messages) : [],
            participants: raw.participants,
        });
    }
    static toDomainArray(raws) {
        return raws.map(c => this.toDomain(c));
    }
    static toDto(entity) {
        return {
            id: entity.id,
            participant1Id: entity.participant1Id,
            participant2Id: entity.participant2Id,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            messages: entity.messages?.map(m => ChatMessageMapper.toDto(m)) || [],
            participants: entity.participants,
        };
    }
    static toPersistence(domain) {
        return {
            id: domain.id,
            participant1Id: domain.participant1Id,
            participant2Id: domain.participant2Id,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        };
    }
}
exports.ChatMapper = ChatMapper;
//# sourceMappingURL=chat.mapper.js.map