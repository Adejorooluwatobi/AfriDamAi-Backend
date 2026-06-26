"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var GoogleMeetService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleMeetService = void 0;
const common_1 = require("@nestjs/common");
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let GoogleMeetService = GoogleMeetService_1 = class GoogleMeetService {
    constructor() {
        this.logger = new common_1.Logger(GoogleMeetService_1.name);
        this.authClient = null;
        this.MEET_SCOPE = 'https://www.googleapis.com/auth/meetings.space.created';
    }
    async onModuleInit() {
        await this.initializeAuthClient();
    }
    async initializeAuthClient() {
        try {
            const subjectEmail = process.env.GOOGLE_WORKSPACE_ADMIN_EMAIL || process.env.MAIL_USER;
            const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
                path.join(process.cwd(), 'service-account.json');
            if (!subjectEmail) {
                this.logger.error('❌ GOOGLE_WORKSPACE_ADMIN_EMAIL or MAIL_USER is not set. Meet API will NOT work without an impersonation email.');
                return;
            }
            if (fs.existsSync(keyFilePath)) {
                this.logger.log(`✅ Using service account key file at: ${keyFilePath}`);
                this.authClient = new google_auth_library_1.JWT({
                    keyFile: keyFilePath,
                    scopes: [this.MEET_SCOPE],
                    subject: subjectEmail,
                });
            }
            else {
                this.logger.warn(`⚠️  No key file found at ${keyFilePath}. Attempting Application Default Credentials (ADC) — suitable for Cloud Run.`);
                const auth = new google_auth_library_1.GoogleAuth({ scopes: [this.MEET_SCOPE] });
                const client = await auth.getClient();
                if (client instanceof google_auth_library_1.JWT) {
                    client.subject = subjectEmail;
                    this.authClient = client;
                }
                else {
                    this.logger.warn('Running on Cloud Run with ADC — ensure the service account is configured for DWD in Google Admin Console.');
                    this.authClient = null;
                }
            }
            this.logger.log(`✅ Google Meet Service Initialized. Impersonating: ${subjectEmail}`);
        }
        catch (error) {
            this.logger.error('❌ Failed to initialize Google Meet Auth Client:', error.message);
        }
    }
    async createMeetSpace() {
        try {
            let accessToken = null;
            if (this.authClient) {
                const tokenResponse = await this.authClient.getAccessToken();
                accessToken = tokenResponse.token ?? null;
            }
            else {
                const auth = new google_auth_library_1.GoogleAuth({ scopes: [this.MEET_SCOPE] });
                const client = await auth.getClient();
                const tokenResponse = await client.getAccessToken();
                accessToken = tokenResponse.token ?? null;
            }
            if (!accessToken) {
                this.logger.error('❌ Failed to retrieve Google access token. Check DWD configuration in Google Admin Console.');
                return null;
            }
            const response = await axios_1.default.post('https://meet.googleapis.com/v2/spaces', {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.data?.meetingUri) {
                this.logger.log(`✅ Created Google Meet Space: ${response.data.meetingUri}`);
                return response.data.meetingUri;
            }
            this.logger.warn('⚠️  Meet API responded but meetingUri was missing from response:', JSON.stringify(response.data));
            return null;
        }
        catch (error) {
            const status = error.response?.status;
            const apiError = error.response?.data?.error?.message || error.message;
            this.logger.error(`❌ Error creating Google Meet Space [HTTP ${status}]: ${apiError}`);
            if (status === 403) {
                this.logger.error('👉 403 Forbidden: The service account is not authorized. Ensure Domain-Wide Delegation is configured in Google Admin Console with the meetings.space.created scope.');
            }
            else if (status === 401) {
                this.logger.error('👉 401 Unauthorized: Invalid token. Check if GOOGLE_APPLICATION_CREDENTIALS key file path is correct and the key is valid.');
            }
            return null;
        }
    }
};
exports.GoogleMeetService = GoogleMeetService;
exports.GoogleMeetService = GoogleMeetService = GoogleMeetService_1 = __decorate([
    (0, common_1.Injectable)()
], GoogleMeetService);
//# sourceMappingURL=google-meet.service.js.map