import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { ConsultationEntity } from "src/domain/entities/consultation.entity";
import { ConsultationService } from "src/domain/services/consultation.service";
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreateConsultationDto } from "src/application/DTOs/consultation/create-consultation.dto";
import { UpdateConsultationDto } from "src/application/DTOs/consultation/update-consultation.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OperationsAdminGuard } from "../auth/guards/admin-permission.guard";

@ApiTags('Consultation')
@Controller('consultation')
export class ConsultationController {
    constructor(private readonly consultationService: ConsultationService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new consultation' })
    @ApiResponse({ status: 201, description: 'Consultation created successfully', type: ConsultationEntity })
    async create(@Body() createConsultationDto: CreateConsultationDto) {
        const consultation = await this.consultationService.create({ ...createConsultationDto });
        return {
            succeeded: true,
            message: 'Consultation created successfully',
            resultData: consultation
        };
    }

    @Get()
    @UseGuards(JwtAuthGuard, OperationsAdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all consultations' })
    @ApiResponse({ status: 200, description: 'Consultations retrieved successfully', type: [ConsultationEntity] })
    async findAll() {
        const consultations = await this.consultationService.findAll();
        return {
            succeeded: true,
            message: 'Consultations retrieved successfully',
            resultData: consultations
        };
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, OperationsAdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get consultation by ID' })
    @ApiResponse({ status: 200, description: 'Consultation retrieved successfully', type: ConsultationEntity })
    async findById(@Param('id') id: string) {
        const consultation = await this.consultationService.findById(id);
        return {
            succeeded: true,
            message: 'Consultation retrieved successfully',
            resultData: consultation
        };
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, OperationsAdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update consultation by ID' })
    @ApiResponse({ status: 200, description: 'Consultation updated successfully', type: ConsultationEntity })
    async update(@Param('id') id: string, @Body() updateConsultationDto: UpdateConsultationDto) {
        const consultation = await this.consultationService.update(id, updateConsultationDto);
        return {
            succeeded: true,
            message: 'Consultation updated successfully',
            resultData: consultation
        };
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, OperationsAdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete consultation by ID' })
    async delete(@Param('id') id: string) {
        await this.consultationService.delete(id);
        return {
            succeeded: true,
            message: 'Consultation deleted successfully',
            resultData: { id }
        };
    }   

}