import { HttpService } from '@nestjs/axios';
import { PaymentGatewayInterface, PaymentInitializeResult, PaymentVerificationResult } from 'src/domain/interfaces/payment-gateway.interface';
import { EnvironmentService } from 'src/shared/services/environment.service';
export declare class PaystackGateway implements PaymentGatewayInterface {
    private readonly httpService;
    private readonly envService;
    private readonly logger;
    private readonly baseUrl;
    constructor(httpService: HttpService, envService: EnvironmentService);
    initializePayment(email: string, amount: number, metadata?: any, plan?: string): Promise<PaymentInitializeResult>;
    verifyPayment(reference: string): Promise<PaymentVerificationResult>;
}
