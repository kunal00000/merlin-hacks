"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { BlogBlock } from "@/lib/types";
import { ImageBlock } from "./blocks/image-block";
import { useToast } from "@/hooks/use-toast";
import { formatMarkdown } from "@/lib/markdown";

interface BlogPreviewProps {
  blocks: BlogBlock[];
  title: string;
  onUpdateBlock: (id: string, content: string, imageUrl?: string) => void;
  onUpdateTitle: (title: string) => void;
  onSave?: () => void;
}

export function BlogPreview({
  blocks,
  title,
  onUpdateBlock,
  onUpdateTitle,
  onSave
}: BlogPreviewProps) {
  const [localBlocks, setLocalBlocks] = useState(blocks);
  const [localTitle, setLocalTitle] = useState(title);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLocalBlocks(blocks);
    setLocalTitle(title);
  }, [blocks, title]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (hasChanges && onSave) {
          onSave();
          setHasChanges(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasChanges, onSave]);

  const handleContentChange = (id: string, content: string, imageUrl?: string) => {
    setLocalBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === id ? { ...block, content } : block
      )
    );
    onUpdateBlock(id, content, imageUrl);
    setHasChanges(true);
  };

  const handleTitleChange = (newTitle: string) => {
    setLocalTitle(newTitle);
    onUpdateTitle(newTitle);
    setHasChanges(true);
  };

  const renderContent = (content: string) => {
    if (content.trim().startsWith('<')) {
      return content;
    }
    return formatMarkdown(content);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div
        contentEditable
        className="text-3xl font-bold mb-4 outline-none border-b-2 border-transparent focus:border-primary transition-colors"
        dangerouslySetInnerHTML={{ __html: localTitle }}
        onBlur={(e) => {
          const newTitle = e.currentTarget.textContent;
          if (newTitle && newTitle !== title) {
            handleTitleChange(newTitle);
          }
        }}
      />

      <div className="flex items-center gap-2 text-muted-foreground mb-8">
        <Avatar className="h-6 w-6">
          <AvatarImage src="/user-avatar.png" alt="Author" />
        </Avatar>
        <span>Author</span>
        <Separator orientation="vertical" className="h-4" />
        <span>{format(new Date(), "MMMM d, yyyy")}</span>
      </div>

      {localBlocks.map((block) => (
        <div key={block.id} className="mb-4">
          <p className="text-gray-300 italic font-semibold text-sm">
            {block.type}
          </p>
          <div>
            {block.type === 'image' ? (
              <ImageBlock
                block={block}
                onUpdate={(id, content, imageUrl) => {
                  handleContentChange(block.id, content, imageUrl);
                }}
              />
            ) : (
              <div
                contentEditable
                className="prose prose-neutral dark:prose-invert max-w-none outline-none border-l-2 border-transparent focus:border-primary transition-colors pl-4"
                dangerouslySetInnerHTML={{ 
                  __html: renderContent(block.content)
                }}
                onBlur={(e) => {
                  const newContent = e.currentTarget.innerHTML;
                  if (newContent !== block.content) {
                    handleContentChange(block.id, newContent);
                  }
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
