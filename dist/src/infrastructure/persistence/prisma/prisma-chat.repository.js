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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const common_1 = require("@nestjs/common");
const chat_mapper_1 = require("../../mappers/chat.mapper");
const prisma_service_1 = require("./prisma.service");
let ChatRepository = class ChatRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createChat(params) {
        let chat = await this.prisma.chat.findFirst({
            where: {
                OR: [
                    { participant1Id: params.participant1Id, participant2Id: params.participant2Id },
                    { participant1Id: params.participant2Id, participant2Id: params.participant1Id }
                ]
            }
        });
        if (!chat) {
            chat = await this.prisma.chat.create({
                data: {
                    participant1Id: params.participant1Id,
                    participant2Id: params.participant2Id,
                },
            });
        }
        const [users, specialists] = await Promise.all([
            this.prisma.user.findMany({
                where: { id: { in: [chat.participant1Id, chat.participant2Id] } },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profile: {
                        select: {
                            avatarUrl: true,
                            ageRange: true,
                            skinType: true,
                            melaninTone: true,
                            primaryConcern: true,
                            environment: true,
                            allergies: true,
                            previousTreatment: true,
                            skinHistory: {
                                select: {
                                    id: true,
                                    predictions: true,
                                    createdAt: true
                                },
                                orderBy: { createdAt: 'desc' },
                                take: 5
                            }
                        }
                    }
                }
            }),
            this.prisma.specialist.findMany({
                where: { id: { in: [chat.participant1Id, chat.participant2Id] } },
                select: { id: true, firstName: true, lastName: true, avatarUrl: true }
            })
        ]);
        const participantMap = new Map();
        users.forEach(u => participantMap.set(u.id, {
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            profile: u.profile
        }));
        specialists.forEach(s => participantMap.set(s.id, {
            id: s.id,
            name: `${s.firstName} ${s.lastName}`,
            avatarUrl: s.avatarUrl || undefined
        }));
        const enrichedChat = {
            ...chat,
            participants: [
                participantMap.get(chat.participant1Id) || { id: chat.participant1Id, name: 'Unknown' },
                participantMap.get(chat.participant2Id) || { id: chat.participant2Id, name: 'Unknown' }
            ]
        };
        return chat_mapper_1.ChatMapper.toDomain(enrichedChat);
    }
    async findChatById(id) {
        const chat = await this.prisma.chat.findUnique({
            where: { id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        if (!chat)
            return null;
        const [users, specialists] = await Promise.all([
            this.prisma.user.findMany({
                where: { id: { in: [chat.participant1Id, chat.participant2Id] } },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profile: {
                        select: {
                            avatarUrl: true,
                            ageRange: true,
                            skinType: true,
                            melaninTone: true,
                            primaryConcern: true,
                            environment: true,
                            allergies: true,
                            previousTreatment: true,
                            skinHistory: {
                                select: {
                                    id: true,
                                    predictions: true,
                                    createdAt: true
                                },
                                orderBy: { createdAt: 'desc' },
                                take: 5
                            }
                        }
                    }
                }
            }),
            this.prisma.specialist.findMany({
                where: { id: { in: [chat.participant1Id, chat.participant2Id] } },
                select: { id: true, firstName: true, lastName: true, avatarUrl: true }
            })
        ]);
        const participantMap = new Map();
        users.forEach(u => participantMap.set(u.id, {
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            profile: u.profile
        }));
        specialists.forEach(s => participantMap.set(s.id, {
            id: s.id,
            name: `${s.firstName} ${s.lastName}`,
            avatarUrl: s.avatarUrl || undefined
        }));
        const enrichedChat = {
            ...chat,
            participants: [
                participantMap.get(chat.participant1Id) || { id: chat.participant1Id, name: 'Unknown' },
                participantMap.get(chat.participant2Id) || { id: chat.participant2Id, name: 'Unknown' }
            ]
        };
        return chat_mapper_1.ChatMapper.toDomain(enrichedChat);
    }
    async findChatsByParticipantId(participantId) {
        const chats = await this.prisma.chat.findMany({
            where: {
                OR: [
                    { participant1Id: participantId },
                    { participant2Id: participantId },
                ],
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
        if (chats.length === 0)
            return [];
        const participantIds = new Set();
        chats.forEach(c => {
            participantIds.add(c.participant1Id);
            participantIds.add(c.participant2Id);
        });
        const ids = Array.from(participantIds);
        const [users, specialists] = await Promise.all([
            this.prisma.user.findMany({
                where: { id: { in: ids } },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profile: {
                        select: {
                            avatarUrl: true,
                            ageRange: true,
                            skinType: true,
                            melaninTone: true,
                            primaryConcern: true,
                            environment: true,
                            allergies: true,
                            previousTreatment: true,
                            skinHistory: {
                                select: {
                                    id: true,
                                    predictions: true,
                                    createdAt: true
                                },
                                orderBy: { createdAt: 'desc' },
                                take: 5
                            }
                        }
                    }
                }
            }),
            this.prisma.specialist.findMany({
                where: { id: { in: ids } },
                select: { id: true, firstName: true, lastName: true, avatarUrl: true }
            })
        ]);
        const participantMap = new Map();
        users.forEach(u => participantMap.set(u.id, {
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            profile: u.profile
        }));
        specialists.forEach(s => participantMap.set(s.id, {
            id: s.id,
            name: `${s.firstName} ${s.lastName}`,
            avatarUrl: s.avatarUrl || undefined
        }));
        const enrichedChats = chats.map(chat => ({
            ...chat,
            participants: [
                participantMap.get(chat.participant1Id) || { id: chat.participant1Id, name: 'Unknown' },
                participantMap.get(chat.participant2Id) || { id: chat.participant2Id, name: 'Unknown' }
            ]
        }));
        return chat_mapper_1.ChatMapper.toDomainArray(enrichedChats);
    }
    async addMessage(params) {
        const message = await this.prisma.chatMessage.create({
            data: {
                chatId: params.chatId,
                senderId: params.senderId,
                message: params.message,
                type: params.type,
                attachmentUrl: params.attachmentUrl,
                mimeType: params.mimeType,
                fileSize: params.fileSize,
                duration: params.duration,
            },
        });
        await this.prisma.chat.update({
            where: { id: params.chatId },
            data: { updatedAt: new Date() }
        });
        return chat_mapper_1.ChatMessageMapper.toDomain(message);
    }
    async getMessages(chatId) {
        const messages = await this.prisma.chatMessage.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' },
        });
        return chat_mapper_1.ChatMessageMapper.toDomainArray(messages);
    }
    async markMessageAsRead(messageId) {
        const message = await this.prisma.chatMessage.update({
            where: { id: messageId },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
        return chat_mapper_1.ChatMessageMapper.toDomain(message);
    }
    async deleteChat(id) {
        await this.prisma.chat.delete({
            where: { id },
        });
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatRepository);
//# sourceMappingURL=prisma-chat.repository.js.map