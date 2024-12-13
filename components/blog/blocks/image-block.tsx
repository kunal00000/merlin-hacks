"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Upload } from "lucide-react";
import { useState } from "react";
import { BlogBlock } from "@/lib/types";

interface ImageBlockProps {
  block: BlogBlock;
  onUpdate: (id: string, content: string, imageUrl: string) => void;
}

export function ImageBlock({ block, onUpdate }: ImageBlockProps) {
  const [imageUrl, setImageUrl] = useState(block.imageUrl || "");
  const [caption, setCaption] = useState(block.content || "");

  const handleUpdate = () => {
    onUpdate(block.id, caption, imageUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter image URL..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          onBlur={handleUpdate}
        />
        <Button variant="outline" size="icon">
          <Upload className="h-4 w-4" />
        </Button>
      </div>
      
      {imageUrl && (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={caption}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <Input
        placeholder="Add a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        onBlur={handleUpdate}
      />
    </div>
  );
}