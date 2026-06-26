
import { Controller, Post, Body, Param, Get, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { TransactionService } from 'src/domain/services/transaction.service';
import { CreateTransactionDto } from '../../application/DTOs/transactions/create-transaction.dto';
import { JwtAuthGuard } from 'src/API/auth/guards/jwt-auth.guard'; // Assuming this path, verified later
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Post('initiate')
    @ApiOperation({ summary: 'Initiate a transaction for an order' })
    async initiateTransaction(@Request() req, @Body() createTransactionDto: CreateTransactionDto) {
        return this.transactionService.initiateTransaction(req.user.id, createTransactionDto);
    }

    @Post(':id/verify')
    @ApiOperation({ summary: 'Verify payment status' })
    async verifyPayment(@Param('id') id: string) {
        return this.transactionService.verifyTransactionById(id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get transaction details' })
    async getTransaction(@Param('id') id: string) {
        return this.transactionService.getTransactionById(id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all transactions' })
    async getAllTransaction() {
        return this.transactionService.getAllTransaction();
    }

    @Get('reference/:ref')
    @ApiOperation({ summary: 'Get transaction details by reference' })
    async getTransactionByRef(@Param('ref') ref: string) {
        return this.transactionService.verifyTransactionByReference(ref);
    }
}
