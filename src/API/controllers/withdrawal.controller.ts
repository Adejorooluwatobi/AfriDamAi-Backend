import { Controller, Post, Body, UseGuards, Request, BadRequestException, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WithdrawalRequestService } from 'src/domain/services/withdrawal-request.service';
import { CreateWithdrawalRequestParams } from 'src/utils/type';
import { WithdrawalRequestEntity } from 'src/domain/entities/withdrawal-request.entity';
import { WalletService } from 'src/domain/services/wallet.service';
import { WalletOwnerType } from '@prisma/client';

@ApiTags('Withdrawals')
@Controller('withdrawals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WithdrawalController {
  constructor(
    private readonly withdrawalRequestService: WithdrawalRequestService,
    private readonly walletService: WalletService,
  ) {}

  @Post('request')
  @ApiOperation({ summary: 'Request a withdrawal from the authenticated user/vendor/specialist wallet' })
  @ApiResponse({ status: 201, description: 'Withdrawal request created successfully', type: WithdrawalRequestEntity })
  @ApiResponse({ status: 400, description: 'Bad request (e.g., insufficient balance)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async requestWithdrawal(
    @Request() req,
    @Body('amount') amount: number,
  ): Promise<WithdrawalRequestEntity> {
    const requestedById = req.user.id;
    let requestedByType: WalletOwnerType;

    if (req.user.type === 'admin') { 
        throw new BadRequestException('Admins cannot request personal withdrawals from this endpoint.');
    } else if (req.user.type === 'vendor') { 
      requestedByType = WalletOwnerType.VENDOR;
    } else if (req.user.type === 'specialist') { 
      requestedByType = WalletOwnerType.SPECIALIST;
    } else { 
      requestedByType = WalletOwnerType.USER;
    }

    const wallet = await this.walletService.getWalletByOwner(requestedById, requestedByType);

    if (wallet.balance < amount) {
        throw new BadRequestException('Insufficient balance for withdrawal request.');
    }

    const params: CreateWithdrawalRequestParams = {
      walletId: wallet.id,
      amount: amount,
      requestedById: requestedById,
      requestedByType: requestedByType,
    };

    return this.withdrawalRequestService.requestWithdrawal(params);
  }
}
