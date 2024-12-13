"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BLOG_TYPES = [
  "News Article",
  "Blog Post",
  "How-To Guide", 
  "Listicle",
  "Comparison Blog",
  "Technical Article",
  "Product Review"
];

interface BlogTypeSelectorProps {
  selected: string | null;
  onSelect: (type: string) => void;
  disabled?: boolean;
}

export function BlogTypeSelector({ selected, onSelect, disabled }: BlogTypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {BLOG_TYPES.map((type) => (
        <Button
          key={type}
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn(
            "transition-colors",
            selected === type && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={() => onSelect(type)}
        >
          {type}
        </Button>
      ))}
    </div>
  );
}
