import { NextRequest } from 'next/server';
import { contentBlockSchema } from './schema';
import { TBlogBlock } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

function createPrompt(
  userMessage: string,
  blogType: string,
  internalLinks: string[],
  selectedBlocks: TBlogBlock[]
) {
  // Now we have access to the block prompts
  const blockInstructions = selectedBlocks
    .map((block) => `[${block.name}]: ${block.prompt}`)
    .join('\n');

  const linksInstruction = internalLinks.length > 0
    ? `\nInternal Links to Include (use descriptive anchor text):\n${internalLinks.map(link => `- ${link}`).join('\n')}`
    : '';

  return `Create a comprehensive ${blogType} with these requirements:

Main Topic/Keywords: ${userMessage}

Content Structure:
${blockInstructions}
${linksInstruction}

SEO Requirements:
- Include main keywords naturally in the first 100 words
- Use LSI (Latent Semantic Indexing) keywords throughout
- Create a compelling H1 title (use markdown # syntax)
- Use markdown ## to ###### for subheadings hierarchically
- Include keywords naturally in subheadings
- Use **bold** for emphasis on key terms
- Use bullet points for better scanability
- Keep paragraphs short (3-4 sentences max)
- Ensure natural keyword placement
- Generate a URL-friendly slug

Format the response as a JSON object with:
- title: SEO-optimized title
- slug: URL-friendly version of title
- blocks: Array of content blocks matching the structure
- metadata: Including keywords, description, and estimated reading time

Write in a clear, engaging style that maintains reader interest while naturally incorporating SEO elements.`;
}

export async function POST(request: NextRequest) {
  try {
    const { userMessage, blogType, internalLinks, selectedBlocks } = await request.json();

    if (!userMessage || !selectedBlocks || selectedBlocks.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: userMessage and selectedBlocks' 
        }),
        { status: 400 }
      );
    }

    const prompt = createPrompt(userMessage, blogType, internalLinks, selectedBlocks);
    
    // Simulate AI response for now
    const simulatedResponse = {
      title: `How to ${userMessage} - Complete Guide`,
      slug: `how-to-${userMessage.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      blocks: selectedBlocks.map((block: TBlogBlock) => ({
        type: block.id,
        content: `Generated content for ${block.name}...`,
        imageUrl: block.id === 'image' ? 'https://example.com/image.jpg' : undefined
      })),
      metadata: {
        keywords: [userMessage, ...userMessage.split(' ')],
        description: `Complete guide about ${userMessage}...`,
        readingTime: 5
      }
    };

    const validatedResponse = contentBlockSchema.parse(simulatedResponse);

    return new Response(JSON.stringify(validatedResponse), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate blog content' }),
      { status: 500 }
    );
  }
}

// import { TBlogBlock } from '@/lib/types';
// import { NextRequest } from 'next/server';
// import { google } from '@ai-sdk/google';
// import { streamObject } from 'ai';
// import { contentBlockSchema } from './schema';

// export const dynamic = 'force-dynamic';

// export async function POST(request: NextRequest) {
//   try {
//     const { keywords, internal, userMessage, selectedBlocks } = await request.json();
//     if (!keywords || !selectedBlocks || selectedBlocks.length === 0) {
//       return new Response(
//         JSON.stringify({ error: 'Keywords and blocks are required' }),
//         { status: 400 }
//       );
//     }

//     // Construct block-specific guidance
//     const blockGuidance = selectedBlocks
//       .map((block: TBlogBlock) => `[${block.name}]: ${block.prompt}`)
//       .join('\n');

//     // Construct internal links guidance
//     const linksGuidance = internalLinks && internalLinks.length > 0
//       ? `\nInternal Links to Include:\n${internalLinks.map((link: string) => `- ${link}`).join('\n')}`
//       : '';

//     const prompt = `
//       You are an expert blog writer. Create a comprehensive, engaging blog post.

//       Keywords: ${userMessage}
//         ${keywords}
//       ${linksGuidance}

//       Blog Structure Guidelines:
//       ${blockGuidance}

//       Requirements:
//       - Use the selected blocks in the order provided
//       - Ensure smooth transitions between blocks
//       - Write in a conversational, engaging style
//       - Provide actionable insights
//       - Aim for 800-1200 words
//       - Use markdown for formatting
//       - Include clear headings for each section
//       - Make sure to separate sections with newlines
//       ${internalLinks.length > 0 ? '- Naturally incorporate the provided internal links where relevant' : ''}

//       Write the blog post now:
//     `;

//     const result = streamObject({
//       model: google('gemini-1.5-flash-latest'),
//       schema: contentBlockSchema,
//       prompt,
//     });

//     return result.toTextStreamResponse();
//   } catch (error) {
//     console.error('Blog generation error:', error);
//     return new Response(
//       JSON.stringify({ error: 'Failed to generate blog content' }),
//       { status: 500 }
//     );
//   }
// }
