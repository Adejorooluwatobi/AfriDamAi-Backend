import { SetMetadata } from '@nestjs/common';

/**
 * 🛡️ PUBLIC DECORATOR
 * Rule 7: Allows the Paystack Webhook to bypass JWT security.
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);