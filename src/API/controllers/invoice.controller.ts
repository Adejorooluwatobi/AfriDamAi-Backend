import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Put,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { InvoiceService } from 'src/domain/services/invoice.service';
import { CreateInvoiceDto } from 'src/application/DTOs/invoice/create-invoice.dto';
import { UpdateInvoiceDto } from 'src/application/DTOs/invoice/update-invoice.dto';
import { JwtAuthGuard } from 'src/API/auth/guards/jwt-auth.guard';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new invoice' })
    @ApiResponse({ status: 201, description: 'Invoice created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid orderId or userId' })
    create(@Body() dto: CreateInvoiceDto) {
        return this.invoiceService.createInvoice(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all invoices' })
    findAll() {
        return this.invoiceService.findAllInvoices();
    }

    @Get('number/:invoiceNumber')
    @ApiOperation({ summary: 'Get invoice by invoice number' })
    @ApiParam({ name: 'invoiceNumber' })
    findByNumber(@Param('invoiceNumber') invoiceNumber: string) {
        return this.invoiceService.findInvoiceByNumber(invoiceNumber);
    }

    @Get('order/:orderId')
    @ApiOperation({ summary: 'Get invoice by order ID' })
    @ApiParam({ name: 'orderId' })
    findByOrder(@Param('orderId') orderId: string) {
        return this.invoiceService.findInvoiceByOrderId(orderId);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get all invoices for a user' })
    @ApiParam({ name: 'userId' })
    findByUser(@Param('userId') userId: string) {
        return this.invoiceService.findInvoicesByUserId(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get invoice by ID' })
    @ApiParam({ name: 'id' })
    findById(@Param('id') id: string) {
        return this.invoiceService.findInvoiceById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an invoice' })
    update(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
        return this.invoiceService.updateInvoice(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete an invoice' })
    delete(@Param('id') id: string) {
        return this.invoiceService.deleteInvoice(id);
    }
}
