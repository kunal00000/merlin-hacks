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

  return `You are a professional content creator specializing in generating high-quality blog posts. Your task is to create a blog post based on the provided information and requirements.

First, let's review the key elements:

Blog Type:
<blog_type>
${blogType}
</blog_type>

Main Topic/Keywords/User Intent:
<main_topic>
${userMessage}
</main_topic>

Content Structure:
<content_structure>
${blockInstructions}
</content_structure>

Internal Links to Include (use descriptive anchor text):
<internal_links>
${internalLinks.join('\n')}
</internal_links>

Now, please follow these steps to create the blog post:

1. Analyze the blog type and main topic to determine the appropriate tone and approach.

2. Plan the content structure based on the provided outline and blog type.

3. Generate an SEO-optimized title and URL-friendly slug.

4. Write the blog post content, ensuring to:
   - Place main keywords naturally in the first 100 words
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
   - Use tables for stats, comparison or lists where applicable 
   - Aim for 800-1200 words
   - Use markdown for formatting
   - Include clear relevant headings for each section
   - Separate sections with newlines
   - Naturally incorporate the provided internal links where relevant (if any)

5. Review and refine the content to ensure all requirements are met.

6. Format the response as a JSON object with the following structure:
   - title: SEO-optimized title
   - slug: URL-friendly version of title
   - blocks: Array of content blocks matching the structure

Before generating the final output, please use <blog_planning> tags to plan and outline the blog post. This should include:

1. Analysis of the blog type and main topic, considering the appropriate tone and approach.
2. Detailed outline of the content structure, expanding on the provided outline.
3. List of key points to cover in each section.
4. Plan for incorporating SEO elements, including:
   - 3-5 potential titles and their corresponding slugs
   - List of potential LSI keywords related to the main topic
5. Strategy for naturally incorporating internal links, specifying potential sections for each link.
6. Estimated word count for each section to ensure the overall length falls within the 800-1200 word range.
7. Considerations for tone and style appropriate for the target audience based on the blog type.

After your planning process, provide the final blog post in the specified JSON format. It's OK for the blog planning section to be quite long.`;
}
