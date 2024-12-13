"use client";

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface BlogHeaderProps {
  previewMode: string
  setPreviewMode: (value: string) => void;
}

export function BlogHeader({ previewMode, setPreviewMode }: BlogHeaderProps) {
  return (
    <header className="p-2.5 border-b border-border flex items-center justify-between">
      <Tabs value={previewMode} onValueChange={setPreviewMode} className="w-56 rounded-full ml-auto">
      <TabsList className="grid w-full grid-cols-2 rounded-full">
        <TabsTrigger value={"preview"} className="rounded-full">Preview</TabsTrigger>
        <TabsTrigger value={"structure"} className="rounded-full">Structure</TabsTrigger>
      </TabsList>
    </Tabs>
    </header>
  );
}