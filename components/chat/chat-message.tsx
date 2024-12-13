"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Message } from "@/lib/types";
import { UserCircleIcon } from "lucide-react";

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
         <UserCircleIcon className="h-6 w-6 fill-accent stroke-gray-400" />
      )}
      <Card
        className={`py-2 px-4 max-w-[80%] rounded-xl ${
          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {message.content}
      </Card>
      {message.role === "user" && (
         <UserCircleIcon className="h-6 w-6 fill-accent stroke-gray-400" />
      )}
    </div>
  );
}