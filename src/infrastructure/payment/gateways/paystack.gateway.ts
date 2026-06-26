import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  PaymentGatewayInterface,
  PaymentInitializeResult,
  PaymentVerificationResult,
} from 'src/domain/interfaces/payment-gateway.interface';
import { EnvironmentService } from 'src/shared/services/environment.service';

@Injectable()
export class PaystackGateway implements PaymentGatewayInterface {
  private readonly logger = new Logger(PaystackGateway.name);
  private readonly baseUrl = 'https://api.paystack.co';

  constructor(
    private readonly httpService: HttpService,
    private readonly envService: EnvironmentService,
  ) {}

  /**
   * 💳 INITIALIZE PAYMENT
   * Rule 7: Synced with USD positioning and Phase 4 Callback UI
   */
  async initializePayment(
    email: string,
    amount: number,
    metadata?: any,
    plan: string = '', // Can be plan code
  ): Promise<PaymentInitializeResult> {
    // 🛡️ Paystack requires amount in base units (Cents/Kobo)
    const amountInBaseUnit = Math.round(amount * 100);
    
    // Rule 7: Standardized reference format for easier tracking in Prisma
    const reference = `AFRIDAM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const body: any = {
      email,
      amount: amountInBaseUnit,
      reference,
      currency: "NGN", 
      callback_url: `${this.envService.frontendUrl}/payment-success`,
      metadata: {
        ...metadata,
        custom_fields: [
          {
            display_name: "Service Provider",
            variable_name: "service_provider",
            value: "AfriDam AI Clinical Hub"
          }
        ]
      },
    };

    if (plan) {
      body.plan = plan;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/transaction/initialize`,
          body,
          {
            headers: {
              Authorization: `Bearer ${this.envService.paystackSecretKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return {
        reference,
        authorizationUrl: response.data.data.authorization_url,
      };
    } catch (error: any) {
      this.logger.error('Paystack Initialization Failed', error.response?.data || error.message);
      // Rule 3: Simple English error for the team
      throw new InternalServerErrorException('We could not connect to the payment processor. Please try again.');
    }
  }

  /**
   * 🔍 VERIFY PAYMENT
   * Rule 7: Core verification for both Manual and Webhook flows
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResult> {
    try {
      this.logger.log(`Verifying Paystack Transaction: ${reference}`);

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${this.envService.paystackSecretKey}`,
          },
        }),
      );

      const data = response.data.data;
      const status = data.status;

      let resultStatus: 'COMPLETED' | 'FAILED' | 'PENDING';

      if (status === 'success') {
        resultStatus = 'COMPLETED';
      } else if (status === 'failed' || status === 'abandoned') {
        resultStatus = 'FAILED';
        this.logger.warn(`Transaction not successful: ${reference} - Status: ${status}`);
      } else {
        resultStatus = 'PENDING';
        this.logger.log(`Transaction is pending: ${reference} - Status: ${status}`);
      }

      return {
        status: resultStatus,
        gatewayTransactionId: String(data.id),
        amount: data.amount / 100, // Convert back to USD/Main unit
        currency: data.currency,
      };
    } catch (error: any) {
      this.logger.error('Paystack Verification Failed', error.response?.data || error.message);
      return { 
        status: 'FAILED', 
        gatewayTransactionId: '', 
        amount: 0, 
        currency: 'USD' 
      };
    }
  }
}