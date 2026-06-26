
import { PrismaClient, SpecialistType, VendorStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting verification...');

    // 1. Create a Specialist with TYPE
    const specializedEmail = `specialist_verif_${Date.now()}@test.com`;
    console.log(`Creating specialist with email: ${specializedEmail}`);
    
    try {
        const specialist = await prisma.specialist.create({
            data: {
                firstName: 'Verif',
                lastName: 'Specialist',
                email: specializedEmail,
                phoneNo: '1234567890',
                sex: 'M',
                type: SpecialistType.DERMATOLOGIST, // Testing new enum
                password: 'password123',
                documents: ['doc1.pdf', 'doc2.pdf'],
                status: 'APPROVED'
            }
        });
        console.log('Specialist created successfully:', specialist);
        if (specialist.type !== SpecialistType.DERMATOLOGIST) {
            console.error('ERROR: Specialist type mismatch');
            process.exit(1);
        }
    } catch (e) {
        console.error('Error creating specialist:', e);
        process.exit(1);
    }

    // 2. Create a Vendor with DOCUMENTS_URL array
    const vendorEmail = `vendor_verif_${Date.now()}@test.com`;
    console.log(`Creating vendor with email: ${vendorEmail}`);

    try {
        const vendor = await prisma.vendor.create({
            data: {
                companyName: 'Verif Vendor Co',
                rcNumber: 'RC123456',
                businessAddress: '123 Test St',
                phoneNumber: '0987654321',
                email: vendorEmail,
                documentsUrl: ['https://doc1.com', 'https://doc2.com'], // Testing array
                status: VendorStatus.APPROVED,
                password: 'password123'
            }
        });
        console.log('Vendor created successfully:', vendor);
        if (!Array.isArray(vendor.documentsUrl) || vendor.documentsUrl.length !== 2) {
            console.error('ERROR: Vendor documentsUrl mismatch or not an array');
            process.exit(1);
        }
    } catch (e) {
        console.error('Error creating vendor:', e);
        process.exit(1);
    }

    console.log('Verification successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
