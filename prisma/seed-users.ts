import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding test accounts...");

  // All accounts will share the same test password
  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@origonae.com" },
    update: {},
    create: {
      email: "admin@origonae.com",
      name: "Admin User",
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  // 2. Customer User (Guest)
  const customer = await prisma.user.upsert({
    where: { email: "customer@origonae.com" },
    update: {},
    create: {
      email: "customer@origonae.com",
      name: "Customer User",
      password: passwordHash,
      role: Role.CUSTOMER,
    },
  });

  // 3. Salon Partner User
  const salon = await prisma.user.upsert({
    where: { email: "salon@origonae.com" },
    update: {},
    create: {
      email: "salon@origonae.com",
      name: "Salon Partner",
      password: passwordHash,
      role: Role.SALON,
    },
  });

  console.log("-----------------------------------------");
  console.log("✅ Test accounts successfully generated!");
  console.log("-----------------------------------------");
  console.log("👑 ADMIN ACCOUNT:");
  console.log("   Email:    admin@origonae.com");
  console.log("   Password: password123");
  console.log("");
  console.log("🛍️ CUSTOMER ACCOUNT:");
  console.log("   Email:    customer@origonae.com");
  console.log("   Password: password123");
  console.log("");
  console.log("✨ SALON ACCOUNT:");
  console.log("   Email:    salon@origonae.com");
  console.log("   Password: password123");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
