  import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  import { URLSearchParams } from 'url';
  import { Logger, Inject, forwardRef } from '@nestjs/common';
  import { ModuleRef } from '@nestjs/core';
  import { ChatService } from 'src/domain/services/chat.service';
  import { createAdapter } from '@socket.io/redis-adapter';
  import { createClient } from 'redis';

  export enum CallState {
    INITIATED = 'initiated',
    RINGING = 'ringing',
    ANSWERED = 'answered',
    CONNECTED = 'connected',
    ENDED = 'ended',
    MISSED = 'missed',
    FAILED = 'failed'
  }
  
  @WebSocketGateway({ cors: true })
  export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server;
  
    private readonly logger = new Logger(AppGateway.name);
    // Map to store connected clients by userId. A user can have multiple connections.
    private clients: Map<string, Socket[]> = new Map();
    // Optimized lookup: socketId -> userId
    private socketUserMap = new Map<string, string>();
    // Comprehensive call state tracking
    private calls: Map<string, {
      callerId: string;
      receiverId: string;
      state: CallState;
      startedAt: number;
    }> = new Map();
    // Track active timeouts for calls: chatId-callerId-recipientId -> Timeout
    private activeCalls: Map<string, NodeJS.Timeout> = new Map();
    // ICE candidate buffer to prevent packet loss during connection setup
    private iceBuffer = new Map<string, any[]>();
  
    constructor(
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
      private readonly moduleRef: ModuleRef,
    ) {}

    async afterInit(server: Server) {
      const redisUrl = this.configService.get<string>('REDIS_URL');
      if (!redisUrl) {
        this.logger.warn('REDIS_URL not found, skipping Socket.io Redis adapter configuration');
        return;
      }

      try {
        const pubClient = createClient({ url: redisUrl });
        const subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);
        server.adapter(createAdapter(pubClient, subClient));
        this.logger.log('Redis adapter connected for socket scaling');
      } catch (err) {
        this.logger.error('Redis adapter failed to connect', err);
      }
    }
  
    async handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
  
      try {
        const token = this.extractTokenFromHandshake(client);
        if (!token) {
          this.logger.warn(`Client ${client.id} connection denied: No token provided.`);
          client.disconnect(true);
          return;
        }
  
        const secret = this.configService.get<string>('JWT_SECRET');
        const payload = this.jwtService.verify(token, { secret });
  
        const userId = payload.sub; // Assuming 'sub' contains the user ID
        const userRole = payload.role; // Assuming 'role' contains the user role
  
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
  
        // Join a personal room so server.to(userId).emit() works across all instances
        client.join(userId);
  
        this.logger.log(`Client ${client.id} connected as User ID: ${userId}, Role: ${userRole}`);
      } catch (error) {
        this.logger.error(`Client ${client.id} authentication failed: ${error.message}`);
        client.disconnect(true);
      }
    }
  
    handleDisconnect(client: Socket) {
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
  
    private extractTokenFromHandshake(client: Socket): string | null {
      // Try to get token from query parameters first (e.g., for browser clients)
      const query = client.handshake.url ? new URLSearchParams(client.handshake.url.split('?')[1]) : null;
      const tokenFromQuery = query ? query.get('token') : null; const tokenFromAuth = client.handshake.auth?.token;
  
      if (tokenFromAuth) { return tokenFromAuth; } if (tokenFromQuery) {
        return tokenFromQuery;
      }
  
      // Fallback to authorization header (e.g., for some client libraries)
      const authHeader = client.handshake.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
      }
  
      return null;
    }
  
    /**
     * Sends a message to all connected clients.
     * @param event The event name.
     * @param payload The data to send.
     */
    broadcastMessage(event: string, payload: any) {
      this.server.emit(event, payload);
      this.logger.debug(`Broadcasting event '${event}' with payload: ${JSON.stringify(payload)}`);
    }
  
    /**
     * Sends a message to a specific user by their ID.
     * @param userId The ID of the user to send the message to.
     * @param event The event name.
     * @param payload The data to send.
     * @returns True if the message was sent to at least one client, false otherwise.
     */
    sendToUser(userId: string, event: string, payload: any): boolean {
      // Primary: emit to the room named by userId.
      // This works even when the recipient is connected to a different Cloud Run instance
      // because Socket.io rooms broadcast to all sockets in the room server-wide.
      this.server.to(userId).emit(event, payload);
      this.logger.debug(`Emitted event '${event}' to room '${userId}'`);

      // Also emit directly to any locally-tracked sockets for immediate delivery
      const sockets = this.clients.get(userId);
      if (sockets && sockets.length > 0) {
        sockets.forEach(socket => {
          socket.emit(event, payload);
        });
        return true;
      }

      // Return true optimistically — the room broadcast may have reached a different instance
      this.logger.warn(`No local sockets for user ${userId}, relied on room broadcast for event '${event}'`);
      return true;
    }
  
    /**
     * Sends a message to multiple users by their IDs.
     * @param userIds An array of user IDs to send the message to.
     * @param event The event name.
     * @param payload The data to send.
     * @returns An array of user IDs to whom the message was successfully sent to at least one client.
     */
    sendToUsers(userIds: string[], event: string, payload: any): string[] {
      const successfullySentUsers: string[] = [];
      userIds.forEach(userId => {
        if (this.sendToUser(userId, event, payload)) {
          successfullySentUsers.push(userId);
        }
      });
      return successfullySentUsers;
    }
  
    /**
     * Retrieves all active connections for a given user ID.
     * @param userId The ID of the user.
     * @returns An array of Socket instances for the user, or undefined if no connections.
     */
    getConnectionsForUser(userId: string): Socket[] | undefined {
      return this.clients.get(userId);
    }

    /**
     * WebRTC Signaling Handlers
     */
    @SubscribeMessage('call-offer')
    async handleCallOffer(client: Socket, payload: { to: string; offer: any; chatId: string; type: 'voice' | 'video' }) {
      const fromId = this.getUserIdFromSocket(client);
      if (!fromId) return { success: false, error: 'User not authenticated' };

      const callId = `${payload.chatId}-${fromId}-${payload.to}`;
      this.logger.log(`[CALL] Offer from ${fromId} to ${payload.to} (ID: ${callId})`);

      // Track call state
      this.calls.set(callId, {
        callerId: fromId,
        receiverId: payload.to,
        state: CallState.RINGING,
        startedAt: Date.now()
      });

      // 🛡️ DURABLE SIGNALING: Save to DB for cross-instance/reconnect resilience
      let signalId: string | undefined;
      try {
        const chatService = this.moduleRef.get(ChatService, { strict: false });
        const savedMsg = await chatService.sendMessage({
          chatId: payload.chatId,
          senderId: fromId,
          message: `CALL_OFFER:${payload.type}:${JSON.stringify(payload.offer)}`,
          type: 'SYSTEM' as any,
        });
        signalId = savedMsg?.id;
      } catch (e) {
        this.logger.warn(`Signaling Persistence Failed: ${e.message}`);
      }

      const sent = this.sendToUser(payload.to, 'call-offer', {
        from: fromId,
        offer: payload.offer,
        chatId: payload.chatId,
        type: payload.type,
        signalId,
      });

      // Set timeout for missed call logic
      const timeout = setTimeout(async () => {
        const call = this.calls.get(callId);
        if (call && call.state === CallState.RINGING) {
          call.state = CallState.MISSED;
          this.logger.log(`Call timeout for ${callId}. Recording missed call.`);
          
          try {
            const chatService = this.moduleRef.get(ChatService, { strict: false });
            // Verify call is still ringing in DB/Service before marking missed
            const stillActive = await chatService.isCallStillActive ? await chatService.isCallStillActive(payload.chatId) : true;
            if (stillActive) {
                await chatService.recordMissedCall(payload.chatId, fromId);
            }
          } catch (error) {
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

    @SubscribeMessage('call-answer')
    async handleCallAnswer(client: Socket, payload: { to: string; answer: any; chatId: string; type: 'voice' | 'video' }) {
      const fromId = this.getUserIdFromSocket(client);
      if (!fromId) return { success: false, error: 'User not authenticated' };

      const callId = `${payload.chatId}-${payload.to}-${fromId}`;
      const call = this.calls.get(callId);

      if (!call) {
        this.logger.warn(`Answer received for untracked call ${callId}`);
        // Still attempt to send the answer for robustness
      } else {
        call.state = CallState.ANSWERED;
      }

      // Clear ringing timeout
      const timeout = this.activeCalls.get(callId);
      if (timeout) {
        clearTimeout(timeout);
        this.activeCalls.delete(callId);
      }

      // Flush ICE buffer for this call
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

      // 🛡️ DURABLE ANSWER
      let signalId: string | undefined;
      try {
        const chatService = this.moduleRef.get(ChatService, { strict: false });
        const savedMsg = await chatService.sendMessage({
          chatId: payload.chatId,
          senderId: fromId,
          message: `CALL_ANSWER:${payload.type || 'voice'}:${JSON.stringify(payload.answer)}`,
          type: 'SYSTEM' as any,
        });
        signalId = savedMsg?.id;
      } catch (e) {
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

    @SubscribeMessage('ice-candidate')
    handleIceCandidate(client: Socket, payload: { to: string; candidate: any; chatId: string }) {
      const fromId = this.getUserIdFromSocket(client);
      if (!fromId) return { success: false };

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

    @SubscribeMessage('call-end')
    handleCallEnd(client: Socket, payload: { to: string; chatId: string }) {
      const fromId = this.getUserIdFromSocket(client);
      if (!fromId) return { success: false };

      const callId1 = `${payload.chatId}-${fromId}-${payload.to}`;
      const callId2 = `${payload.chatId}-${payload.to}-${fromId}`;

      const call = this.calls.get(callId1) || this.calls.get(callId2);
      if (call) {
        call.state = CallState.ENDED;
        this.calls.delete(callId1);
        this.calls.delete(callId2);
      }

      // Cleanup timeouts
      [callId1, callId2].forEach(id => {
        if (this.activeCalls.has(id)) {
          clearTimeout(this.activeCalls.get(id));
          this.activeCalls.delete(id);
        }
      });

      this.sendToUser(payload.to, 'call-end', { from: fromId, chatId: payload.chatId });
      return { success: true };
    }

    @SubscribeMessage('call-reconnect')
    handleReconnect(client: Socket, payload: { chatId: string; peerId: string }) {
      const userId = this.getUserIdFromSocket(client);
      if (!userId) return;

      const callId = `${payload.chatId}-${payload.peerId}-${userId}`;
      const call = this.calls.get(callId);

      if (call && call.state === CallState.ANSWERED) {
        this.sendToUser(payload.peerId, 'peer-reconnect', { userId });
      }
    }

    /**
     * Helper to get userId from socket.
     * Primary: checks local clients Map (fast, same-instance).
     * Fallback: decodes the JWT from the socket's handshake token (works cross-instance on Cloud Run).
     */
    private getUserIdFromSocket(socket: Socket): string | null {
      // 1. Optimized local lookup
      const cachedUserId = this.socketUserMap.get(socket.id);
      if (cachedUserId) return cachedUserId;

      // 2. Fallback: decode userId directly from the socket's JWT handshake token.
      try {
        const token = this.extractTokenFromHandshake(socket);
        if (token) {
          const secret = this.configService.get<string>('JWT_SECRET');
          const payload = this.jwtService.verify(token, { secret });
          const userId = payload.sub || payload.id;
          if (userId) {
            this.logger.debug(`Resolved userId ${userId} from JWT handshake.`);
            return userId;
          }
        }
      } catch (e) {
        this.logger.warn(`getUserIdFromSocket fallback failed: ${e.message}`);
      }

      return null;
    }
  }
