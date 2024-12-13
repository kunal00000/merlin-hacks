"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
  showControls?: boolean;
}

export function ChatInput({ 
  message, 
  setMessage, 
  onSend, 
  disabled,
  showControls = true
}: ChatInputProps) {
  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim());
  };

  return (
    <div className="p-4 border-t border-border">
      <div className="flex gap-2">
        <Input
          placeholder="Write a blog on..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={disabled}
        />
        {showControls && (
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={disabled || !message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
