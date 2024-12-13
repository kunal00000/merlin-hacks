"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogPreview } from "@/components/blog/blog-preview";
import { BlogStructure } from "@/components/blog/blog-structure";
import { Message, BlogBlock, GenerateResponse, TBlogBlock, blocks as availableBlocks } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { BlogTypeSelector } from "@/components/chat/blog-type-selector";
import { MultiInput } from "@/components/chat/multi-input";
import { Button } from "@/components/ui/button";
import { saveToStorage, loadFromStorage } from "@/lib/storage";

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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBlogType, setSelectedBlogType] = useState<string | null>(null);
  const [internalLinks, setInternalLinks] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>('initial');
  const [initialPrompt, setInitialPrompt] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedState = loadFromStorage();
    setMessages(savedState.messages);
    setBlogBlocks(savedState.blogBlocks);
    setEditedBlocks(savedState.editedBlocks || savedState.blogBlocks);
    setBlogTitle(savedState.blogTitle);
    setEditedTitle(savedState.editedTitle || savedState.blogTitle);
    setSelectedBlogType(savedState.selectedBlogType);
    setInternalLinks(savedState.internalLinks);
    setCurrentStep(savedState.currentStep as Step);
    setInitialPrompt(savedState.initialPrompt);
    
    // Reconstruct selectedBlockTypes from saved blocks
    const savedBlockTypes = savedState.blogBlocks.map(block => 
      availableBlocks.find(b => b.id === block.type)
    ).filter((b): b is TBlogBlock => b !== undefined);
    setSelectedBlockTypes(savedBlockTypes);
  }, []);

  useEffect(() => {
    saveToStorage({
      messages,
      blogBlocks,
      editedBlocks,
      blogTitle,
      editedTitle,
      selectedBlogType,
      internalLinks,
      currentStep,
      initialPrompt,
    });
  }, [messages, blogBlocks, editedBlocks, blogTitle, editedTitle, selectedBlogType, internalLinks, currentStep, initialPrompt]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const handleInitialMessage = async (message: string) => {
    setInitialPrompt(message);
    addMessage('user', message);
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    addMessage('assistant', "I'll help you create a blog. First, please select the type of blog you'd like to create:");
    setCurrentStep('blogType');
    setIsLoading(false);
  };

  const handleBlogTypeSelection = async (type: string) => {
    addMessage('user', `I want to create a ${type}`);
    setSelectedBlogType(type);
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    addMessage('assistant', "Would you like to include any internal links in your blog? If yes, please add them below. If not, just click 'Continue':");
    setCurrentStep('internalLinks');
    setIsLoading(false);
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
        console.log(await response.json())
        throw new Error('Failed to generate blog content');
      }

      const data: GenerateResponse = await response.json();

      setBlogTitle(data.title);
      setEditedTitle(data.title);

      const generatedBlocks = data.blocks.map((block, index) => ({
        ...block,
        id: `${block.type}-${index}`,
      }));

      setBlogBlocks(generatedBlocks);
      setEditedBlocks(generatedBlocks);
      setPreviewMode("preview");
      
      addMessage('assistant', "I've generated your blog content based on your requirements. You can view and edit it in the preview section.");

      toast({
        title: "Blog Generated Successfully",
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
    setBlogBlocks(editedBlocks);
    setBlogTitle(editedTitle);
    setHasUnsavedChanges(false);
    
    saveToStorage({
      blogBlocks: editedBlocks,
      editedBlocks,
      blogTitle: editedTitle,
      editedTitle,
    });
    
    toast({
      title: "Content saved",
      description: "Your blog has been saved successfully.",
    });
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
          <div className="p-4 border-t border-border">
            <BlogTypeSelector
              selected={selectedBlogType}
              onSelect={handleBlogTypeSelection}
              disabled={isLoading}
            />
          </div>
        );
      case 'internalLinks':
        return (
          <div className="p-4 border-t border-border space-y-4">
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
          </div>
        );
      case 'structure':
        return (
          <div className="p-4 border-t border-border">
            <Button
              onClick={handleGenerateBlog}
              className="w-full"
              disabled={isLoading || blogBlocks.length === 0}
            >
              Generate Blog
            </Button>
          </div>
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
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
        </ScrollArea>
        {renderInputSection()}
      </div>

      <div className="w-1/2 flex flex-col">
        <BlogHeader 
          previewMode={previewMode} 
          setPreviewMode={setPreviewMode}
          onSave={previewMode === "preview" ? handleSaveContent : undefined}
          hasChanges={hasUnsavedChanges}
        />
        <ScrollArea className="flex-1 p-4">
          {previewMode === "preview" ? (
            <BlogPreview
              blocks={editedBlocks}
              title={editedTitle}
              onUpdateBlock={(id, content, imageUrl) => {
                setEditedBlocks(blocks =>
                  blocks.map(block =>
                    block.id === id 
                      ? { ...block, content, imageUrl: imageUrl || block.imageUrl } 
                      : block
                  )
                );
                setHasUnsavedChanges(true);
              }}
              onUpdateTitle={(newTitle) => {
                setEditedTitle(newTitle);
                setHasUnsavedChanges(true);
              }}
              onSave={handleSaveContent}
            />
          ) : (
            <BlogStructure
              blocks={blogBlocks}
              onAddBlock={(blockType) => {
                const selectedBlockType = availableBlocks.find(b => b.id === blockType);
                if (selectedBlockType) {
                  const newBlock = { 
                    id: Math.random().toString(), 
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
                // Update selectedBlockTypes order to match new block order
                const newSelectedTypes = newBlocks
                  .map(block => availableBlocks.find(b => b.id === block.type))
                  .filter((b): b is TBlogBlock => b !== undefined);
                setSelectedBlockTypes(newSelectedTypes);
              }}
            />
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
