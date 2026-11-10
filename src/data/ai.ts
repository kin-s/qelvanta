import type { SuggestedQuestion, InsightCard } from "@/types/ai";

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { id: "q1", text: "How much revenue did we generate this month?", icon: "trending" },
  { id: "q2", text: "Which products are selling fastest?", icon: "package" },
  { id: "q3", text: "Which products need restocking?", icon: "alert" },
  { id: "q4", text: "What are our largest expenses?", icon: "wallet" },
  { id: "q5", text: "Which customers have outstanding balances?", icon: "users" },
  { id: "q6", text: "Summarize this month's performance.", icon: "sparkles" },
];

export const INSIGHT_CARDS: InsightCard[] = [
  {
    id: "i1",
    title: "Revenue trending up",
    description: "Total revenue is up 12.4% vs. the previous 30-day period.",
    metric: "+12.4%",
    trend: "up",
    variant: "success",
  },
  {
    id: "i2",
    title: "7 products need restocking",
    description: "Wireless charger, Leather wallet, and 5 others are at or below reorder level.",
    metric: "7 items",
    trend: "neutral",
    variant: "warning",
  },
  {
    id: "i3",
    title: "Salaries dominate expenses",
    description: "Salaries account for 68% of total recorded expenses this month.",
    metric: "68%",
    trend: "neutral",
    variant: "info",
  },
  {
    id: "i4",
    title: "3 customers have balances",
    description: "Outstanding receivables total $1,640 across Acme and Globex.",
    metric: "$1,640",
    trend: "down",
    variant: "danger",
  },
];

/**
 * Note: This function is no longer used for the main chat interface. 
 * It is kept here as a fallback if the OpenAI API fails.
 */
export function getMockResponse(query: string): string {
  return `I'm currently unable to reach the AI service. Please try again in a moment.`;
}