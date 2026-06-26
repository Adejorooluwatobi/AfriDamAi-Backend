"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const chat_service_1 = require("../../domain/services/chat.service");
const create_chat_dto_1 = require("../../application/DTOs/chat/create-chat.dto");
const chat_mapper_1 = require("../../infrastructure/mappers/chat.mapper");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const file_upload_service_1 = require("../../shared/services/file-upload.service");
let ChatController = class ChatController {
    constructor(chatService, fileUploadService) {
        this.chatService = chatService;
        this.fileUploadService = fileUploadService;
    }
    async create(createChatDto) {
        const chat = await this.chatService.initiateChat(createChatDto);
        return {
            succeeded: true,
            message: 'Chat initiated successfully',
            resultData: chat_mapper_1.ChatMapper.toDto(chat)
        };
    }
    async getMyChats(req) {
        const userId = this.extractUserId(req.user);
        const chats = await this.chatService.getUserChats(userId);
        return {
            succeeded: true,
            message: 'Chats retrieved successfully',
            resultData: chats.map(c => chat_mapper_1.ChatMapper.toDto(c))
        };
    }
    async findOne(id) {
        const chat = await this.chatService.getChatById(id);
        return {
            succeeded: true,
            message: 'Chat retrieved successfully',
            resultData: chat_mapper_1.ChatMapper.toDto(chat)
        };
    }
    async getMessages(id) {
        const messages = await this.chatService.getChatMessages(id);
        return {
            succeeded: true,
            message: 'Messages retrieved successfully',
            resultData: messages.map(m => chat_mapper_1.ChatMessageMapper.toDto(m))
        };
    }
    async sendMessage(req, createMessageDto, file) {
        let attachmentUrl;
        let mimeType;
        let fileSize;
        let type = createMessageDto.type || 'TEXT';
        if (file) {
            const uploadedFile = {
                fieldname: file.fieldname,
                originalname: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                size: file.size,
                buffer: file.buffer,
            };
            if (file.mimetype.startsWith('image/')) {
                attachmentUrl = await this.fileUploadService.uploadImageFile(uploadedFile);
                type = 'IMAGE';
            }
            else if (file.mimetype.startsWith('video/')) {
                attachmentUrl = await this.fileUploadService.uploadVideoFile(uploadedFile);
                type = 'VIDEO';
            }
            else if (file.mimetype.startsWith('audio/')) {
                attachmentUrl = await this.fileUploadService.uploadAudioFile(uploadedFile);
                type = 'AUDIO';
            }
            else {
                attachmentUrl = await this.fileUploadService.uploadGenericFile(uploadedFile);
                type = 'FILE';
            }
            mimeType = file.mimetype;
            fileSize = file.size;
        }
        const senderId = this.extractUserId(req.user);
        const message = await this.chatService.sendMessage({
            ...createMessageDto,
            senderId,
            type: type,
            attachmentUrl,
            mimeType,
            fileSize,
        });
        return {
            succeeded: true,
            message: 'Message sent successfully',
            resultData: chat_mapper_1.ChatMessageMapper.toDto(message)
        };
    }
    async markMessageAsRead(id) {
        const message = await this.chatService.markMessageAsRead(id);
        return {
            succeeded: true,
            message: 'Message marked as read',
            resultData: chat_mapper_1.ChatMessageMapper.toDto(message)
        };
    }
    extractUserId(user) {
        const id = user.user?.id || user.id || user.sub;
        if (id)
            return id;
        throw new common_1.NotFoundException('User ID missing from session');
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate a new chat' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Chat created successfully' }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_dto_1.CreateChatDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user chats' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMyChats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get chat by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all messages in a chat' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message in a chat' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_chat_dto_1.CreateChatMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Patch)('messages/:id/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mark message as read' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markMessageAsRead", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chats'),
    (0, common_1.Controller)('chats'),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        file_upload_service_1.FileUploadService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map