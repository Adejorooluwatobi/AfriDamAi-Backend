"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LiveKitService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveKitService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const livekit_server_sdk_1 = require("livekit-server-sdk");
let LiveKitService = LiveKitService_1 = class LiveKitService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(LiveKitService_1.name);
        const apiKey = this.configService.get('LIVEKIT_API_KEY');
        const apiSecret = this.configService.get('LIVEKIT_API_SECRET');
        const apiUrl = this.configService.get('LIVEKIT_API_URL') || this.configService.get('LIVEKIT_URL')?.replace('wss://', 'https://');
        if (apiKey && apiSecret && apiUrl) {
            this.roomService = new livekit_server_sdk_1.RoomServiceClient(apiUrl, apiKey, apiSecret);
            this.webhookReceiver = new livekit_server_sdk_1.WebhookReceiver(apiKey, apiSecret);
        }
        else {
            this.logger.warn('LiveKit credentials or API URL are not fully configured');
        }
    }
    async generateToken(roomName, participantName, metadata) {
        const apiKey = this.configService.get('LIVEKIT_API_KEY');
        const apiSecret = this.configService.get('LIVEKIT_API_SECRET');
        if (!apiKey || !apiSecret) {
            throw new common_1.InternalServerErrorException('LiveKit credentials are not configured');
        }
        const at = new livekit_server_sdk_1.AccessToken(apiKey, apiSecret, {
            identity: participantName,
            ttl: '2h',
            metadata,
        });
        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
        });
        return at.toJwt();
    }
    async verifyWebhook(body, signature) {
        if (!this.webhookReceiver) {
            throw new common_1.InternalServerErrorException('Webhook receiver not initialized');
        }
        return this.webhookReceiver.receive(body, signature);
    }
    async listRooms() {
        if (!this.roomService)
            throw new common_1.InternalServerErrorException('Room service not initialized');
        return this.roomService.listRooms();
    }
    async deleteRoom(roomName) {
        if (!this.roomService)
            throw new common_1.InternalServerErrorException('Room service not initialized');
        return this.roomService.deleteRoom(roomName);
    }
    async removeParticipant(roomName, identity) {
        if (!this.roomService)
            throw new common_1.InternalServerErrorException('Room service not initialized');
        return this.roomService.removeParticipant(roomName, identity);
    }
};
exports.LiveKitService = LiveKitService;
exports.LiveKitService = LiveKitService = LiveKitService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LiveKitService);
//# sourceMappingURL=livekit.service.js.map