import { getStudentsByUser } from "@/lib/data";
import StudentList from "@/app/components/StudentList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    // Redirect to login if not authenticated
    redirect("/login");
  }

  const userEmail = session.user.email;
  console.log("[DashboardPage] Fetching students for user:", userEmail);
  const students = await getStudentsByUser(userEmail);
  console.log("[DashboardPage] Found students:", students);

  return <StudentList initialStudents={students} />;
}
