import { OnModuleInit } from '@nestjs/common';
export declare class GoogleMeetService implements OnModuleInit {
    private readonly logger;
    private authClient;
    private readonly MEET_SCOPE;
    onModuleInit(): Promise<void>;
    private initializeAuthClient;
    createMeetSpace(): Promise<string | null>;
}
