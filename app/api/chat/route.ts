import { NextResponse } from "next/server"
import type { Student } from "@/lib/types"

// This would be a real API route that connects to OpenAI in a production app
export async function POST(request: Request) {
  try {
    const { messages, student } = await request.json()

    // In a real implementation, you would call OpenAI API here
    // For demo purposes, we'll simulate a response
    const lastMessage = messages[messages.length - 1].content
    const aiResponse = generateAIResponse(lastMessage, student)

    return NextResponse.json({
      response: aiResponse,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}

// Helper function to generate AI responses (for demo purposes)
function generateAIResponse(input: string, student: Student): string {
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
