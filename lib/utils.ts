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

Main Topic/Keywords: ${userMessage}

Content Structure:
${blockInstructions}
${linksInstruction}

SEO Requirements:
- Include main keywords naturally in the first 100 words
- Use LSI (Latent Semantic Indexing) keywords throughout
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