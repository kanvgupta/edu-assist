import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get student context from the first message if available
  const studentContext = messages[0]?.content?.includes("Student Context:")
    ? messages[0].content
    : "";

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are a helpful AI assistant for special education teachers. You help them track and manage their students' progress.
    ${studentContext}
    Please provide clear, professional, and empathetic responses.`,
    tools: {
      getStudentInfo: tool({
        description: "Get information about a student",
        parameters: z.object({
          studentId: z
            .string()
            .describe("The ID of the student to get information for"),
        }),
        execute: async ({ studentId }: { studentId: string }) => {
          // In a real implementation, this would fetch from your database
          // For now, we'll return mock data
          return {
            name: "Example Student",
            educationalStatus: "IEP",
            diagnosis: "ADHD",
            notes: "Shows improvement in reading comprehension",
          };
        },
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
