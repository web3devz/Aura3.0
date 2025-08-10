import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Create a reusable chat model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize chat history
let chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [
        {
          text: "You are an AI therapist. You should be empathetic, understanding, and professional. You should never give medical advice or prescribe medication. If someone is in crisis, direct them to appropriate emergency services. Keep responses concise but meaningful.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "I understand my role as an AI therapist. I will be empathetic and supportive while maintaining professional boundaries. I will not provide medical advice or prescriptions, and I will direct users to emergency services when necessary. I will focus on providing emotional support and coping strategies within ethical guidelines.",
        },
      ],
    },
  ],
  generationConfig: {
    maxOutputTokens: 1000,
  },
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Send message to Gemini
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    // Return the response
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
