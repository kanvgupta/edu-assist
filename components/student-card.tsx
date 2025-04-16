"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import type { Student } from "@/lib/types"

interface StudentCardProps {
  student: Student
}

export default function StudentCard({ student }: StudentCardProps) {
  const router = useRouter()

  return (
    <Card className="h-full flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle>{student.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Age:</span> {calculateAge(student.dateOfBirth)} years
          </p>
          <p className="text-sm">
            <span className="font-medium">Education:</span> {student.educationalStatus}
          </p>
          <p className="text-sm">
            <span className="font-medium">Diagnosis:</span> {student.diagnosis}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => router.push(`/dashboard/student/${student.id}`)}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Get Teaching Advice
        </Button>
      </CardFooter>
    </Card>
  )
}

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}
