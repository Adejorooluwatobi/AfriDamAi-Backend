import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { ChatEntity, ChatMessageEntity } from '../entities/chat.entity';
import { IChatRepository } from '../repositories/chat.repository.interface';
import { CreateChatParams, CreateChatMessageParams } from 'src/utils/type';
import { AppGateway } from 'src/shared/websockets/app.gateway'; // Import AppGateway
import { NotificationService } from './notification.service'; // Import NotificationService
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';
import { forwardRef } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @Inject('IChatRepository') private readonly chatRepository: IChatRepository,
    @Inject(forwardRef(() => AppGateway)) private readonly appGateway: AppGateway, // Inject AppGateway with forwardRef
    private readonly notificationService: NotificationService, // Inject NotificationService
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AppointmentService))
    private readonly appointmentService: AppointmentService,
  ) {}

  async initiateChat(params: CreateChatParams): Promise<ChatEntity> {
    const chat = await this.chatRepository.createChat(params);
    
    // Notify participant2 about new chat request via WebSocket
    this.appGateway.sendToUser(params.participant2Id, 'newChatRequest', {
      chatId: chat.id,
      fromUserId: params.participant1Id,
      message: 'You have a new chat request'
    });
    
    // Create notification - try as specialist first, then user
    try {
      await this.notificationService.createNotification({
        title: 'New Chat Request',
        message: 'Someone wants to chat with you',
        specialistId: params.participant2Id,
      });
    } catch (error) {
      // If specialist fails, try as user
      try {
        await this.notificationService.createNotification({
          title: 'New Chat Request',
          message: 'Someone wants to chat with you',
          userId: params.participant2Id,
        });
      } catch (err) {
        this.logger.warn(`Could not create notification for ${params.participant2Id}`);
      }
    }
    
    this.logger.log(`Chat initiated and notification sent to ${params.participant2Id}`);
    
    return chat;
  }

  async getChatById(id: string): Promise<ChatEntity> {
    const chat = await this.chatRepository.findChatById(id);
    if (!chat) {
      throw new NotFoundException(`Chat with id ${id} not found`);
    }
    return chat;
  }

  async getUserChats(userId: string): Promise<ChatEntity[]> {
    return this.chatRepository.findChatsByParticipantId(userId);
  }

  async sendMessage(params: CreateChatMessageParams): Promise<ChatMessageEntity> {
    const message = await this.chatRepository.addMessage(params);

    const chat = await this.chatRepository.findChatById(params.chatId);
    if (chat) {
      const receiverId = chat.participant1Id === params.senderId ? chat.participant2Id : chat.participant1Id;
      
      // 🛡️ SESSION ENFORCEMENT 🛡️
      const activeAppointment = await this.prisma.appointment.findFirst({
        where: {
          OR: [
            { userId: params.senderId, specialistId: receiverId },
            { userId: receiverId, specialistId: params.senderId },
          ],
          status: AppointmentStatus.IN_PROGRESS,
        },
      });

      if (activeAppointment) {
          const now = new Date();
          if (activeAppointment.endedAt && now > activeAppointment.endedAt && !activeAppointment.isExtended) {
              // Session expired, mark as completed and block message
              this.logger.log(`Session ${activeAppointment.id} expired. Auto-completing via Chat enforcement.`);
              
              // Trigger full completion logic (payout, deduction, etc.)
              await this.appointmentService.completeAppointment(activeAppointment.id, 'SYSTEM');
              
              throw new ForbiddenException('The appointment session has ended. Chat is no longer available.');
          }
      } else {
          // No active session found
          throw new ForbiddenException('Chat is only available during an active appointment session.');
      }

      // Send real-time message via WebSocket to the receiver
      const sent = this.appGateway.sendToUser(receiverId, 'newMessage', message);
      
      if (sent) {
        this.logger.log(`Real-time message delivered to ${receiverId} for chat ${chat.id}`);
      } else {
        this.logger.warn(`User ${receiverId} is offline. Message saved to database.`);
      }

      // Create database notification - try specialist first, then user
      const notificationText = params.message 
        ? `You have a new message: "${params.message.substring(0, 50)}${params.message.length > 50 ? '...' : ''}"`
        : `You have a new ${params.type || 'multimedia'} message`;

      try {
        await this.notificationService.createNotification({
          title: 'New Chat Message',
          message: notificationText,
          specialistId: receiverId,
        });
      } catch (error) {
        try {
          await this.notificationService.createNotification({
            title: 'New Chat Message',
            message: notificationText,
            userId: receiverId,
          });
        } catch (err) {
          this.logger.warn(`Could not create notification for ${receiverId}`);
        }
      }
      
      this.logger.log(`Database notification created for ${receiverId}`);
    }

    return message;
  }

  async getChatMessages(chatId: string): Promise<ChatMessageEntity[]> {
    return this.chatRepository.getMessages(chatId);
  }

  async markMessageAsRead(messageId: string): Promise<ChatMessageEntity> {
    return this.chatRepository.markMessageAsRead(messageId);
  }

  async recordMissedCall(chatId: string, senderId: string): Promise<ChatMessageEntity | null> {
    const chat = await this.chatRepository.findChatById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat with id ${chatId} not found`);
    }

    // 🛡️ DURABLE TIMEOUT CHECK (Rule 6 Multi-Instance Fix)
    // Before recording as missed, check if an answer was ALREADY sent in the chat history
    // (This handles cases where the call was answered on a different instance)
    const recentMessages = await this.chatRepository.getMessages(chatId);
    const hasAnswered = recentMessages.some(m => 
      m.type === 'SYSTEM' && 
      m.message.startsWith('CALL_ANSWER:') &&
      new Date(m.createdAt).getTime() > Date.now() - 60000 
    );

    if (hasAnswered) {
      this.logger.log(`Skipping missed call record for ${chatId}: Durable check found a recent CALL_ANSWER.`);
      return null;
    }

    const message = await this.chatRepository.addMessage({
      chatId,
      senderId,
      message: 'Missed Call',
      type: 'MISSED_CALL',
    });

    const receiverId = chat.participant1Id === senderId ? chat.participant2Id : chat.participant1Id;
    this.appGateway.sendToUser(receiverId, 'newMessage', message);

    // Create system notification for missed call
    try {
      await this.notificationService.createNotification({
        title: 'Missed Call',
        message: 'You have a missed call from a participant',
        specialistId: receiverId,
      });
    } catch (error) {
      try {
        await this.notificationService.createNotification({
          title: 'Missed Call',
          message: 'You have a missed call from a participant',
          userId: receiverId,
        });
      } catch (err) {
        this.logger.warn(`Could not create missed call notification for ${receiverId}`);
      }
    }

    return message;
  }

  /**
   * Verifies if a call/chat session should still be considered active.
   * This is used to prevent race conditions where a call is recorded as missed
   * after it has already been answered or the session has ended.
   */
  async isCallStillActive(chatId: string): Promise<boolean> {
    const chat = await this.chatRepository.findChatById(chatId);
    if (!chat) return false;

    // Check for active appointment session
    const activeAppointment = await this.prisma.appointment.findFirst({
      where: {
        OR: [
          { userId: chat.participant1Id, specialistId: chat.participant2Id },
          { userId: chat.participant2Id, specialistId: chat.participant1Id },
        ],
        status: AppointmentStatus.IN_PROGRESS,
      },
    });

    return !!activeAppointment;
  }
}
