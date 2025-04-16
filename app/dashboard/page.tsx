"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import StudentCard from "@/components/student-card"
import type { Student } from "@/lib/types"

// Sample data for demonstration
const sampleStudents: Student[] = [
  {
    id: "1",
    name: "Alex Johnson",
    dateOfBirth: "2015-05-12",
    educationalStatus: "Grade 3",
    diagnosis: "ADHD, Mild Dyslexia",
    notes: "Responds well to visual learning. Enjoys science topics.",
  },
  {
    id: "2",
    name: "Maya Patel",
    dateOfBirth: "2016-09-23",
    educationalStatus: "Grade 2",
    diagnosis: "Autism Spectrum Disorder",
    notes: "Prefers structured routines. Strong interest in patterns and numbers.",
  },
  {
    id: "3",
    name: "Ethan Williams",
    dateOfBirth: "2014-11-08",
    educationalStatus: "Grade 4",
    diagnosis: "Down Syndrome",
    notes: "Very social. Learns best through interactive activities.",
  },
]

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>(sampleStudents)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">EduAssist</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/")}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold">Your Students</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => router.push("/dashboard/add-student")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No students found</p>
            <Button onClick={() => router.push("/dashboard/add-student")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Student
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
