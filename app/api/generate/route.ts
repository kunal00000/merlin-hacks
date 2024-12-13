import { NextRequest } from "next/server";
import { contentBlockSchema } from "@/lib/schema";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";
import { createPrompt } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { userMessage, blogType, internalLinks, selectedBlocks } =
      await request.json();

    if (!userMessage || !selectedBlocks || selectedBlocks.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: userMessage and selectedBlocks",
        }),
        { status: 400 }
      );
    }

    const prompt = createPrompt(
      userMessage,
      blogType,
      internalLinks,
      selectedBlocks
    );

    const result = streamObject({
      // model: anthropic("claude-3-5-sonnet-latest"),
      model: google("gemini-1.5-flash-latest"),
      // model: google("gemini-2.0-flash-exp"),
      schema: contentBlockSchema,
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Blog generation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate blog content" }),
      { status: 500 }
    );
  }
}
