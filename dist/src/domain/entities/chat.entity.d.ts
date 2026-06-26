export declare class ChatMessageEntity {
    id: string;
    chatId: string;
    senderId: string;
    message: string;
    type: string;
    attachmentUrl?: string;
    mimeType?: string;
    fileSize?: number;
    duration?: number;
    isRead: boolean;
    isDelivered: boolean;
    readAt?: Date;
    deliveredAt?: Date;
    createdAt: Date;
    constructor(partial: Partial<ChatMessageEntity>);
}
export declare class ChatEntity {
    id: string;
    participant1Id: string;
    participant2Id: string;
    createdAt: Date;
    updatedAt: Date;
    messages?: ChatMessageEntity[];
    participants?: Array<{
        id: string;
        name: string;
        profile?: any;
        avatarUrl?: string;
    }>;
    constructor(partial: Partial<ChatEntity>);
}
