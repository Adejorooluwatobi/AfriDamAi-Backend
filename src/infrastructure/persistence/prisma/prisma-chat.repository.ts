import { Injectable } from '@nestjs/common';
import { IChatRepository } from '../../../domain/repositories/chat.repository.interface';
import { ChatEntity, ChatMessageEntity } from '../../../domain/entities/chat.entity';
import { ChatMapper, ChatMessageMapper } from '../../mappers/chat.mapper';
import { CreateChatParams, CreateChatMessageParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(params: CreateChatParams): Promise<ChatEntity> {
    // Check if chat already exists
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

    // Fetch participant details
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

    const participantMap = new Map<string, { id: string, name: string, profile?: any, avatarUrl?: string }>();
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

    return ChatMapper.toDomain(enrichedChat as any);
  }

  async findChatById(id: string): Promise<ChatEntity | null> {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        messages: {
            orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!chat) return null;

    // Fetch participant details
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

    const participantMap = new Map<string, { id: string, name: string, profile?: any, avatarUrl?: string }>();
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

    return ChatMapper.toDomain(enrichedChat as any);
  }

  async findChatsByParticipantId(participantId: string): Promise<ChatEntity[]> {
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

    if (chats.length === 0) return [];

    // Fetch participant details
    const participantIds = new Set<string>();
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

    const participantMap = new Map<string, { id: string, name: string, profile?: any, avatarUrl?: string }>();
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

    return ChatMapper.toDomainArray(enrichedChats as any);
  }

  async addMessage(params: CreateChatMessageParams): Promise<ChatMessageEntity> {
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

    // Update chat timestamp
    await this.prisma.chat.update({
        where: { id: params.chatId },
        data: { updatedAt: new Date() }
    });

    return ChatMessageMapper.toDomain(message);
  }

  async getMessages(chatId: string): Promise<ChatMessageEntity[]> {
    const messages = await this.prisma.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });
    return ChatMessageMapper.toDomainArray(messages);
  }

  async markMessageAsRead(messageId: string): Promise<ChatMessageEntity> {
    const message = await this.prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return ChatMessageMapper.toDomain(message);
  }

  async deleteChat(id: string): Promise<void> {
    await this.prisma.chat.delete({
      where: { id },
    });
  }
}
