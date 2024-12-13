"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { BlogBlock } from "@/lib/types";
import { ImageBlock } from "./blocks/image-block";

interface BlogPreviewProps {
  blocks: BlogBlock[];
  title: string;
  onUpdateBlock?: (id: string, content: string, imageUrl?: string) => void;
}

export function BlogPreview({ blocks, title, onUpdateBlock }: BlogPreviewProps) {
  const handleUpdateImage = (id: string, content: string, imageUrl: string) => {
    onUpdateBlock?.(id, content, imageUrl);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="flex items-center gap-2 text-muted-foreground mb-8">
        <Avatar className="h-6 w-6">
          <AvatarImage src="/user-avatar.png" alt="Author" />
        </Avatar>
        <span>Reuben</span>
        <Separator orientation="vertical" className="h-4" />
        <span>{format(new Date(), "MMMM d, yyyy")}</span>
      </div>
      {blocks.map((block) => (
        <div key={block.id} className="mb-8">
          {block.type === 'image' ? (
            <ImageBlock
              block={block}
              onUpdate={handleUpdateImage}
            />
          ) : (
            <div
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          )}
        </div>
      ))}
    </div>
  );
}