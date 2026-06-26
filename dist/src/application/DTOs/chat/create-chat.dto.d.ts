export declare class CreateChatDto {
    participant1Id: string;
    participant2Id: string;
}
export declare class CreateChatMessageDto {
    chatId: string;
    senderId: string;
    message?: string;
    type?: string;
    attachmentUrl?: string;
    mimeType?: string;
    fileSize?: number;
    duration?: number;
}
