import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkStudents() {
  try {
    const students = await prisma.student.findMany();
    console.log("Found students:", students);
    console.log("Total students:", students.length);
  } catch (error) {
    console.error("Error fetching students:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudents();
