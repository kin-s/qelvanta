import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/ai";

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-accent text-[#111111]" : "bg-surface text-accent"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div
        className={cn(
          "min-w-0 max-w-[85%] rounded-lg px-4 py-3 text-sm",
          isUser
            ? "bg-accent text-[#111111]"
            : "bg-card border border-border text-foreground"
        )}
      >
        {message.content.split("\n").map((line, i) => {
          if (line.trim() === "") return <div key={i} className="h-2" />;
          // Handle **bold** markdown-lite
          const parts = line.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={i} className={cn(i > 0 && "mt-1")}>
              {parts.map((part, j) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <strong key={j} className="font-semibold">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return <span key={j}>{part}</span>;
              })}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-accent">
        <Bot className="h-4 w-4" />
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}