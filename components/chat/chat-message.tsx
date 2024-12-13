"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Message } from "@/lib/types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex gap-2 mb-4 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.role === "assistant" && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/merlin-avatar.png" alt="Merlin" />
        </Avatar>
      )}
      <Card
        className={`p-3 max-w-[80%] ${
          message.role === "user" ? "bg-primary text-primary-foreground" : ""
        }`}
      >
        {message.content}
      </Card>
      {message.role === "user" && (
        <Avatar className="h-8 w-8 bg-primary">
          <AvatarImage src="/user-avatar.png" alt="User" />
        </Avatar>
      )}
    </div>
  );
}