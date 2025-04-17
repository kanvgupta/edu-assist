import { NextResponse } from "next/server";
import { createStudent } from "@/lib/data";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import authOptions

export async function POST(request: Request) {
  try {
    // Use getServerSession with authOptions
    const session = await getServerSession(authOptions);
    console.log("[API Route] Session received:", session);
    if (!session?.user?.email) {
      console.error("[API Route] Unauthorized: No session or email found.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userEmail = session.user.email; // Extract email from session
    console.log("[API Route] Extracted userEmail:", userEmail);

    const data = await request.json();
    console.log("[API Route] Received data:", data);

    // Validate required fields
    if (
      !data.name ||
      !data.dateOfBirth ||
      !data.educationalStatus ||
      !data.diagnosis
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Correctly call createStudent with email first, then data
    console.log("[API Route] Calling createStudent with email:", userEmail);
    const student = await createStudent(userEmail, data);
    console.log("[API Route] Student created:", student);

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}
