import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessToken, RoomServiceClient, WebhookReceiver } from 'livekit-server-sdk';

@Injectable()
export class LiveKitService {
  private readonly logger = new Logger(LiveKitService.name);
  private roomService: RoomServiceClient;
  private webhookReceiver: WebhookReceiver;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('LIVEKIT_API_KEY');
    const apiSecret = this.configService.get<string>('LIVEKIT_API_SECRET');
    const apiUrl = this.configService.get<string>('LIVEKIT_API_URL') || this.configService.get<string>('LIVEKIT_URL')?.replace('wss://', 'https://');

    if (apiKey && apiSecret && apiUrl) {
      this.roomService = new RoomServiceClient(apiUrl, apiKey, apiSecret);
      this.webhookReceiver = new WebhookReceiver(apiKey, apiSecret);
    } else {
      this.logger.warn('LiveKit credentials or API URL are not fully configured');
    }
  }

  /**
   * Generates a secure token for a participant to join a specific room.
   */
  async generateToken(roomName: string, participantName: string, metadata?: string): Promise<string> {
    const apiKey = this.configService.get<string>('LIVEKIT_API_KEY');
    const apiSecret = this.configService.get<string>('LIVEKIT_API_SECRET');

    if (!apiKey || !apiSecret) {
      throw new InternalServerErrorException('LiveKit credentials are not configured');
    }

    // Initialize the AccessToken
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      ttl: '2h',
      metadata, // Can store user info like role, avatar, etc.
    });

    // Add permissions (Grants)
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return at.toJwt();
  }

  /**
   * Verifies and decodes a LiveKit webhook event.
   */
  async verifyWebhook(body: string, signature: string) {
    if (!this.webhookReceiver) {
      throw new InternalServerErrorException('Webhook receiver not initialized');
    }
    return this.webhookReceiver.receive(body, signature);
  }

  /**
   * Lists all active rooms.
   */
  async listRooms() {
    if (!this.roomService) throw new InternalServerErrorException('Room service not initialized');
    return this.roomService.listRooms();
  }

  /**
   * Deletes a room and kicks all participants.
   */
  async deleteRoom(roomName: string) {
    if (!this.roomService) throw new InternalServerErrorException('Room service not initialized');
    return this.roomService.deleteRoom(roomName);
  }

  /**
   * Removes a participant from a room.
   */
  async removeParticipant(roomName: string, identity: string) {
    if (!this.roomService) throw new InternalServerErrorException('Room service not initialized');
    return this.roomService.removeParticipant(roomName, identity);
  }
}
