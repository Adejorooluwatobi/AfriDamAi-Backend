import { ChatService } from 'src/domain/services/chat.service';
import { CreateChatDto, CreateChatMessageDto } from 'src/application/DTOs/chat/create-chat.dto';
import { FileUploadService } from 'src/shared/services/file-upload.service';
export declare class ChatController {
    private readonly chatService;
    private readonly fileUploadService;
    constructor(chatService: ChatService, fileUploadService: FileUploadService);
    create(createChatDto: CreateChatDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: any;
    }>;
    getMyChats(req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: any[];
    }>;
    findOne(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: any;
    }>;
    getMessages(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: any[];
    }>;
    sendMessage(req: any, createMessageDto: CreateChatMessageDto, file?: Express.Multer.File): Promise<{
        succeeded: boolean;
        message: string;
        resultData: any;
    }>;
    markMessageAsRead(id: string): Promise<{
        succeeded: boolean;
        message: string;
        resultData: any;
    }>;
    private extractUserId;
}
