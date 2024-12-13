'use client';

import { Button } from '@/components/ui/button';
import { GripVertical, MessageSquare, Trash2 } from 'lucide-react';
import { BlogBlock, blocks } from '@/lib/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface BlogStructureItemProps {
  block: BlogBlock;
  onRemove: (id: string) => void;
}

export function BlogStructureItem({ block, onRemove }: BlogStructureItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const blockConfig = blocks.find((b) => b.id === block.type);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 px-2 pl-4 py-1 rounded-lg mb-2 group relative',
        `border-2 bg-${blockConfig?.color}-300/10 text-${blockConfig?.color}-600 border-${blockConfig?.color}-100 dark:border-${blockConfig?.color}-900`
      )}
    >
      <button
        className="cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <div className="flex items-center gap-2 flex-1">
        {blockConfig?.icon && (
          <blockConfig.icon className="h-4 w-4 text-muted-foreground" />
        )}
        <span>{blockConfig?.name || block.type}</span>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemove(block.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
