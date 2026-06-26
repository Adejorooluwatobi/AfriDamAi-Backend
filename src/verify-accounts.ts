import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './domain/services/user.service';
import { VendorService } from './domain/services/vendor.service';
import { SpecialistService } from './domain/services/specialist.service';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const vendorService = app.get(VendorService);
  const specialistService = app.get(SpecialistService);
  const prisma = app.get(PrismaService);

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

  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await app.close();
    console.log('--- Account Status Verification Finished ---');
  }
}

bootstrap();
