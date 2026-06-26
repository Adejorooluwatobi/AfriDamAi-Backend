import { ApiProperty } from "@nestjs/swagger";

export class ChatMessageEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    chatId: string;

    @ApiProperty()
    senderId: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    type: string;

    @ApiProperty({ required: false })
    attachmentUrl?: string;

    @ApiProperty({ required: false })
    mimeType?: string;

    @ApiProperty({ required: false })
    fileSize?: number;

    @ApiProperty({ required: false })
    duration?: number;

    @ApiProperty()
    isRead: boolean;

    @ApiProperty()
    isDelivered: boolean;

    @ApiProperty({ required: false })
    readAt?: Date;

    @ApiProperty({ required: false })
    deliveredAt?: Date;

    @ApiProperty()
    createdAt: Date;

    constructor(partial: Partial<ChatMessageEntity>) {
        Object.assign(this, partial);
    }
}

export class ChatEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    participant1Id: string;

    @ApiProperty()
    participant2Id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ type: () => [ChatMessageEntity], required: false })
    messages?: ChatMessageEntity[];

    @ApiProperty({ required: false })
    participants?: Array<{ id: string; name: string; profile?: any; avatarUrl?: string }>;

    constructor(partial: Partial<ChatEntity>) {
        Object.assign(this, partial);
    }
}
