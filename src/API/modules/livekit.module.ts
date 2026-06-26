import { Module } from '@nestjs/common';
import { LiveKitService } from '../../infrastructure/messaging/livekit.service';
import { LiveKitController } from '../controllers/livekit.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [LiveKitController],
  providers: [LiveKitService],
  exports: [LiveKitService],
})
export class LiveKitModule {}
