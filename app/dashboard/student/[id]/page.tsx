import { notFound } from 'next/navigation';
import { getStudentById, getStudentsByUser } from '@/lib/data';
import Chat from '@/app/components/Chat';
import Sidebar from '@/app/components/Sidebar';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email;

  if (!currentUserEmail) {
    console.error("User email not found in session. Redirecting to login.");
    redirect('/login');
  }

  const { id } = await params;

  const [student, userStudents] = await Promise.all([
    getStudentById(id),
    getStudentsByUser(currentUserEmail)
  ]);

  if (!student) {
    notFound();
  }

  if (!userStudents.some(s => s.id === student.id)) {
     console.warn(`User ${currentUserEmail} attempted to access student ${id} which does not belong to them.`);
     notFound();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="hidden md:block">
        <Sidebar students={userStudents} />
      </div>
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 md:hidden">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>
        <div className="flex-1 overflow-hidden">
          <Chat student={student} />
        </div>
      </main>
    </div>
  );
}
