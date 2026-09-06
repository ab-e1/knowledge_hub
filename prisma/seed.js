import { prisma } from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/hash.js";

async function main() {
  const adminEmail = "admin@knowledgehub.com";
  const adminPassword = "AdminPassword123!";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN",
      emailVerified: true,
    },
    create: {
      name: "Super Admin",
      email: adminEmail,
      password: await hashPassword(adminPassword),
      role: "ADMIN",
      emailVerified: true,
    },
  });

  console.log("🌱 Admin user seeded successfully!");
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role: ${admin.role}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
