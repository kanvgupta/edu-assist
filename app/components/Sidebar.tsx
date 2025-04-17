'use client';

import Link from 'next/link';
import { Student } from '@prisma/client';

interface SidebarProps {
  students: Student[]; // Assuming you'll pass the student list here
}

export default function Sidebar({ students }: SidebarProps) {
  return (
    <div className="w-64 flex-shrink-0 bg-gray-50 border-r border-gray-200 p-4 flex flex-col space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
      <nav className="flex flex-col space-y-2">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-md">
          Dashboard
        </Link>
      </nav>

      <hr className="border-gray-200" />

      <h3 className="text-md font-semibold text-gray-800">Students</h3>
      <nav className="flex flex-col space-y-1 flex-grow overflow-y-auto">
        {students && students.length > 0 ? (
          students.map((student) => (
            <Link 
              key={student.id} 
              href={`/dashboard/student/${student.id}`}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-md text-sm"
            >
              {student.name}
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No students found.</p>
        )}
      </nav>
    </div>
  );
} 