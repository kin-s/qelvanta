"use client";

import { useRef, useState } from "react";
import { Send, Trash2, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChatMessageBubble, TypingIndicator } from "./chat-message";
import { SuggestedQuestions } from "./suggested-questions";
import { InsightSection } from "./insight-cards";
import { SUGGESTED_QUESTIONS, INSIGHT_CARDS, getMockResponse } from "@/data/ai";
import type { ChatMessage } from "@/types/ai";

function makeId(): string {
  return `msg_${crypto.randomUUID().slice(0, 8)}`;
}

export function AiClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 30);
  }

  function sendQuery(text: string) {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    const userMsg: ChatMessage = {
      id: makeId(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    scrollToBottom();

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: makeId(),
        role: "assistant",
        content: getMockResponse(trimmed),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setThinking(false);
      scrollToBottom();
    }, 1200);
  }

  function handleSend() {
    sendQuery(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function clearConversation() {
    setMessages([]);
    setInput("");
    setThinking(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          AI Business Assistant
        </h1>
        <p className="mt-1 text-sm text-muted">
          Ask questions about your business in plain language.{" "}
          <span className="text-xs">Demo — powered by a keyword-matched mock, not real AI.</span>
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Chat column */}
        <div className="flex h-[calc(100vh-14rem)] min-h-[500px] flex-col overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">QELVANTA Assistant</p>
                <p className="text-[10px] text-muted">
                  {thinking ? "Thinking…" : "Ready"}
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearConversation}>
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 scroll-smooth"
            aria-live="polite"
          >
            {messages.length === 0 && !thinking && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="mt-3 font-heading text-base font-semibold">
                  How can I help?
                </p>
                <p className="mt-1 max-w-sm text-xs text-muted">
                  Ask me about revenue, top products, low stock, expenses, or
                  customer balances. Try a suggested question from the sidebar.
                </p>
              </div>
            )}

            {messages.length > 0 && (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <ChatMessageBubble key={msg.id} message={msg} />
                ))}
                {thinking && <TypingIndicator />}
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your business…"
                rows={2}
                className="resize-none pr-12"
                aria-label="Message input"
              />
              <Button
                size="icon"
                className="absolute bottom-2 right-2 h-8 w-8"
                onClick={handleSend}
                disabled={!input.trim() || thinking}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-muted">
              <kbd className="rounded border border-border bg-background px-1">Enter</kbd> to send ·{" "}
              <kbd className="rounded border border-border bg-background px-1">Shift</kbd>+<kbd className="rounded border border-border bg-background px-1">Enter</kbd> for new line
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-heading text-sm font-semibold">Try asking</h2>
              <Badge variant="muted" className="text-[10px]">Suggested</Badge>
            </div>
            <SuggestedQuestions
              questions={SUGGESTED_QUESTIONS}
              onSelect={sendQuery}
              disabled={thinking}
            />
          </section>

          <InsightSection cards={INSIGHT_CARDS} onAskAbout={sendQuery} />

          <div className="rounded-md border border-dashed border-border bg-surface/40 p-3">
            <p className="text-[10px] leading-relaxed text-muted">
              <strong className="text-warning">Demo limitation:</strong> This assistant
              uses keyword matching and fixed mock data. Real AI integration
              (with authorization-aware business data) arrives with the backend
              phase.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}