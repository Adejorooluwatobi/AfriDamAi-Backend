import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
export declare enum CallState {
    INITIATED = "initiated",
    RINGING = "ringing",
    ANSWERED = "answered",
    CONNECTED = "connected",
    ENDED = "ended",
    MISSED = "missed",
    FAILED = "failed"
}
export declare class AppGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private readonly jwtService;
    private readonly configService;
    private readonly moduleRef;
    server: Server;
    private readonly logger;
    private clients;
    private socketUserMap;
    private calls;
    private activeCalls;
    private iceBuffer;
    constructor(jwtService: JwtService, configService: ConfigService, moduleRef: ModuleRef);
    afterInit(server: Server): Promise<void>;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    private extractTokenFromHandshake;
    broadcastMessage(event: string, payload: any): void;
    sendToUser(userId: string, event: string, payload: any): boolean;
    sendToUsers(userIds: string[], event: string, payload: any): string[];
    getConnectionsForUser(userId: string): Socket[] | undefined;
    handleCallOffer(client: Socket, payload: {
        to: string;
        offer: any;
        chatId: string;
        type: 'voice' | 'video';
    }): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    handleCallAnswer(client: Socket, payload: {
        to: string;
        answer: any;
        chatId: string;
        type: 'voice' | 'video';
    }): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    handleIceCandidate(client: Socket, payload: {
        to: string;
        candidate: any;
        chatId: string;
    }): {
        success: boolean;
    };
    handleCallEnd(client: Socket, payload: {
        to: string;
        chatId: string;
    }): {
        success: boolean;
    };
    handleReconnect(client: Socket, payload: {
        chatId: string;
        peerId: string;
    }): void;
    private getUserIdFromSocket;
}
