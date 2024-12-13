"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogPreview } from "@/components/blog/blog-preview";
import { BlogStructure } from "@/components/blog/blog-structure";
import { Message, BlogBlock } from "@/lib/types";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [blogBlocks, setBlogBlocks] = useState<BlogBlock[]>([]);
  const [previewMode, setPreviewMode] = useState<"preview" | "structure">("structure");
  const [blogTitle, setBlogTitle] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { role: "user", content: message }]);
    // Here you would typically make an API call to Gemini
    setMessage("");
  };

  const handleAddBlock = (blockType: string) => {
    setBlogBlocks([
      ...blogBlocks,
      { id: Math.random().toString(), type: blockType, content: "" },
    ]);
  };

  const handleRemoveBlock = (blockId: string) => {
    setBlogBlocks(blogBlocks.filter((block) => block.id !== blockId));
  };

  const handleReorderBlocks = (newBlocks: BlogBlock[]) => {
    setBlogBlocks(newBlocks);
  };

  const handleUpdateBlock = (id: string, content: string, imageUrl?: string) => {
    setBlogBlocks(blocks =>
      blocks.map(block =>
        block.id === id
          ? { ...block, content, imageUrl }
          : block
      )
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="w-1/2 border-r border-border flex flex-col">
        <ChatHeader />
        <ScrollArea className="flex-1 p-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
        </ScrollArea>
        <ChatInput
          message={message}
          setMessage={setMessage}
          onSend={handleSendMessage}
        />
      </div>

      <div className="w-1/2 flex flex-col">
        <BlogHeader previewMode={previewMode} setPreviewMode={setPreviewMode} />
        <ScrollArea className="flex-1 p-4">
          {previewMode === "preview" ? (
            <BlogPreview
              blocks={blogBlocks}
              title={blogTitle}
              onUpdateBlock={handleUpdateBlock}
            />
          ) : (
            <BlogStructure
              blocks={blogBlocks}
              onAddBlock={handleAddBlock}
              onRemoveBlock={handleRemoveBlock}
              onReorderBlocks={handleReorderBlocks}
            />
          )}
        </ScrollArea>
      </div>
    </div>
  );
}