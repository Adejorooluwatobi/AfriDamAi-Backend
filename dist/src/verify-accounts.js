"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const user_service_1 = require("./domain/services/user.service");
const vendor_service_1 = require("./domain/services/vendor.service");
const specialist_service_1 = require("./domain/services/specialist.service");
const prisma_service_1 = require("./infrastructure/persistence/prisma/prisma.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userService = app.get(user_service_1.UserService);
    const vendorService = app.get(vendor_service_1.VendorService);
    const specialistService = app.get(specialist_service_1.SpecialistService);
    const prisma = app.get(prisma_service_1.PrismaService);
    console.log('--- Account Status Verification Started ---');
    try {
        const user = await prisma.user.findFirst();
        if (user) {
            console.log(`Testing User Status: ${user.id}`);
            await userService.updateUserActiveStatus(user.id, false);
            let updated = await prisma.user.findUnique({ where: { id: user.id } });
            console.log(`User status after disable: ${updated?.isActive} (Expected: false)`);
            await userService.updateUserActiveStatus(user.id, true);
            updated = await prisma.user.findUnique({ where: { id: user.id } });
            console.log(`User status after enable: ${updated?.isActive} (Expected: true)`);
        }
        const vendor = await prisma.vendor.findFirst();
        if (vendor) {
            console.log(`Testing Vendor Status: ${vendor.id}`);
            await vendorService.updateVendorActiveStatus(vendor.id, false);
            let updated = await prisma.vendor.findUnique({ where: { id: vendor.id } });
            console.log(`Vendor status after disable: ${updated?.isActive} (Expected: false)`);
            await vendorService.updateVendorActiveStatus(vendor.id, true);
            updated = await prisma.vendor.findUnique({ where: { id: vendor.id } });
            console.log(`Vendor status after enable: ${updated?.isActive} (Expected: true)`);
        }
        const specialist = await prisma.specialist.findFirst();
        if (specialist) {
            console.log(`Testing Specialist Status: ${specialist.id}`);
            await specialistService.updateSpecialistActiveStatus(specialist.id, false);
            let updated = await prisma.specialist.findUnique({ where: { id: specialist.id } });
            console.log(`Specialist status after disable: ${updated?.isActive} (Expected: false)`);
            await specialistService.updateSpecialistActiveStatus(specialist.id, true);
            updated = await prisma.specialist.findUnique({ where: { id: specialist.id } });
            console.log(`Specialist status after enable: ${updated?.isActive} (Expected: true)`);
        }
    }
    catch (error) {
        console.error('Verification failed:', error);
    }
    finally {
        await app.close();
        console.log('--- Account Status Verification Finished ---');
    }
}
bootstrap();
//# sourceMappingURL=verify-accounts.js.map