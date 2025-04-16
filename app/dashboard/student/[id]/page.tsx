"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Student } from "@/lib/types"
import { ChatMessage } from "@/components/chat-message"

// Sample data for demonstration
const sampleStudents: Record<string, Student> = {
  "1": {
    id: "1",
    name: "Alex Johnson",
    dateOfBirth: "2015-05-12",
    educationalStatus: "Grade 3",
    diagnosis: "ADHD, Mild Dyslexia",
    notes: "Responds well to visual learning. Enjoys science topics.",
  },
  "2": {
    id: "2",
    name: "Maya Patel",
    dateOfBirth: "2016-09-23",
    educationalStatus: "Grade 2",
    diagnosis: "Autism Spectrum Disorder",
    notes: "Prefers structured routines. Strong interest in patterns and numbers.",
  },
  "3": {
    id: "3",
    name: "Ethan Williams",
    dateOfBirth: "2014-11-08",
    educationalStatus: "Grade 4",
    diagnosis: "Down Syndrome",
    notes: "Very social. Learns best through interactive activities.",
  },
}

// Suggested questions for the AI
const suggestedQuestions = [
  "How can I best teach this student?",
  "What are effective strategies for introducing new concepts?",
  "How can I adapt my teaching style for this student?",
  "What accommodations might help this student succeed?",
]

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function StudentChatPage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // In a real app, you would fetch this from your API
    const studentData = sampleStudents[params.id]
    if (studentData) {
      setStudent(studentData)
      // Add initial AI message
      setMessages([
        {
          role: "assistant",
          content: `Hello! I'm your teaching assistant for ${studentData.name}. How can I help you today?`,
        },
      ])
    }
  }, [params.id])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // In a real app, you would send this to your OpenAI API endpoint
    // For demo purposes, we'll simulate a response
    setTimeout(() => {
      const aiResponse = {
        role: "assistant" as const,
        content: generateAIResponse(input, student),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading student information...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{student.name}</CardTitle>
                <CardDescription>Student Profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p>{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Educational Status</p>
                  <p>{student.educationalStatus}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Diagnosis</p>
                  <p>{student.diagnosis}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p>{student.notes}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Suggested Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3 whitespace-normal"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Teaching Assistant</CardTitle>
                <CardDescription>Ask questions about teaching strategies for {student.name}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto max-h-[500px] space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="animate-pulse">Thinking...</div>
                  </div>
                )}
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate AI responses (for demo purposes)
function generateAIResponse(input: string, student: Student | null): string {
  if (!student) return "I don't have information about this student."

  if (input.toLowerCase().includes("best teach")) {
    return `Based on ${student.name}'s profile, I recommend focusing on ${
      student.diagnosis.includes("ADHD")
        ? "short, engaging activities with frequent breaks and visual aids."
        : student.diagnosis.includes("Autism")
          ? "structured routines with clear expectations and visual schedules."
          : "multi-sensory learning approaches that incorporate their interests."
    } ${student.notes}`
  }

  if (input.toLowerCase().includes("new concept")) {
    return `When introducing new concepts to ${student.name}, try ${
      student.diagnosis.includes("Dyslexia")
        ? "using multi-sensory approaches that combine visual, auditory, and kinesthetic learning."
        : student.diagnosis.includes("Down Syndrome")
          ? "breaking down information into smaller steps and using concrete examples."
          : "connecting the concept to their interests and providing plenty of practice opportunities."
    } Remember that ${student.notes}`
  }

  return `For a student like ${student.name} with ${student.diagnosis}, I recommend personalizing your approach by considering their unique learning style. Their notes indicate: "${student.notes}" which suggests they might respond well to tailored strategies that incorporate their interests and strengths.`
}
