import { Controller, Get, Post, Body, Param, UseGuards, Request, Query, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WalletService } from 'src/domain/services/wallet.service';
import { WalletTransactionService } from 'src/domain/services/wallet-transaction.service';
import { WalletOwnerType, AdminType } from '@prisma/client'; // Import AdminType
import { Wallet } from 'src/domain/entities/wallet.entity';
import { WalletTransactionEntity } from 'src/domain/entities/wallet-transaction.entity';
import { AdminService } from 'src/domain/services/admin.service'; // Import AdminService
import { Roles } from 'src/API/auth/decorators/roles.decorator'; // Import Roles decorator
import { AdminRoleGuard } from 'src/API/auth/guards/admin-role.guard'; // Import AdminRoleGuard

@ApiTags('Wallets')
@Controller('wallets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly walletTransactionService: WalletTransactionService,
    private readonly adminService: AdminService, // Inject AdminService
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated user/vendor/specialist wallet' })
  @ApiResponse({ status: 200, description: 'Wallet retrieved successfully', type: Wallet })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async getMyWallet(@Request() req): Promise<Wallet> {
    const ownerId = req.user.id;
    let ownerType: WalletOwnerType;

    // Determine ownerType based on user type in JWT payload
    if (req.user.role === 'admin') { 
      throw new BadRequestException('Admins do not have a personal wallet. Please use the organization wallet.');
    } else if (req.user.type === 'vendor') {
      ownerType = WalletOwnerType.VENDOR;
    } else if (req.user.type === 'specialist') {
      ownerType = WalletOwnerType.SPECIALIST;
    } else if (req.user.type === 'user') {
      // Based on user feedback, regular users might not be supposed to have wallets or access them here
      throw new BadRequestException('Users do not have a personal wallet in this context.');
    } else {
      throw new BadRequestException('Invalid wallet owner type.');
    }
    
    try {
      return await this.walletService.getWalletByOwner(ownerId, ownerType);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return this.walletService.createWallet({
          ownerId,
          ownerType,
          initialBalance: 0,
        });
      }
      throw error;
    }
  }

  @Get('me/transactions')
  @ApiOperation({ summary: 'Get transaction history for the authenticated user/vendor/specialist wallet' })
  @ApiResponse({ status: 200, description: 'Wallet transactions retrieved successfully', type: [WalletTransactionEntity] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async getMyWalletTransactions(@Request() req): Promise<WalletTransactionEntity[]> {
    const ownerId = req.user.id;
    let ownerType: WalletOwnerType;

    if (req.user.role === 'admin') { 
        throw new BadRequestException('Admins do not have a personal wallet history.');
    } else if (req.user.type === 'vendor') { 
      ownerType = WalletOwnerType.VENDOR;
    } else if (req.user.type === 'specialist') { 
      ownerType = WalletOwnerType.SPECIALIST;
    } else if (req.user.type === 'user') {
      throw new BadRequestException('Users do not have a personal wallet history.');
    } else {
      throw new BadRequestException('Invalid wallet owner type.');
    }

    const wallet = await this.walletService.getWalletByOwner(ownerId, ownerType);
    return this.walletTransactionService.getWalletTransactionsByWalletId(wallet.id);
  }

  @Get('organization')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Roles(AdminType.SUPER_ADMIN, AdminType.FINANCE_ADMIN)
  @ApiOperation({ summary: 'Admin: Get the organization wallet' })
  @ApiResponse({ status: 200, description: 'Organization Wallet retrieved successfully', type: Wallet })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Organization Wallet not found' })
  async getOrganizationWallet(): Promise<Wallet> {
    const superAdmins = await this.adminService.findByRole(AdminType.SUPER_ADMIN);
    if (superAdmins.length === 0) {
      throw new InternalServerErrorException('No SUPER_ADMIN found to link Organization Wallet.');
    }
    const ORGANIZATION_ADMIN_ID = superAdmins[0].id;
    try {
      return await this.walletService.getWalletByOwner(ORGANIZATION_ADMIN_ID, WalletOwnerType.ORGANIZATION);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return this.walletService.createWallet({
          ownerId: ORGANIZATION_ADMIN_ID,
          ownerType: WalletOwnerType.ORGANIZATION,
          initialBalance: 0,
        });
      }
      throw error;
    }
  }

  @Get('organization/transactions')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Roles(AdminType.SUPER_ADMIN, AdminType.FINANCE_ADMIN)
  @ApiOperation({ summary: 'Admin: Get transaction history for the organization wallet' })
  @ApiResponse({ status: 200, description: 'Organization Wallet transactions retrieved successfully', type: [WalletTransactionEntity] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Organization Wallet not found' })
  async getOrganizationWalletTransactions(): Promise<WalletTransactionEntity[]> {
    const superAdmins = await this.adminService.findByRole(AdminType.SUPER_ADMIN);
    if (superAdmins.length === 0) {
      throw new InternalServerErrorException('No SUPER_ADMIN found to link Organization Wallet.');
    }
    const ORGANIZATION_ADMIN_ID = superAdmins[0].id;
    const organizationWallet = await this.walletService.getWalletByOwner(ORGANIZATION_ADMIN_ID, WalletOwnerType.ORGANIZATION);
    return this.walletTransactionService.getWalletTransactionsByWalletId(organizationWallet.id);
  }
}
