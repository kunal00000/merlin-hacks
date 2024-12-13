"use client";

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Save } from "lucide-react";

interface BlogHeaderProps {
  previewMode: string;
  setPreviewMode: (value: string) => void;
  onSave?: () => void;
  hasChanges?: boolean;
}

export function BlogHeader({ 
  previewMode, 
  setPreviewMode, 
  onSave,
  hasChanges 
}: BlogHeaderProps) {
  return (
    <header className="p-2.5 border-b border-border flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onSave}
          disabled={!hasChanges}
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      
      <Tabs 
        value={previewMode} 
        onValueChange={setPreviewMode} 
        className="w-56 rounded-full ml-auto"
      >
        <TabsList className="grid w-full grid-cols-2 rounded-full">
          <TabsTrigger value="preview" className="rounded-full">
            Preview
          </TabsTrigger>
          <TabsTrigger value="structure" className="rounded-full">
            Structure
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
}
