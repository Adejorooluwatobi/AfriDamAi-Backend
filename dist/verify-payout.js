"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting Payout Verification...');
    const emailSuffix = Date.now();
    const specialist = await prisma.specialist.create({
        data: {
            firstName: 'Payout',
            lastName: 'Doc',
            email: `doc_${emailSuffix}@test.com`,
            phoneNo: '123',
            sex: 'M',
            type: client_1.SpecialistType.DERMATOLOGIST,
            password: 'pwd',
            documents: []
        }
    });
    console.log(`Created Specialist: ${specialist.id} (${specialist.type})`);
    const user = await prisma.user.create({
        data: {
            firstName: 'Pay',
            lastName: 'User',
            email: `user_${emailSuffix}@test.com`,
            phoneNo: '456',
            sex: 'F',
            password: 'pwd'
        }
    });
    const plan1 = await prisma.pricingPlan.create({
        data: {
            name: 'Tier 1 Plan',
            type: 'TIER1',
            price: 3000,
            appointmentLimit: 1,
            description: [],
            isActive: true
        }
    });
    const plan2 = await prisma.pricingPlan.create({
        data: {
            name: 'Tier 2 Plan',
            type: 'TIER2',
            price: 14000,
            appointmentLimit: 3,
            description: [],
            isActive: true
        }
    });
    const plan3 = await prisma.pricingPlan.create({
        data: {
            name: 'Tier 3 Plan',
            type: 'TIER3',
            price: 28000,
            appointmentLimit: 3,
            description: [],
            isActive: true
        }
    });
    async function testPayout(planId, expectedAmount, tierName) {
        console.log(`\nTesting ${tierName}...`);
        const sub = await prisma.userSubscription.create({
            data: {
                userId: user.id,
                planId: planId,
                startDate: new Date(),
                endDate: new Date(Date.now() + 100000),
                remainingSessions: 1,
            }
        });
        const appointment = await prisma.appointment.create({
            data: {
                user: { connect: { id: user.id } },
                specialist: { connect: { id: specialist.id } },
                subscription: { connect: { id: sub.id } },
                status: client_1.AppointmentStatus.CONFIRMED,
                type: 'TIER1',
                specialty: 'DERMATOLOGIST',
                price: 0,
                scheduledAt: new Date()
            }
        });
        const plan = await prisma.pricingPlan.findUnique({ where: { id: planId } });
        const sessions = (plan?.appointmentLimit && plan.appointmentLimit > 0) ? plan.appointmentLimit : 1;
        const avg = (plan?.price || 0) / sessions;
        let payout = 0;
        if (avg < 4000)
            payout = 1500;
        else if (avg < 8000)
            payout = 2500;
        else
            payout = 5000;
        console.log(`Plan Price: ${plan?.price}, Limit: ${plan?.appointmentLimit}, Avg: ${avg.toFixed(2)}`);
        console.log(`Expected Payout: ${expectedAmount}, Calculated Logic: ${payout}`);
        if (payout !== expectedAmount) {
            console.error('FAILED: Payout mismatch');
            process.exit(1);
        }
    }
    await testPayout(plan1.id, 1500, 'Tier 1 (Base)');
    await testPayout(plan2.id, 2500, 'Tier 2 (Standard)');
    await testPayout(plan3.id, 5000, 'Tier 3 (Premium)');
    console.log('\nVerification Successful!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=verify-payout.js.map