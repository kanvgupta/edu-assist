"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function AddStudentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget);
      
      // Get the date and ensure it's in ISO format
      const dateInput = formData.get('dateOfBirth') as string;
      const dateOfBirth = dateInput ? new Date(dateInput).toISOString().split('T')[0] : '';

      const data = {
        name: formData.get('name') as string,
        dateOfBirth,
        educationalStatus: formData.get('educationalStatus') as string,
        diagnosis: formData.get('diagnosis') as string,
        notes: formData.get('notes') as string || null,
      };

      // Validate required fields
      if (!data.name || !data.dateOfBirth || !data.educationalStatus || !data.diagnosis) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create student');
      }

      toast.success('Student added successfully');
      router.push('/dashboard');
      router.refresh(); // Refresh the page to show the new student
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Student</CardTitle>
            <CardDescription>Enter the student's information to create a new profile</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input 
                  id="dateOfBirth" 
                  name="dateOfBirth" 
                  type="date" 
                  max={new Date().toISOString().split('T')[0]}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="educationalStatus">Current Educational Status</Label>
                <Input 
                  id="educationalStatus" 
                  name="educationalStatus"
                  placeholder="e.g., Grade 3, Homeschooled" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Medical Diagnosis</Label>
                <Textarea 
                  id="diagnosis" 
                  name="diagnosis"
                  placeholder="Describe the student's diagnosis" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  name="notes"
                  placeholder="Learning preferences, interests, etc." 
                  rows={4} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adding Student..." : "Add Student"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
