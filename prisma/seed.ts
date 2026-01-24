

import { Role } from "@/app/generated/prisma/enums";
import { database } from "@/lib/prisma";
import bcrypt from "bcryptjs";


async function main() {
  // Check if an admin already exists
  const existingAdmin = await database.user.findFirst({
    where: { role: Role.ADMIN },
  });

  if (existingAdmin) {
    return;
  }

  // 1️⃣ Create the first Customer

  // 2️⃣ Create the first admin account
  const hashedPassword = await bcrypt.hash("admin", 10); // Change password before deploy!

  const admin = await database.user.create({
    data: {
      userName: "admin",
      fullName: "Super Admin",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log("✅ Admin account created:", admin.userName);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await database.$disconnect();
  });
