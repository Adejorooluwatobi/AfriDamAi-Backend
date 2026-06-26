import { Controller, Get, Post, Query, Body, Headers, UseGuards, Req, Delete, Param, Logger } from '@nestjs/common';
import { LiveKitService } from '../../infrastructure/messaging/livekit.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LiveKitTokenDto } from 'src/application/DTOs/livekit/livekit-token.dto';

@ApiTags('Real-Time Communication (LiveKit)')
@Controller('rtc')
export class LiveKitController {
  private readonly logger = new Logger(LiveKitController.name);

  constructor(
    private readonly livekitService: LiveKitService,
    private readonly configService: ConfigService,
  ) {}

  @Get('token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a join token for a LiveKit room' })
  async getToken(@Query() query: LiveKitTokenDto) {
    const { room, identity, metadata } = query;
    const token = await this.livekitService.generateToken(room, identity, metadata);
    
    return {
      token,
      serverUrl: this.configService.get<string>('LIVEKIT_URL'), 
    };
  }

  @Public()
  @Post('webhooks/livekit')
  @ApiOperation({ summary: 'Handle LiveKit Webhooks' })
  async handleWebhook(
    @Req() req: any,
    @Headers('Authorization') authHeader: string,
  ) {
    try {
      // Use the raw body for verification
      const event = await this.livekitService.verifyWebhook(req.rawBody, authHeader);
      
      this.logger.log(`LiveKit Webhook Received: ${event.event}`);
      
      // Handle different event types (e.g., room_started, participant_joined)
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
    } catch (error) {
      this.logger.error('Webhook verification failed', error.stack);
      throw error;
    }
  }

  @Get('rooms')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all active rooms' })
  async listRooms() {
    return this.livekitService.listRooms();
  }

  @Delete('rooms/:roomName')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a room' })
  async deleteRoom(@Param('roomName') roomName: string) {
    await this.livekitService.deleteRoom(roomName);
    return { success: true };
  }
}
