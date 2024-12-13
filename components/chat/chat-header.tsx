'use client';

import { DarkModeToggle } from '../ui/dark-mode-toggle';

export function ChatHeader() {
  return (
    <header className="p-4 border-b border-border flex items-center gap-2">
      <DarkModeToggle />
      <h1 className="text-xl font-semibold">Blog Generator</h1>
    </header>
  );
}
