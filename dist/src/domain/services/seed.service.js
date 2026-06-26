"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const wallet_service_1 = require("./wallet.service");
const admin_entity_1 = require("../entities/admin.entity");
const client_1 = require("@prisma/client");
let SeedService = SeedService_1 = class SeedService {
    constructor(adminService, walletService) {
        this.adminService = adminService;
        this.walletService = walletService;
        this.logger = new common_1.Logger(SeedService_1.name);
    }
    async onModuleInit() {
        this.logger.log('🌱 Database Seeding logic triggered in background...');
        this.seedOrganizationAdminAndWallet()
            .then(() => this.logger.log('✅ Seeding Sequence Finished.'))
            .catch((err) => this.logger.error(`🚨 Fatal Seeding Error: ${err.message}`, err.stack));
    }
    async seedOrganizationAdminAndWallet() {
        const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@afridamai.com';
        const defaultPass = process.env.DEFAULT_ADMIN_PASSWORD || 'AfriDam2026!';
        this.logger.log(`Checking for existing Super Admin (Role: ${admin_entity_1.AdminType.SUPER_ADMIN})...`);
        let superAdmin;
        const superAdmins = await this.adminService.findByRole(admin_entity_1.AdminType.SUPER_ADMIN);
        this.logger.log(`Found ${superAdmins.length} Super Admin(s) in database.`);
        if (superAdmins.length === 0) {
            this.logger.log(`No Super Admin found. Attempting to create default: ${defaultEmail}`);
            const existingByEmail = await this.adminService.findByEmail(defaultEmail);
            if (existingByEmail) {
                this.logger.warn(`Admin with email ${defaultEmail} already exists but is NOT a Super Admin (Current Role: ${existingByEmail.type}).`);
                this.logger.warn(`Skipping seeding of default Super Admin to avoid conflict.`);
                return;
            }
            try {
                superAdmin = await this.adminService.createAdmin({
                    email: defaultEmail,
                    password: defaultPass,
                    firstName: 'System',
                    lastName: 'Admin',
                    type: admin_entity_1.AdminType.SUPER_ADMIN,
                    isActive: true,
                });
                this.logger.log(`🏆 Default Super Admin created successfully (ID: ${superAdmin.id})`);
            }
            catch (createError) {
                this.logger.error(`❌ Failed to create default Super Admin: ${createError.message}`);
                return;
            }
        }
        else {
            superAdmin = superAdmins[0];
            this.logger.log(`Super Admin already exists: ${superAdmin.email}. Ensuring active status...`);
            await this.adminService.updateAdmin(superAdmin.id, {
                isActive: true,
                isSuspended: false
            });
        }
        if (!superAdmin)
            return;
        this.logger.log(`Verifying Organization Wallet for Admin: ${superAdmin.email}`);
        let mainOrganizationWallet;
        try {
            mainOrganizationWallet = await this.walletService.getWalletByOwner(superAdmin.id, client_1.WalletOwnerType.ORGANIZATION);
            this.logger.log(`Organization Wallet verified (ID: ${mainOrganizationWallet.id})`);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                this.logger.log('Creating default Organization Wallet...');
                try {
                    mainOrganizationWallet = await this.walletService.createWallet({
                        ownerId: superAdmin.id,
                        ownerType: client_1.WalletOwnerType.ORGANIZATION,
                        initialBalance: 0,
                    });
                    this.logger.log(`Default Organization Wallet created with ID: ${mainOrganizationWallet.id}`);
                }
                catch (walletError) {
                    this.logger.error(`❌ Failed to create Organization Wallet: ${walletError.message}`);
                }
            }
            else {
                this.logger.error(`❌ Error checking Organization Wallet: ${error.message}`);
            }
        }
        if (!mainOrganizationWallet)
            return;
        this.logger.log('Checking for rogue Organization wallets...');
        try {
            const allOrganizationWallets = await this.walletService.findAllWalletsByOwnerType(client_1.WalletOwnerType.ORGANIZATION);
            const otherWallets = allOrganizationWallets.filter(w => w.id !== mainOrganizationWallet.id);
            if (otherWallets.length > 0) {
                this.logger.warn(`Found ${otherWallets.length} duplicate Organization wallets. Sanitizing...`);
                for (const wallet of otherWallets) {
                    try {
                        await this.walletService.deleteWallet(wallet.id);
                        this.logger.log(`🗑️ Deleted rogue Organization Wallet: ${wallet.id}`);
                    }
                    catch (deleteError) {
                        this.logger.error(`Failed to delete rogue wallet ${wallet.id}: ${deleteError.message}`);
                    }
                }
            }
            else {
                this.logger.log('No rogue Organization wallets found.');
            }
        }
        catch (cleanupError) {
            this.logger.error(`❌ Cleanup check failed: ${cleanupError.message}`);
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        wallet_service_1.WalletService])
], SeedService);
//# sourceMappingURL=seed.service.js.map