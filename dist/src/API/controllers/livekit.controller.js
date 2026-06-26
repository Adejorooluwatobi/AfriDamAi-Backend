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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LiveKitController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveKitController = void 0;
const common_1 = require("@nestjs/common");
const livekit_service_1 = require("../../infrastructure/messaging/livekit.service");
const config_1 = require("@nestjs/config");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const swagger_1 = require("@nestjs/swagger");
const livekit_token_dto_1 = require("../../application/DTOs/livekit/livekit-token.dto");
let LiveKitController = LiveKitController_1 = class LiveKitController {
    constructor(livekitService, configService) {
        this.livekitService = livekitService;
        this.configService = configService;
        this.logger = new common_1.Logger(LiveKitController_1.name);
    }
    async getToken(query) {
        const { room, identity, metadata } = query;
        const token = await this.livekitService.generateToken(room, identity, metadata);
        return {
            token,
            serverUrl: this.configService.get('LIVEKIT_URL'),
        };
    }
    async handleWebhook(req, authHeader) {
        try {
            const event = await this.livekitService.verifyWebhook(req.rawBody, authHeader);
            this.logger.log(`LiveKit Webhook Received: ${event.event}`);
            switch (event.event) {
                case 'room_started':
                    this.logger.log(`Room started: ${event.room.name}`);
                    break;
                case 'room_finished':
                    this.logger.log(`Room finished: ${event.room.name}`);
                    break;
                case 'participant_joined':
                    this.logger.log(`Participant joined: ${event.participant.identity} in room ${event.room.name}`);
                    break;
                case 'participant_left':
                    this.logger.log(`Participant left: ${event.participant.identity} from room ${event.room.name}`);
                    break;
            }
            return { received: true };
        }
        catch (error) {
            this.logger.error('Webhook verification failed', error.stack);
            throw error;
        }
    }
    async listRooms() {
        return this.livekitService.listRooms();
    }
    async deleteRoom(roomName) {
        await this.livekitService.deleteRoom(roomName);
        return { success: true };
    }
};
exports.LiveKitController = LiveKitController;
__decorate([
    (0, common_1.Get)('token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a join token for a LiveKit room' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [livekit_token_dto_1.LiveKitTokenDto]),
    __metadata("design:returntype", Promise)
], LiveKitController.prototype, "getToken", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('webhooks/livekit'),
    (0, swagger_1.ApiOperation)({ summary: 'Handle LiveKit Webhooks' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('Authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LiveKitController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Get)('rooms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all active rooms' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LiveKitController.prototype, "listRooms", null);
__decorate([
    (0, common_1.Delete)('rooms/:roomName'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a room' }),
    __param(0, (0, common_1.Param)('roomName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LiveKitController.prototype, "deleteRoom", null);
exports.LiveKitController = LiveKitController = LiveKitController_1 = __decorate([
    (0, swagger_1.ApiTags)('Real-Time Communication (LiveKit)'),
    (0, common_1.Controller)('rtc'),
    __metadata("design:paramtypes", [livekit_service_1.LiveKitService,
        config_1.ConfigService])
], LiveKitController);
//# sourceMappingURL=livekit.controller.js.map