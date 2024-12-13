import { z } from 'zod';

export const contentBlockSchema = z.object({
  title: z.string().describe("SEO-optimized title for the blog"),
  slug: z.string().describe("URL-friendly slug"),
  blocks: z.array(
    z.object({
      type: z.string().describe('Block id in format personal-story, hook, call-to-action, etc.'),
      content: z.string().describe('Content of the block may or may not have subheadings for block content in markdown format'),
    })
  ),
});

export type GeneratedContent = z.infer<typeof contentBlockSchema>;
