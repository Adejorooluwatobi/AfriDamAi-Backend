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
var AppGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGateway = exports.CallState = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const url_1 = require("url");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const chat_service_1 = require("../../domain/services/chat.service");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
var CallState;
(function (CallState) {
    CallState["INITIATED"] = "initiated";
    CallState["RINGING"] = "ringing";
    CallState["ANSWERED"] = "answered";
    CallState["CONNECTED"] = "connected";
    CallState["ENDED"] = "ended";
    CallState["MISSED"] = "missed";
    CallState["FAILED"] = "failed";
})(CallState || (exports.CallState = CallState = {}));
let AppGateway = AppGateway_1 = class AppGateway {
    constructor(jwtService, configService, moduleRef) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.moduleRef = moduleRef;
        this.logger = new common_1.Logger(AppGateway_1.name);
        this.clients = new Map();
        this.socketUserMap = new Map();
        this.calls = new Map();
        this.activeCalls = new Map();
        this.iceBuffer = new Map();
    }
    async afterInit(server) {
        const redisUrl = this.configService.get('REDIS_URL');
        if (!redisUrl) {
            this.logger.warn('REDIS_URL not found, skipping Socket.io Redis adapter configuration');
            return;
        }
        try {
            const pubClient = (0, redis_1.createClient)({ url: redisUrl });
            const subClient = pubClient.duplicate();
            await Promise.all([pubClient.connect(), subClient.connect()]);
            server.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
            this.logger.log('Redis adapter connected for socket scaling');
        }
        catch (err) {
            this.logger.error('Redis adapter failed to connect', err);
        }
    }
    async handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        try {
            const token = this.extractTokenFromHandshake(client);
            if (!token) {
                this.logger.warn(`Client ${client.id} connection denied: No token provided.`);
                client.disconnect(true);
                return;
            }
            const secret = this.configService.get('JWT_SECRET');
            const payload = this.jwtService.verify(token, { secret });
            const userId = payload.sub;
            const userRole = payload.role;
            if (!userId) {
                this.logger.warn(`Client ${client.id} connection denied: No userId in token payload.`);
                client.disconnect(true);
                return;
            }
            if (!this.clients.has(userId)) {
                this.clients.set(userId, []);
            }
            this.clients.get(userId).push(client);
            this.socketUserMap.set(client.id, userId);
            client.join(userId);
            this.logger.log(`Client ${client.id} connected as User ID: ${userId}, Role: ${userRole}`);
        }
        catch (error) {
            this.logger.error(`Client ${client.id} authentication failed: ${error.message}`);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        const userId = this.socketUserMap.get(client.id);
        if (userId) {
            this.socketUserMap.delete(client.id);
            const sockets = this.clients.get(userId);
            if (sockets) {
                const index = sockets.indexOf(client);
                if (index > -1) {
                    sockets.splice(index, 1);
                    if (sockets.length === 0) {
                        this.clients.delete(userId);
                    }
                    this.logger.log(`User ID ${userId} removed client ${client.id}. Remaining connections: ${sockets.length}`);
                }
            }
        }
    }
    extractTokenFromHandshake(client) {
        const query = client.handshake.url ? new url_1.URLSearchParams(client.handshake.url.split('?')[1]) : null;
        const tokenFromQuery = query ? query.get('token') : null;
        const tokenFromAuth = client.handshake.auth?.token;
        if (tokenFromAuth) {
            return tokenFromAuth;
        }
        if (tokenFromQuery) {
            return tokenFromQuery;
        }
        const authHeader = client.handshake.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return null;
    }
    broadcastMessage(event, payload) {
        this.server.emit(event, payload);
        this.logger.debug(`Broadcasting event '${event}' with payload: ${JSON.stringify(payload)}`);
    }
    sendToUser(userId, event, payload) {
        this.server.to(userId).emit(event, payload);
        this.logger.debug(`Emitted event '${event}' to room '${userId}'`);
        const sockets = this.clients.get(userId);
        if (sockets && sockets.length > 0) {
            sockets.forEach(socket => {
                socket.emit(event, payload);
            });
            return true;
        }
        this.logger.warn(`No local sockets for user ${userId}, relied on room broadcast for event '${event}'`);
        return true;
    }
    sendToUsers(userIds, event, payload) {
        const successfullySentUsers = [];
        userIds.forEach(userId => {
            if (this.sendToUser(userId, event, payload)) {
                successfullySentUsers.push(userId);
            }
        });
        return successfullySentUsers;
    }
    getConnectionsForUser(userId) {
        return this.clients.get(userId);
    }
    async handleCallOffer(client, payload) {
        const fromId = this.getUserIdFromSocket(client);
        if (!fromId)
            return { success: false, error: 'User not authenticated' };
        const callId = `${payload.chatId}-${fromId}-${payload.to}`;
        this.logger.log(`[CALL] Offer from ${fromId} to ${payload.to} (ID: ${callId})`);
        this.calls.set(callId, {
            callerId: fromId,
            receiverId: payload.to,
            state: CallState.RINGING,
            startedAt: Date.now()
        });
        let signalId;
        try {
            const chatService = this.moduleRef.get(chat_service_1.ChatService, { strict: false });
            const savedMsg = await chatService.sendMessage({
                chatId: payload.chatId,
                senderId: fromId,
                message: `CALL_OFFER:${payload.type}:${JSON.stringify(payload.offer)}`,
                type: 'SYSTEM',
            });
            signalId = savedMsg?.id;
        }
        catch (e) {
            this.logger.warn(`Signaling Persistence Failed: ${e.message}`);
        }
        const sent = this.sendToUser(payload.to, 'call-offer', {
            from: fromId,
            offer: payload.offer,
            chatId: payload.chatId,
            type: payload.type,
            signalId,
        });
        const timeout = setTimeout(async () => {
            const call = this.calls.get(callId);
            if (call && call.state === CallState.RINGING) {
                call.state = CallState.MISSED;
                this.logger.log(`Call timeout for ${callId}. Recording missed call.`);
                try {
                    const chatService = this.moduleRef.get(chat_service_1.ChatService, { strict: false });
                    const stillActive = await chatService.isCallStillActive ? await chatService.isCallStillActive(payload.chatId) : true;
                    if (stillActive) {
                        await chatService.recordMissedCall(payload.chatId, fromId);
                    }
                }
                catch (error) {
                    this.logger.error(`Failed to record missed call: ${error.message}`);
                }
                this.sendToUser(fromId, 'call-missed', { to: payload.to, chatId: payload.chatId });
                this.calls.delete(callId);
                this.activeCalls.delete(callId);
            }
        }, 45000);
        this.activeCalls.set(callId, timeout);
        return { success: true };
    }
    async handleCallAnswer(client, payload) {
        const fromId = this.getUserIdFromSocket(client);
        if (!fromId)
            return { success: false, error: 'User not authenticated' };
        const callId = `${payload.chatId}-${payload.to}-${fromId}`;
        const call = this.calls.get(callId);
        if (!call) {
            this.logger.warn(`Answer received for untracked call ${callId}`);
        }
        else {
            call.state = CallState.ANSWERED;
        }
        const timeout = this.activeCalls.get(callId);
        if (timeout) {
            clearTimeout(timeout);
            this.activeCalls.delete(callId);
        }
        const iceKey = `${payload.chatId}-${payload.to}-${fromId}`;
        const bufferedIce = this.iceBuffer.get(iceKey);
        if (bufferedIce && bufferedIce.length > 0) {
            this.logger.log(`Flushing ${bufferedIce.length} buffered ICE candidates for ${iceKey}`);
            bufferedIce.forEach(candidate => {
                this.sendToUser(fromId, 'ice-candidate', {
                    from: payload.to,
                    candidate,
                    chatId: payload.chatId
                });
            });
            this.iceBuffer.delete(iceKey);
        }
        let signalId;
        try {
            const chatService = this.moduleRef.get(chat_service_1.ChatService, { strict: false });
            const savedMsg = await chatService.sendMessage({
                chatId: payload.chatId,
                senderId: fromId,
                message: `CALL_ANSWER:${payload.type || 'voice'}:${JSON.stringify(payload.answer)}`,
                type: 'SYSTEM',
            });
            signalId = savedMsg?.id;
        }
        catch (e) {
            this.logger.warn(`Answer Persistence Failed: ${e.message}`);
        }
        this.sendToUser(payload.to, 'call-answer', {
            from: fromId,
            answer: payload.answer,
            chatId: payload.chatId,
            type: payload.type,
            signalId,
        });
        return { success: true };
    }
    handleIceCandidate(client, payload) {
        const fromId = this.getUserIdFromSocket(client);
        if (!fromId)
            return { success: false };
        const key = `${payload.chatId}-${fromId}-${payload.to}`;
        if (!this.iceBuffer.has(key)) {
            this.iceBuffer.set(key, []);
        }
        this.iceBuffer.get(key).push(payload.candidate);
        this.sendToUser(payload.to, 'ice-candidate', {
            from: fromId,
            candidate: payload.candidate,
            chatId: payload.chatId,
        });
        return { success: true };
    }
    handleCallEnd(client, payload) {
        const fromId = this.getUserIdFromSocket(client);
        if (!fromId)
            return { success: false };
        const callId1 = `${payload.chatId}-${fromId}-${payload.to}`;
        const callId2 = `${payload.chatId}-${payload.to}-${fromId}`;
        const call = this.calls.get(callId1) || this.calls.get(callId2);
        if (call) {
            call.state = CallState.ENDED;
            this.calls.delete(callId1);
            this.calls.delete(callId2);
        }
        [callId1, callId2].forEach(id => {
            if (this.activeCalls.has(id)) {
                clearTimeout(this.activeCalls.get(id));
                this.activeCalls.delete(id);
            }
        });
        this.sendToUser(payload.to, 'call-end', { from: fromId, chatId: payload.chatId });
        return { success: true };
    }
    handleReconnect(client, payload) {
        const userId = this.getUserIdFromSocket(client);
        if (!userId)
            return;
        const callId = `${payload.chatId}-${payload.peerId}-${userId}`;
        const call = this.calls.get(callId);
        if (call && call.state === CallState.ANSWERED) {
            this.sendToUser(payload.peerId, 'peer-reconnect', { userId });
        }
    }
    getUserIdFromSocket(socket) {
        const cachedUserId = this.socketUserMap.get(socket.id);
        if (cachedUserId)
            return cachedUserId;
        try {
            const token = this.extractTokenFromHandshake(socket);
            if (token) {
                const secret = this.configService.get('JWT_SECRET');
                const payload = this.jwtService.verify(token, { secret });
                const userId = payload.sub || payload.id;
                if (userId) {
                    this.logger.debug(`Resolved userId ${userId} from JWT handshake.`);
                    return userId;
                }
            }
        }
        catch (e) {
            this.logger.warn(`getUserIdFromSocket fallback failed: ${e.message}`);
        }
        return null;
    }
};
exports.AppGateway = AppGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('call-offer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "handleCallOffer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('call-answer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "handleCallAnswer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ice-candidate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleIceCandidate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('call-end'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleCallEnd", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('call-reconnect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleReconnect", null);
exports.AppGateway = AppGateway = AppGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        core_1.ModuleRef])
], AppGateway);
//# sourceMappingURL=app.gateway.js.map