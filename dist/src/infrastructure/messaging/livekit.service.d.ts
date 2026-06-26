import { ConfigService } from '@nestjs/config';
export declare class LiveKitService {
    private configService;
    private readonly logger;
    private roomService;
    private webhookReceiver;
    constructor(configService: ConfigService);
    generateToken(roomName: string, participantName: string, metadata?: string): Promise<string>;
    verifyWebhook(body: string, signature: string): Promise<import("livekit-server-sdk").WebhookEvent>;
    listRooms(): Promise<import("livekit-server-sdk").Room[]>;
    deleteRoom(roomName: string): Promise<void>;
    removeParticipant(roomName: string, identity: string): Promise<void>;
}
