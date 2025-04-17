'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { Student } from '@prisma/client';
import SuggestedQuestions from '@/components/SuggestedQuestions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatProps {
  student: Student;
}

export default function Chat({ student }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: 'student-context',
        role: 'system',
        content: `Student Context:
          Name: ${student.name}
          Educational Status: ${student.educationalStatus}
          Diagnosis: ${student.diagnosis}
          Notes: ${student.notes || 'No additional notes'}`,
      },
    ],
    maxSteps: 5,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sampleQuestions = [
    `What are ${student.name}'s strengths?`,
    `How can I support ${student.name}'s learning goals?`,
    `Summarize the key points about ${student.diagnosis}.`,
    `Suggest activities for ${student.name} based on their notes.`,
  ];

  const handleSuggestedQuestionClick = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow flex-grow h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] lg:max-w-[70%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 text-gray-900'
              }`}
            >
              {message.role === 'user' ? (
                <div className="whitespace-pre-wrap">{message.content}</div>
              ) : (
                <div className="prose prose-sm max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({ node, className, children, ...props }) => (
                        <pre
                          className="bg-gray-800 text-white p-2 rounded-md overflow-auto my-2"
                          {...props}
                        >
                          {children}
                        </pre>
                      ),
                      code: ({ node, className, children, ...props }) => (
                        <code
                          className="bg-gray-100 text-gray-800 rounded px-1 py-0.5"
                          {...props}
                        >
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mb-4 mx-4">
        <SuggestedQuestions 
          questions={sampleQuestions} 
          onQuestionClick={handleSuggestedQuestionClick} 
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-4"
      >
        <div className="flex space-x-4">
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about the student..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 