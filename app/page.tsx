"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogPreview } from "@/components/blog/blog-preview";
import { BlogStructure } from "@/components/blog/blog-structure";
import { Message, BlogBlock, TBlogBlock, blocks as availableBlocks } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { BlogTypeSelector } from "@/components/chat/blog-type-selector";
import { MultiInput } from "@/components/chat/multi-input";
import { Button } from "@/components/ui/button";
import { saveToStorage, loadFromStorage } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

type Step = 'initial' | 'blogType' | 'internalLinks' | 'structure' | 'generating';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [blogBlocks, setBlogBlocks] = useState<BlogBlock[]>([]);
  const [editedBlocks, setEditedBlocks] = useState<BlogBlock[]>([]);
  const [selectedBlockTypes, setSelectedBlockTypes] = useState<TBlogBlock[]>([]);
  const [previewMode, setPreviewMode] = useState<string>("structure");
  const [blogTitle, setBlogTitle] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [selectedBlogType, setSelectedBlogType] = useState<string | null>(null);
  const [internalLinks, setInternalLinks] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>('initial');
  const [initialPrompt, setInitialPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const { toast } = useToast();

  // Load saved state
  useEffect(() => {
    const savedState = loadFromStorage();
    if (!savedState) return;

    setMessages(savedState.messages || []);
    setBlogBlocks(savedState.blogBlocks || []);
    setEditedBlocks(savedState.editedBlocks || savedState.blogBlocks || []);
    setBlogTitle(savedState.blogTitle || "");
    setEditedTitle(savedState.editedTitle || savedState.blogTitle || "");
    setSelectedBlogType(savedState.selectedBlogType || null);
    setInternalLinks(savedState.internalLinks || []);
    setCurrentStep(savedState.currentStep as Step || 'initial');
    setInitialPrompt(savedState.initialPrompt || "");
    
    const savedBlockTypes = (savedState.blogBlocks || []).map(block => 
      availableBlocks.find(b => b.id === block.type)
    ).filter((b): b is TBlogBlock => b !== undefined);
    setSelectedBlockTypes(savedBlockTypes);
  }, []);

  // Save state changes
  useEffect(() => {
    const state = {
      messages,
      blogBlocks,
      editedBlocks,
      blogTitle,
      editedTitle,
      selectedBlogType,
      internalLinks,
      currentStep,
      initialPrompt,
    };
    saveToStorage(state);
  }, [messages, blogBlocks, editedBlocks, blogTitle, editedTitle, selectedBlogType, internalLinks, currentStep, initialPrompt]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const handleInitialMessage = async (message: string) => {
    if (!message.trim()) return;
    
    setInitialPrompt(message);
    addMessage('user', message);
    await new Promise(resolve => setTimeout(resolve, 500));
    addMessage('assistant', "I'll help you create a blog. First, please select the type of blog you'd like to create:");
    setCurrentStep('blogType');
  };

  const handleBlogTypeSelection = async (type: string) => {
    if (!type) return;

    addMessage('user', `I want to create a ${type}`);
    setSelectedBlogType(type);
    await new Promise(resolve => setTimeout(resolve, 500));
    addMessage('assistant', "Would you like to include any internal links in your blog? If yes, please add them below. If not, just click 'Continue':");
    setCurrentStep('internalLinks');
  };

  const handleInternalLinksSubmission = async () => {
    if (internalLinks.length > 0) {
      addMessage('user', `Include these internal links: ${internalLinks.join(", ")}`);
    } else {
      addMessage('user', "No internal links needed");
    }
    
    addMessage('assistant', "Great! Now let's arrange the structure of your blog. Add the blocks you want to include and arrange them in the desired order. Click 'Generate Blog' when you're ready.");
    setCurrentStep('structure');
    const newTitle = `${selectedBlogType}: ${initialPrompt}`;
    setBlogTitle(newTitle);
    setEditedTitle(newTitle);
  };

  const handleGenerateBlog = async () => {
    if (blogBlocks.length === 0) {
      toast({
        title: "No blocks added",
        description: "Please add at least one block to your blog structure",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setCurrentStep('generating');
    addMessage('user', "Generate blog with the selected structure");

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: initialPrompt,
          blogType: selectedBlogType,
          internalLinks,
          selectedBlocks: selectedBlockTypes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate blog content');
      }

      const data = await response.json();

      if (!data.title || !data.blocks) {
        throw new Error('Invalid response format');
      }

      setBlogTitle(data.title);
      setEditedTitle(data.title);

      const generatedBlocks = data.blocks.map((block: any, index: number) => ({
        id: `${block.type}-${Date.now()}-${index}`,
        ...block
      }));

      setBlogBlocks(generatedBlocks);
      setEditedBlocks(generatedBlocks);
      setPreviewMode("preview");
      setIsDirty(false);
      
      addMessage('assistant', "I've generated your blog content based on your requirements. You can view and edit it in the preview section.");

      toast({
        title: "Blog Generated Successfully",
        description: "Your blog content is ready for review and editing."
      });
    } catch (error) {
      console.error('Error generating blog:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate blog content. Please try again.",
        variant: "destructive"
      });
      addMessage('assistant', "Sorry, I encountered an error while generating the blog content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContent = () => {
    if (!isDirty) return;

    try {
      setBlogBlocks([...editedBlocks]);
      setBlogTitle(editedTitle);
      setIsDirty(false);
      
      saveToStorage({
        blogBlocks: editedBlocks,
        editedBlocks,
        blogTitle: editedTitle,
        editedTitle,
      });
      
      toast({
        title: "Changes Saved",
        description: "Your blog content has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateBlock = (id: string, content: string, imageUrl?: string) => {
    setEditedBlocks(blocks =>
      blocks.map(block =>
        block.id === id 
          ? { ...block, content, imageUrl: imageUrl || block.imageUrl } 
          : block
      )
    );
    setIsDirty(true);
  };

  const handleUpdateTitle = (newTitle: string) => {
    setEditedTitle(newTitle);
    setIsDirty(true);
  };

  const renderInputSection = () => {
    switch (currentStep) {
      case 'initial':
        return (
          <ChatInput
            message={currentInput}
            setMessage={setCurrentInput}
            onSend={handleInitialMessage}
            disabled={isLoading}
            showControls={true}
          />
        );
      case 'blogType':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 border-t border-border"
          >
            <BlogTypeSelector
              selected={selectedBlogType}
              onSelect={handleBlogTypeSelection}
              disabled={isLoading}
            />
          </motion.div>
        );
      case 'internalLinks':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 border-t border-border space-y-4"
          >
            <MultiInput
              value={internalLinks}
              onChange={setInternalLinks}
              placeholder="Add internal links (optional)..."
              disabled={isLoading}
            />
            <Button
              onClick={handleInternalLinksSubmission}
              className="w-full"
              disabled={isLoading}
            >
              Continue
            </Button>
          </motion.div>
        );
      case 'structure':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 border-t border-border"
          >
            <Button
              onClick={handleGenerateBlog}
              className="w-full"
              disabled={isLoading || blogBlocks.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Blog...
                </>
              ) : (
                'Generate Blog'
              )}
            </Button>
          </motion.div>
        );
      case 'generating':
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="w-1/2 border-r border-border flex flex-col">
        <ChatHeader />
        <ScrollArea className="flex-1 p-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ChatMessage message={msg} />
              </motion.div>
            ))}
            {isLoading && currentStep === 'generating' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-4 space-y-4"
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Generating your blog content...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
        <AnimatePresence mode="wait">
          {renderInputSection()}
        </AnimatePresence>
      </div>

      <div className="w-1/2 flex flex-col">
        <BlogHeader 
          previewMode={previewMode} 
          setPreviewMode={setPreviewMode}
          onSave={previewMode === "preview" && isDirty ? handleSaveContent : undefined}
          hasChanges={isDirty}
        />
        <ScrollArea className="flex-1 p-4">
          <AnimatePresence mode="wait">
            {previewMode === "preview" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BlogPreview
                  blocks={editedBlocks}
                  title={editedTitle}
                  onUpdateBlock={handleUpdateBlock}
                  onUpdateTitle={handleUpdateTitle}
                  onSave={handleSaveContent}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BlogStructure
                  blocks={blogBlocks}
                  onAddBlock={(blockType) => {
                    const selectedBlockType = availableBlocks.find(b => b.id === blockType);
                    if (selectedBlockType) {
                      const newBlock = { 
                        id: `${blockType}-${Date.now()}`, 
                        type: blockType, 
                        content: "" 
                      };
                      setBlogBlocks(prev => [...prev, newBlock]);
                      setEditedBlocks(prev => [...prev, newBlock]);
                      setSelectedBlockTypes(prev => [...prev, selectedBlockType]);
                    }
                  }}
                  onRemoveBlock={(blockId) => {
                    const blockToRemove = blogBlocks.find(b => b.id === blockId);
                    if (blockToRemove) {
                      setBlogBlocks(blocks => blocks.filter(block => block.id !== blockId));
                      setEditedBlocks(blocks => blocks.filter(block => block.id !== blockId));
                      setSelectedBlockTypes(prev => 
                        prev.filter(b => b.id !== blockToRemove.type)
                      );
                    }
                  }}
                  onReorderBlocks={(newBlocks) => {
                    setBlogBlocks(newBlocks);
                    setEditedBlocks(newBlocks.map(block => {
                      const editedBlock = editedBlocks.find(eb => eb.id === block.id);
                      return editedBlock || block;
                    }));
                    const newSelectedTypes = newBlocks
                      .map(block => availableBlocks.find(b => b.id === block.type))
                      .filter((b): b is TBlogBlock => b !== undefined);
                    setSelectedBlockTypes(newSelectedTypes);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </div>
  );
}
