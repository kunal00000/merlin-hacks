import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { keywords, blocks } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Write a blog post about "${keywords}" with the following structure:
      ${blocks.join("\n")}
      
      Make the content engaging, informative, and SEO-friendly.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      data: {
        blocks: blocks.map((block: string) => ({
          title: block,
          content: text,
        })),
      },
    });
  } catch (error) {
    console.error("Error generating blog content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate blog content" },
      { status: 500 }
    );
  }
}