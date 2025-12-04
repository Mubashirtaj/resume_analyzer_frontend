"use client";

import { useFetchData } from "@/service/Get_data";
import React, { useEffect, useState, useRef } from "react";
import { Send, Loader2, FileDown, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";

interface ChatpageProps {
  id: string;
}

interface ConversationItem {
  id: string;
  prompt: string;
  createdAt: string;
}

export default function Chatpage({ id }: ChatpageProps) {
  const { data, isLoading, error, refetch } = useFetchData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/conversation/${id}`
  );
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [cvText, setCvText] = useState<string>("");

  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Raw API Data:", data);
    if (data) {
      setConversation(data.conversation || []);
      setCvText(data.CVTEXT?.improvedText || "");
    }
  }, [data]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!inputValue.trim()) return;

  setIsSubmitting(true);

  try {
    const response = await api.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/generate`,
      {
        theme: inputValue.trim(),
        cvId: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setInputValue("");
    await refetch();
  } catch (error) {
    console.error("Error submitting prompt:", error);
    alert("Failed to submit prompt. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-foreground/60">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold mb-2">Error</p>
          <p className="text-foreground/60">Failed to load conversation</p>
        </div>
      </div>
    );
  }

  return (
  <div className=" bg-background flex flex-col overflow-y-auto h-[calc(100vh-0px)]">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Conversation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {conversation.length} message{conversation.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Initial CV Text */}
      {cvText && (
        <div className="bg-secondary/40 rounded-xl p-4 m-4">
          <h3 className="text-lg font-semibold mb-2">Current CV Content:</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap break-words">
            {cvText}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1">
        <div className="w-full px-4 py-8 sm:px-6 space-y-6">
          {conversation.length > 0 ? (
            conversation.map((item: ConversationItem, index: number) => (
              <div key={item.id} className="space-y-4">
                {/* Prompt Message */}
                <div className="flex justify-end">
                  <div className="max-w-2xl bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-6 py-4 shadow-md">
                    <p className="text-sm font-medium mb-1 opacity-75">
                      Your Prompt
                    </p>
                    <p className="text-base leading-relaxed break-words">
                      {item.prompt}
                    </p>
                    <p className="text-xs mt-2 opacity-60">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Response Card */}
                <div className="flex justify-start">
                  <div className="max-w-2xl w-full bg-card border border-border rounded-2xl rounded-tl-none p-6 shadow-md">
                    <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                      AI Response
                    </p>

                    {/* Show CV text in response */}
               

                    {/* CV Ready Status */}
                    <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          Your CV has been updated
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                          Based on your prompt: "{item.prompt}"
                        </p>
                      </div>
                    </div>

                    {/* PDF Download Section */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-accent/10 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileDown className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Download PDF
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Your generated CV is ready to download
                          </p>
                        </div>
                      </div>
                      <a
                        href={`/pdfview/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm whitespace-nowrap shadow-sm"
                      >
                        <FileDown size={16} />
                        Get PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center min-h-96 text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg font-semibold text-foreground mb-2">
                No messages yet
              </p>
              <p className="text-muted-foreground">
                Start a conversation by sending a prompt below
              </p>
            </div>
          )}

          {/* Scroll to bottom marker */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="sticky bottom-0 bg-card border-t border-border shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              type="text"
              placeholder="Describe Your CV Design..."
              className="flex-1 bg-secondary text-foreground placeholder:text-muted-foreground border-border focus-visible:ring-primary h-12 rounded-full px-6"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !inputValue.trim()}
              className="h-12 px-6 rounded-full font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span className="hidden sm:inline">Sending...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter or click Send to submit your prompt
          </p>
        </div>
      </div>
    </div>
  );
}