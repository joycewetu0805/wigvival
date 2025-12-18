import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt.js";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      email: "admin@wigvival.ca",
      password: adminPassword,
      firstName: "Admin",
      lastName: "WIGVIVAL",
      role: "ADMIN",
    },
  });

  const service = await prisma.service.create({
    data: {
      name: "Luxury Restauration",
      description: "Restauration complète premium",
      price: 85,
      duration: 150,
      category: "restauration",
      features: ["Lace repair", "Deep clean", "Styling final"],
      isFeatured: true,
    },
  });

  const stylist = await prisma.stylist.create({
    data: {
      firstName: "Sophie",
      lastName: "Tremblay",
      bio: "Experte en restauration de perruques premium",
      specialties: ["Restauration", "Customisation"],
    },
  });

  await prisma.availability.create({
    data: {
      stylistId: stylist.id,
      serviceId: service.id,
      start: new Date(Date.now() + 86400000),
      end: new Date(Date.now() + 90000000),
      maxClients: 3,
    },
  });

  console.log("✅ Seed terminé");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
