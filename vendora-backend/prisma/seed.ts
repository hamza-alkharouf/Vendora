import { PrismaClient, UserRole, StoreStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { phone: '0500000000' },
    update: {},
    create: {
      phone: '0500000000',
      email: 'admin@vendora.com',
      name: 'Super Admin',
      role: UserRole.ADMIN,
    },
  });
  console.log('Admin created:', admin.phone);

  // 2. Create a Seller
  const seller = await prisma.user.upsert({
    where: { phone: '0511111111' },
    update: {},
    create: {
      phone: '0511111111',
      email: 'seller@example.com',
      name: 'John Seller',
      role: UserRole.SELLER,
    },
  });
  console.log('Seller created:', seller.phone);

  // 3. Create a Store for the Seller
  const store = await prisma.store.upsert({
    where: { handle: 'mega-store' },
    update: {},
    create: {
      name: 'Mega Store',
      handle: 'mega-store',
      status: StoreStatus.ACTIVE,
      description: 'The best store in town.',
      members: {
        create: {
          userId: seller.id,
          role: 'OWNER',
        },
      },
      onboarding: {
        create: {
          storeInformation: true,
          stripeConnection: true,
          locationsShipping: true,
          products: true,
        },
      },
    },
  });
  console.log('Store created:', store.handle);

  // 4. Create another store (Inactive/Onboarding)
  const newStore = await prisma.store.upsert({
    where: { handle: 'new-boutique' },
    update: {},
    create: {
      name: 'New Boutique',
      handle: 'new-boutique',
      status: StoreStatus.INACTIVE,
      members: {
        create: {
          userId: seller.id,
          role: 'OWNER',
        },
      },
      onboarding: {
        create: {
          storeInformation: true,
          stripeConnection: false,
          locationsShipping: false,
          products: false,
        },
      },
    },
  });
  console.log('New Store created:', newStore.handle);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
