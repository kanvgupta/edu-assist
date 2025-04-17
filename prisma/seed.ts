// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // First create a user
  const user = await prisma.user.create({
    data: {
      email: "teacher@example.com",
      name: "Demo Teacher",
    },
  });

  // Create sample students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        name: "Alex Johnson",
        dateOfBirth: new Date("2015-05-12"),
        educationalStatus: "Grade 3",
        diagnosis: "ADHD, Mild Dyslexia",
        notes: "Responds well to visual learning. Enjoys science topics.",
        user: {
          connect: {
            email: "teacher@example.com",
          },
        },
      },
    }),
    prisma.student.create({
      data: {
        name: "Maya Patel",
        dateOfBirth: new Date("2016-09-23"),
        educationalStatus: "Grade 2",
        diagnosis: "Autism Spectrum Disorder",
        notes:
          "Prefers structured routines. Strong interest in patterns and numbers.",
        user: {
          connect: {
            email: "teacher@example.com",
          },
        },
      },
    }),
  ]);

  console.log("Created user:", {
    id: user.id,
    email: user.email,
    name: user.name,
  });
  console.log("Created students:", students);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
