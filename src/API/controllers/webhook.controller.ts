import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TransactionService } from 'src/domain/services/transaction.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
    private readonly logger = new Logger(WebhookController.name);

    constructor(private readonly transactionService: TransactionService) {}

    @Public()
    @Post('paystack')
    @ApiOperation({ summary: 'Handle Paystack Webhooks' })
    async handlePaystackWebhook(
        @Body() payload: any,
        @Headers('x-paystack-signature') signature: string,
    ) {
        this.logger.log(`Paystack Webhook Received: ${payload.event}`);
        return this.transactionService.handlePaystackWebhook(payload, signature);
    }
}
