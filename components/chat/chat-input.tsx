"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
}

export function ChatInput({ message, setMessage, onSend }: ChatInputProps) {
  return (
    <div className="p-4 border-t border-border">
      <div className="flex gap-2">
        <Input
          placeholder="Write a blog about..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSend()}
        />
        <Button size="icon" onClick={onSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}