import {
  Anchor,
  AlertTriangle,
  Laugh,
  Ban,
  BarChart3,
  Quote,
  FileText,
  BookOpen,
  MessageSquareQuote,
  Lightbulb,
  BookMarked,
  ArrowRight,
  CheckCircle,
  Image as ImageIcon,
  LucideIcon,
} from 'lucide-react';

export interface GenerateRequest {
  userMessage: string;
  blogType: string;
  internalLinks: string[];
  selectedBlocks: BlogBlock[];
}

export interface GenerateResponse {
  title: string;
  slug: string;
  blocks: Array<{
    type: string;
    content: string;
  }>;
}

export interface BlogBlock {
  id: string;
  type: string;
  content: string;
  imageUrl?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface GenerateResponse {
  success: boolean;
  data?: {
    blocks: Array<{
      title: string;
      content: string;
    }>;
  };
  error?: string;
}

export type TBlogBlock = {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  prompt: string;
  reusable?: boolean;
  disabled?: boolean;
}

export const blocks: TBlogBlock[] = [
  {
    id: 'hook',
    name: 'Hook',
    icon: Anchor,
    color: 'amber',
    prompt:
      "Create an engaging opening that immediately captures the reader's attention.",
    disabled: true,
  },
  {
    id: 'problem-statement',
    name: 'Problem Statement',
    icon: AlertTriangle,
    color: 'amber',
    disabled: true,
    prompt:
      'Clearly define the central challenge or issue the blog post will address.',
  },
  {
    id: 'myth-busting',
    name: 'Myth Busting',
    color: 'amber',
    icon: Ban,
    disabled: true,
    prompt: 'Identify and debunk common misconceptions related to the topic.',
  },
  {
    id: 'inspirational-quote',
    name: 'Inspirational Quote',
    icon: Quote,
    color: 'sky',
    disabled: true,
    prompt: "Include a motivational quote that reinforces the blog's message.",
  },
  {
    id: 'summary',
    name: 'Summary',
    icon: FileText,
    color: 'sky',
    disabled: true,
    prompt: 'Provide a concise overview of the key points discussed.',
  },
  {
    id: 'personal-story',
    name: 'Personal Story',
    icon: BookOpen,
    color: 'sky',
    disabled: true,
    prompt:
      'Share a brief, relatable personal experience that illustrates the topic.',
  },
  {
    id: 'solution',
    name: 'Solution',
    color: 'sky',
    disabled: true,
    icon: Lightbulb,
    prompt: 'Offer practical, actionable solutions to the problem discussed.',
  },
  {
    id: 'call-to-action',
    name: 'Call to Action',
    icon: ArrowRight,
    color: 'fuchsia',
    disabled: true,
    prompt: 'Encourage readers to take specific, meaningful steps.',
  },
  {
    id: 'conclusion',
    name: 'Conclusion',
    icon: CheckCircle,
    color: 'fuchsia',
    disabled: true,
    prompt: 'Wrap up the blog with a powerful, memorable closing statement.',
  },
  // {
  //   id: 'image',
  //   name: 'Image',
  //   icon: ImageIcon,
  //   color: 'orange',
  //   prompt: 'Create a caption for generating image considering nearby blocks.',
  //   reusable: true,
  // },
  {
    id: 'resource',
    name: 'Resource',
    icon: BookMarked,
    color: 'orange',
    reusable: true,
    prompt: 'Recommend additional resources for readers to explore further.',
  },
  {
    id: 'testimonial',
    name: 'Testimonial',
    icon: MessageSquareQuote,
    color: 'orange',
    reusable: true,
    prompt:
      'Present a credible quote or story from someone who has relevant experience.',
  },
  {
    id: 'statistics',
    name: 'Statistics',
    icon: BarChart3,
    color: 'orange',
    reusable: true,
    prompt:
      "Provide data-driven insights that support the blog's main argument.",
  },
  {
    id: 'joke',
    name: 'Joke',
    icon: Laugh,
    color: 'orange',
    reusable: true,
    prompt:
      "Insert a relevant, light-hearted joke that connects to the blog's theme.",
  },
];
