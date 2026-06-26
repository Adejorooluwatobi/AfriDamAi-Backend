import { AppService } from './application/use-cases/app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getHealth(): {
        status: string;
        timestamp: string;
        service: string;
        version: string;
    };
    getFeatures(): {
        features: ({
            name: string;
            description: string;
            enabled: boolean;
            pricing?: undefined;
        } | {
            name: string;
            description: string;
            pricing: {
                instantSession: string;
                starterPlan: string;
            };
            enabled: boolean;
        })[];
    };
}
