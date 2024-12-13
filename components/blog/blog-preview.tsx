"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { BlogBlock } from "@/lib/types";
import { ImageBlock } from "./blocks/image-block";
import { formatMarkdown } from "@/lib/markdown";
import { UserCircleIcon } from "lucide-react";

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
  onSave,
}: BlogPreviewProps) {
  const [localBlocks, setLocalBlocks] = useState(blocks);
  const [localTitle, setLocalTitle] = useState(title);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalBlocks(blocks);
    setLocalTitle(title);
  }, [blocks, title]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (hasChanges && onSave) {
          onSave();
          setHasChanges(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasChanges, onSave]);

  const handleContentChange = (
    id: string,
    content: string,
    imageUrl?: string
  ) => {
    setLocalBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
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
    if (content.trim().startsWith("<")) {
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
        <UserCircleIcon className="h-6 w-6 stroke-orange-300" />
        <span>Kunal Verma</span>
        <Separator orientation="vertical" className="h-4" />
        <span>{format(new Date(), "MMMM d, yyyy")}</span>
      </div>

      {localBlocks.map((block) => (
        <div key={block.id} className="mb-4">
          <div>
            {block.type === "image" ? (
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
                  __html: renderContent(block.content),
                }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'A') {
                    const href = (target as HTMLAnchorElement).href;
                    if (href) {
                      window.open(href, '_blank'); // Open the link in a new tab
                      e.preventDefault(); // Prevent contentEditable from interfering
                    }
                  }
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
