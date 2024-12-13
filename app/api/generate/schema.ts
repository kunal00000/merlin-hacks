import { z } from 'zod';

export const contentBlockSchema = z.object({
  title: z.string().describe("SEO-optimized title for the blog"),
  slug: z.string().describe("URL-friendly slug"),
  blocks: z.array(
    z.object({
      type: z.string().describe('Type of the block'),
      content: z.string().describe('Content of the block'),
      imageUrl: z.string().optional().describe('URL for image blocks')
    })
  ),
  metadata: z.object({
    keywords: z.array(z.string()),
    description: z.string(),
    readingTime: z.number()
  })
});

export type GeneratedContent = z.infer<typeof contentBlockSchema>;


// import { z } from 'zod';

// export const contentBlockSchema = z.object({
//     title: z.string().describe("Title for blog"),
//     contentBlocks: z.array(
//         z.object({
//             blockName: z.string().describe('Name of a block for blog.'),
//             content: z
//                 .string()
//                 .describe('Content of blog for this particular block or caption of image if image block.'),
//         })
//     ),
// });
