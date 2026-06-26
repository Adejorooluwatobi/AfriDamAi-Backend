import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './application/use-cases/app.service';
import { SmartRedirectGuard } from './API/auth/smart-redirect.guard';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(SmartRedirectGuard)
  @ApiOperation({ summary: 'Landing page with smart redirect' })
  @ApiResponse({ status: 200, description: 'Welcome message or redirect to dashboard' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('v2/health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service health status' })
  getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Afridam Backend API',
      version: '1.0.0'
    };
  }

  @Get('features')
  @ApiOperation({ summary: 'Get available features' })
  @ApiResponse({ status: 200, description: 'List of available features' })
  getFeatures() {
    return {
      features: [
        {
          name: 'Clinical Intelligence & Onboarding',
          description: 'Fitzpatrick Scale Integration and medical profiling',
          enabled: true
        },
        {
          name: 'Revenue & Appointment Logic',
          description: 'Choice-based access with specialty tiers',
          pricing: {
            instantSession: '$15 one-time',
            starterPlan: '$3 for first month'
          },
          enabled: true
        },
        {
          name: 'Security & Compliance',
          description: 'Account deletion workflow and data privacy',
          enabled: true
        },
        {
          name: 'AI Scanner',
          description: 'Clinical viewfinder with scanning animation',
          enabled: true
        },
        {
          name: 'Auth Recovery',
          description: 'Forgot password functionality',
          enabled: true
        }
      ]
    };
  }
}
