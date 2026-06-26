import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PricingPlanService } from '../../domain/services/pricing-plan.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePricingPlanDto } from 'src/application/DTOs/pricing-plans/create-pricing-plan.dto';
import { UpdatePricingPlanDto } from 'src/application/DTOs/pricing-plans/update-pricing-plan.dto';

@ApiTags('Pricing Plans')
@Controller('pricing-plans')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PricingPlanController {
  constructor(private readonly pricingPlanService: PricingPlanService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get active pricing plans' })
  @ApiResponse({ status: 200, description: 'Active pricing plans retrieved successfully' })
  async getActivePricingPlans() {
    // 🛠️ FIX: Method name synchronized with PricingPlanService
    return this.pricingPlanService.getActivePlans();
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed default pricing plans' })
  @ApiResponse({ status: 201, description: 'Default pricing plans seeded successfully' })
  async seedDefaultPricingPlans() {
    return this.pricingPlanService.seedDefaultPricingPlans();
  }

  @Get()
  @ApiOperation({ summary: 'Get all pricing plans' })
  @ApiResponse({ status: 200, description: 'Pricing plans retrieved successfully' })
  async findAll() {
    return this.pricingPlanService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create pricing plan' })
  @ApiResponse({ status: 201, description: 'Pricing plan created successfully' })
  async create(@Body() createPricingPlanDto: CreatePricingPlanDto) {
    return this.pricingPlanService.create(createPricingPlanDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pricing plan by ID' })
  @ApiResponse({ status: 200, description: 'Pricing plan retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.pricingPlanService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update pricing plan' })
  @ApiResponse({ status: 200, description: 'Pricing plan updated successfully' })
  async update(@Param('id') id: string, @Body() updatePricingPlanDto: UpdatePricingPlanDto) {
    return this.pricingPlanService.update(id, updatePricingPlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pricing plan' })
  @ApiResponse({ status: 200, description: 'Pricing plan deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.pricingPlanService.delete(id);
  }
}