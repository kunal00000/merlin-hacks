'use client';

import { Button } from '@/components/ui/button';
import { BlogBlock, blocks as availableBlocks } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BlogStructureItem } from './blog-structure-item';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Plus, Check } from 'lucide-react';

interface BlogStructureProps {
  blocks: BlogBlock[];
  onAddBlock: (blockType: string) => void;
  onRemoveBlock: (blockId: string) => void;
  onReorderBlocks: (blocks: BlogBlock[]) => void;
}

export function BlogStructure({
  blocks,
  onAddBlock,
  onRemoveBlock,
  onReorderBlocks,
}: BlogStructureProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      const newBlocks = [...blocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      onReorderBlocks(newBlocks);
    }
  }

  const getBlockAvailability = (blockType: string) => {
    const block = availableBlocks.find((b) => b.id === blockType);
    if (block?.disabled) {
      const exists = blocks.some((b) => b.type === blockType);
      return !exists;
    }
    return true;
  };

  return (
    <div className="max-w-xl mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={blocks.map((block) => block.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <BlogStructureItem
              key={block.id}
              block={block}
              onRemove={onRemoveBlock}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Blocks
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Block</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {availableBlocks.map((block) => (
              <Button
                key={block.id}
                variant="outline"
                className={cn(
                  'justify-start',
                  `border-2 bg-${block.color}-300/10 text-${block.color}-600 border-${block.color}-100 dark:border-${block.color}-900`
                )}
                onClick={() => onAddBlock(block.id)}
                disabled={!getBlockAvailability(block.id)}
              >
                <block.icon className="h-4 w-4 mr-2" />
                {block.name}
                {!getBlockAvailability(block.id) && (
                  <Check className="h-4 w-4 shrink-0 opacity-70 ml-auto" />
                )}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
