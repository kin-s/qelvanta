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
 * Simulated AI response engine.
 * This is NOT a real AI — it keyword-matches the user's question
 * and returns a canned response with realistic-looking business data.
 * Clearly labeled as demo behavior in the UI.
 */
export function getMockResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("summar") || q.includes("overview") || q.includes("performance") || q.includes("how are we")) {
    return `Here's a summary of the last 30 days:

**Revenue:** $128,450 — up 12.4% vs. the previous period
**Expenses:** $48,220 — mostly salaries (68%) and rent
**Gross profit:** $80,230 (62.5% margin)
**Net profit estimate:** $57,770

**Highlights:**
- 7 products are at or below reorder level — restocking recommended
- 3 customers have outstanding balances totaling $1,640
- Wireless keyboards and Bluetooth speakers are your top sellers

Would you like me to break down any of these?`;
  }

  if (q.includes("revenue") || q.includes("sales") || q.includes("earn") || q.includes("income")) {
    return `You generated **$128,450** in revenue this month, which is **+12.4%** compared to the previous month.

**Top revenue contributors:**
- Electronics: $45,000 (35%)
- Accessories: $28,000 (22%)
- Audio: $18,000 (14%)

The strongest single day was **Nov 2** with $6,840 in revenue. Weekend sales are consistently 40% lower than weekdays, which matches your historical pattern.`;
  }

  if ((q.includes("product") && (q.includes("fast") || q.includes("top") || q.includes("sell"))) || q.includes("best seller") || q.includes("top selling")) {
    return `Your top-selling products this period:

1. **Wireless keyboard** — $128,400 in revenue, 84 units left
2. **Bluetooth speaker** — $98,200 in revenue, 42 units left
3. **USB-C cable 2m** — $76,150 in revenue, 210 units left
4. **Mechanical mouse** — $68,400 in revenue, 36 units left
5. **Webcam HD** — $54,120 in revenue, 12 units left (low stock)

**Insight:** Webcam HD is in your top 5 but has only 12 units left — consider restocking before it runs out.`;
  }

  if (q.includes("restock") || q.includes("low stock") || q.includes("out of stock") || q.includes("reorder")) {
    return `**7 products need attention:**

**Out of stock (1):**
- Leather wallet — 0 units, reorder level 10

**Low stock (6):**
- Tablet 10in — 2 units (reorder: 5)
- Wireless charger — 3 units (reorder: 15)
- Standing desk — 4 units (reorder: 3)
- Ergonomic chair — 5 units (reorder: 3)
- Stainless cookware set — 6 units (reorder: 3)
- 4K monitor 27in — 7 units (reorder: 4)

**Suggested action:** Leather wallet and Wireless charger are the most urgent. You can create purchase orders from the Purchases module.`;
  }

  if (q.includes("expense") || q.includes("spend") || q.includes("cost") || q.includes("largest")) {
    return `Total expenses this period: **$48,220**.

**Top expense categories:**
1. **Salaries** — $32,850 (68%) — 5 employees
2. **Rent** — $5,000 (10%) — office lease
3. **Marketing** — $3,200 (7%) — Google Ads
4. **Utilities** — $2,100 (4%)
5. **Other** — $5,070 (11%)

**Insight:** Salaries dominate your expense profile. This is normal for a service-heavy business, but if you scale the team, watch the ratio carefully — the rule of thumb is 40–60% of revenue.`;
  }

  if (q.includes("customer") || q.includes("balance") || q.includes("outstanding") || q.includes("receivable")) {
    return `**3 customers have outstanding balances totaling $1,640:**

- **Acme Ltd** — $4,250 (current, due Nov 15)
- **Globex Inc** — $1,390 (overdue, was due Oct 30)
- **Initech** — $0 (paid in full)

**Insight:** Globex Inc is now 6 days overdue. This is the second time they've been late this quarter — you may want to follow up or adjust their payment terms.

**Recommended action:** Send a reminder via the Invoices module.`;
  }

  if (q.includes("profit") || q.includes("margin")) {
    return `**Profitability summary:**

- **Gross profit:** $80,230 (62.5% margin)
- **Operating expenses:** $22,460
- **Net profit (estimate):** $57,770 (45% margin)

**Trend:** Net profit is up 18.7% vs. the previous period, driven by the 12.4% revenue increase and relatively flat expenses.

**Warning:** These figures are calculated from your recorded transactions and do not include tax, depreciation, or accrued liabilities. Treat them as management estimates.`;
  }

  if (q.includes("branch") || q.includes("location") || q.includes("store") || q.includes("best performing")) {
    return `**Branch performance this period:**

1. **Main HQ** — $82,400 revenue (64% of total)
2. **Store Front** — $31,200 revenue (24%)
3. **Westlands Branch** — $14,850 revenue (12%)

**Insight:** Main HQ dominates, but Store Front has the highest average order value ($62 vs. $48 at Main HQ). Westlands is underperforming relative to its inventory investment — consider a local promotion or audit of slow-moving stock.`;
  }

  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q === "help") {
    return `Hello! I am the QELVANTA Assistant. I can help you understand your business data. Try asking:

- "How much revenue did we generate this month?"
- "Which products need restocking?"
- "What are our largest expenses?"
- "Which customers have outstanding balances?"
- "Summarize this month's performance."

Or click a suggested question on the left.`;
  }

  return `I'm a demonstration assistant for QELVANTA — I can answer questions about:

- **Revenue & sales** — totals, trends, top products
- **Inventory** — stock levels, low stock, restock needs
- **Expenses** — categories, trends
- **Customers** — balances, receivables
- **Profitability** — margins, net profit
- **Branch performance** — comparisons

Try one of the suggested questions on the left, or ask me anything about these topics.

*(This is a demo — no real AI service is connected. Responses are generated from fixed mock data.)*`;
}