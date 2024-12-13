import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TBlogBlock } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createPrompt(
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

  return `Create a ${blogType} with these requirements:

Main Topic/Keywords/User Intent for blog generation: ${userMessage}

Content Structure:
${blockInstructions}
${linksInstruction}

Requirements:
- Ensure main keywords placement naturally in the first 100 words
- Use LSI (Latent Semantic Indexing) keywords throughout
- Use markdown ## to ###### for subheadings hierarchically
- Use >> for quotes (testimonials, inspiration quotes, etc.)
- Include subheadings for better readability
- Use **bold** for emphasis on key terms
- Use bullet points for better scanability
- Keep paragraphs short (3-4 sentences max)
- Use the selected blocks in the order provided
- Ensure smooth transitions between blocks
- Write in a conversational, engaging style
- Provide actionable insights
- Use tables or lists where applicable
- Aim for 800-1200 words
- Use markdown for formatting
- Include clear relevant headings for each section
- Make sure to separate sections with newlines
${internalLinks.length > 0 ? '- Naturally incorporate the provided internal links where relevant' : ''}

Format the response as a JSON object with:
- title: SEO-optimized title
- slug: URL-friendly version of title
- blocks: Array of content blocks matching the structure
- metadata: Including keywords, description, and estimated reading time

  Write the blog post now:`;
}