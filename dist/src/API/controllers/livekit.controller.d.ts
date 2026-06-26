import { LiveKitService } from '../../infrastructure/messaging/livekit.service';
import { ConfigService } from '@nestjs/config';
import { LiveKitTokenDto } from 'src/application/DTOs/livekit/livekit-token.dto';
export declare class LiveKitController {
    private readonly livekitService;
    private readonly configService;
    private readonly logger;
    constructor(livekitService: LiveKitService, configService: ConfigService);
    getToken(query: LiveKitTokenDto): Promise<{
        token: string;
        serverUrl: string;
    }>;
    handleWebhook(req: any, authHeader: string): Promise<{
        received: boolean;
    }>;
    listRooms(): Promise<import("livekit-server-sdk").Room[]>;
    deleteRoom(roomName: string): Promise<{
        success: boolean;
    }>;
}
