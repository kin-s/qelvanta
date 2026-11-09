export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  icon: string; // key into icon map
}

export interface InsightCard {
  id: string;
  title: string;
  description: string;
  metric: string;
  trend: "up" | "down" | "neutral";
  variant: "success" | "warning" | "danger" | "info" | "accent";
}