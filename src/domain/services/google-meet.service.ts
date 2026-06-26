import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { JWT, GoogleAuth } from 'google-auth-library';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Service to handle Google Meet API integration using Domain-Wide Delegation.
 * 
 * LOCAL DEV: Uses GOOGLE_APPLICATION_CREDENTIALS key file with DWD.
 * CLOUD RUN: Uses Application Default Credentials (ADC). The Cloud Run service account
 *            must have the meetings.space.created scope configured in Google Admin DWD.
 */
@Injectable()
export class GoogleMeetService implements OnModuleInit {
    private readonly logger = new Logger(GoogleMeetService.name);
    private authClient: JWT | null = null;
    private readonly MEET_SCOPE = 'https://www.googleapis.com/auth/meetings.space.created';

    async onModuleInit() {
        await this.initializeAuthClient();
    }

    private async initializeAuthClient() {
        try {
            const subjectEmail = process.env.GOOGLE_WORKSPACE_ADMIN_EMAIL || process.env.MAIL_USER;
            const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
                path.join(process.cwd(), 'service-account.json');

            if (!subjectEmail) {
                this.logger.error('❌ GOOGLE_WORKSPACE_ADMIN_EMAIL or MAIL_USER is not set. Meet API will NOT work without an impersonation email.');
                return;
            }

            if (fs.existsSync(keyFilePath)) {
                // Local Dev: Use service account key file
                this.logger.log(`✅ Using service account key file at: ${keyFilePath}`);
                this.authClient = new JWT({
                    keyFile: keyFilePath,
                    scopes: [this.MEET_SCOPE],
                    subject: subjectEmail,
                });
            } else {
                // Cloud Run: Use ADC — but we still need DWD, so we use GoogleAuth
                // and manually impersonate via JWT after getting the service account email.
                this.logger.warn(`⚠️  No key file found at ${keyFilePath}. Attempting Application Default Credentials (ADC) — suitable for Cloud Run.`);
                const auth = new GoogleAuth({ scopes: [this.MEET_SCOPE] });
                const client = await auth.getClient();
                
                // Cast to JWT to allow impersonation if it's a JWT client
                if (client instanceof JWT) {
                    client.subject = subjectEmail;
                    this.authClient = client;
                } else {
                    // For Cloud Run, create a JWT from the ADC metadata
                    this.logger.warn('Running on Cloud Run with ADC — ensure the service account is configured for DWD in Google Admin Console.');
                    this.authClient = null; // will fallback to direct ADC below
                }
            }

            this.logger.log(`✅ Google Meet Service Initialized. Impersonating: ${subjectEmail}`);
        } catch (error) {
            this.logger.error('❌ Failed to initialize Google Meet Auth Client:', error.message);
        }
    }

    /**
     * Creates a new Google Meet space and returns its joining URL.
     * @returns The generated Google Meet URL, or null if creation fails.
     */
    async createMeetSpace(): Promise<string | null> {
        try {
            let accessToken: string | null = null;

            if (this.authClient) {
                const tokenResponse = await this.authClient.getAccessToken();
                accessToken = tokenResponse.token ?? null;
            } else {
                // Fallback: Try ADC directly for Cloud Run
                const auth = new GoogleAuth({ scopes: [this.MEET_SCOPE] });
                const client = await auth.getClient();
                const tokenResponse = await client.getAccessToken();
                accessToken = tokenResponse.token ?? null;
            }

            if (!accessToken) {
                this.logger.error('❌ Failed to retrieve Google access token. Check DWD configuration in Google Admin Console.');
                return null;
            }

            const response = await axios.post(
                'https://meet.googleapis.com/v2/spaces',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data?.meetingUri) {
                this.logger.log(`✅ Created Google Meet Space: ${response.data.meetingUri}`);
                return response.data.meetingUri;
            }

            this.logger.warn('⚠️  Meet API responded but meetingUri was missing from response:', JSON.stringify(response.data));
            return null;
        } catch (error) {
            const status = error.response?.status;
            const apiError = error.response?.data?.error?.message || error.message;
            this.logger.error(`❌ Error creating Google Meet Space [HTTP ${status}]: ${apiError}`);
            
            if (status === 403) {
                this.logger.error('👉 403 Forbidden: The service account is not authorized. Ensure Domain-Wide Delegation is configured in Google Admin Console with the meetings.space.created scope.');
            } else if (status === 401) {
                this.logger.error('👉 401 Unauthorized: Invalid token. Check if GOOGLE_APPLICATION_CREDENTIALS key file path is correct and the key is valid.');
            }
            return null;
        }
    }
}
