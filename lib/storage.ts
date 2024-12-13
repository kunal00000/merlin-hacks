"use client";

import { BlogBlock, Message } from "./types";

const STORAGE_KEY = "blog_generator_state";

interface StorageState {
  messages: Message[];
  blogBlocks: BlogBlock[];
  blogTitle: string;
  selectedBlogType: string | null;
  internalLinks: string[];
  currentStep: string;
  initialPrompt: string;
  editedBlocks: BlogBlock[];
  editedTitle: string;
}

export function saveToStorage(state: Partial<StorageState>) {
  if (typeof window === 'undefined') return;
  
  const currentState = loadFromStorage();
  const newState = { ...currentState, ...state };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
}

export function loadFromStorage(): StorageState {
  if (typeof window === 'undefined') {
    return {
      messages: [],
      blogBlocks: [],
      blogTitle: "",
      selectedBlogType: null,
      internalLinks: [],
      currentStep: "initial",
      initialPrompt: "",
      editedBlocks: [],
      editedTitle: "",
    };
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return {
    messages: [],
    blogBlocks: [],
    blogTitle: "",
    selectedBlogType: null,
    internalLinks: [],
    currentStep: "initial",
    initialPrompt: "",
    editedBlocks: [],
    editedTitle: "",
  };

  return JSON.parse(saved);
}

export function clearStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
