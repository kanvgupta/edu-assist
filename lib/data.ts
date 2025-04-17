import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function getStudentById(id: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id },
    });
    return student;
  } catch (error) {
    console.error("Error getting student:", error);
    throw error;
  }
}

export async function getStudentsByUser(userEmail: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        students: true,
      },
    });
    return user?.students || [];
  } catch (error) {
    console.error("Error getting students:", error);
    throw error;
  }
}

export interface CreateStudentData {
  name: string;
  dateOfBirth: string;
  educationalStatus: string;
  diagnosis: string;
  notes: string | undefined;
  userId: string;
}

export async function createStudent(
  userEmail: string,
  data: CreateStudentData
) {
  console.log("[createStudent] Received userEmail:", userEmail);
  console.log("[createStudent] Received data:", data);
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });
    console.log("[createStudent] Found user by email:", user);

    if (!user) {
      console.error(`[createStudent] User not found with email ${userEmail}`);
      throw new Error(`User not found with email ${userEmail}`);
    }
    console.log("[createStudent] Using user.id for student creation:", user.id);

    // Convert date string to Date object at noon UTC
    const dateString = `${data.dateOfBirth}T12:00:00Z`;

    const createdStudent = await prisma.student.create({
      data: {
        name: data.name,
        dateOfBirth: dateString,
        educationalStatus: data.educationalStatus,
        diagnosis: data.diagnosis,
        notes: data.notes ?? "",
        userId: user.id,
      },
    });
    console.log(
      "[createStudent] Successfully created student:",
      createdStudent
    );
    return createdStudent;
  } catch (error) {
    console.error("[createStudent] Error creating student:", error);
    throw error;
  }
}
