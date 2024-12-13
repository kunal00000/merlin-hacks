"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface BlogHeaderProps {
  previewMode: "preview" | "structure";
  setPreviewMode: (mode: "preview" | "structure") => void;
}

export function BlogHeader({ previewMode, setPreviewMode }: BlogHeaderProps) {
  return (
    <header className="p-4 border-b border-border flex items-center justify-between">
      <div className="flex gap-2">
        <Button
          variant={previewMode === "preview" ? "default" : "ghost"}
          size="sm"
          onClick={() => setPreviewMode("preview")}
        >
          Preview
        </Button>
        <Button
          variant={previewMode === "structure" ? "default" : "ghost"}
          size="sm"
          onClick={() => setPreviewMode("structure")}
        >
          Structure
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm">Publish this version</Button>
      </div>
    </header>
  );
}