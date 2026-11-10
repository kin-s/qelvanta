"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SEED_RECEIVABLES, SEED_PAYABLES } from "@/data/finance";
import type { Expense, Income } from "@/types/finance";
import { FinanceOverview } from "./finance-overview";
import { ExpenseTable } from "./expense-table";
import { ExpenseForm } from "./expense-form";
import { IncomeTable } from "./income-table";
import { IncomeForm } from "./income-form";
import { ProfitLoss } from "./profit-loss";
import { ReceivablesPayables } from "./receivables-payables";
import { createExpense, createIncome } from "@/actions/finance";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Tab = "overview" | "expenses" | "income" | "pl" | "ar_ap";

export function FinanceClient({ initialExpenses, initialIncome }: { initialExpenses: Expense[]; initialIncome: Income[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [income, setIncome] = useState<Income[]>(initialIncome);
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("overview");
  const [expenseFormOpen, setExpenseFormOpen] = useState(false);
  const [incomeFormOpen, setIncomeFormOpen] = useState(false);

  async function handleAddExpense(e: Expense) {
    const res = await createExpense(e);
    if (res.error) return toast.error("Failed to save expense");
    setExpenses([e, ...expenses]);
    toast.success("Expense recorded to database");
    router.refresh();
  }

  async function handleAddIncome(i: Income) {
    const res = await createIncome(i);
    if (res.error) return toast.error("Failed to save income");
    setIncome([i, ...income]);
    toast.success("Income recorded to database");
    router.refresh();
  }

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "expenses" as const, label: "Expenses", count: expenses.length },
    { id: "income" as const, label: "Income", count: income.length },
    { id: "pl" as const, label: "Profit & Loss" },
    { id: "ar_ap" as const, label: "Receivables / Payables" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Finance</h1>
          <p className="mt-1 text-sm text-muted">
            Expenses, income, cash flow, and management reports.{" "}
            <span className="text-xs text-success">Connected to PostgreSQL.</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIncomeFormOpen(true)}>
            <Plus /> Add income
          </Button>
          <Button onClick={() => setExpenseFormOpen(true)}>
            <Plus /> Add expense
          </Button>
        </div>
      </div>

      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.id ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="ml-1.5 rounded-full bg-surface px-1.5 py-0.5 text-[10px] text-muted">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && <FinanceOverview expenses={expenses} income={income} />}
      {tab === "expenses" && <ExpenseTable expenses={expenses} onDelete={() => toast.error("Deletion coming soon")} />}
      {tab === "income" && <IncomeTable income={income} onDelete={() => toast.error("Deletion coming soon")} />}
      {tab === "pl" && <ProfitLoss expenses={expenses} income={income} />}
      {tab === "ar_ap" && <ReceivablesPayables receivables={SEED_RECEIVABLES} payables={SEED_PAYABLES} />}

      <ExpenseForm open={expenseFormOpen} onOpenChange={setExpenseFormOpen} onSubmit={handleAddExpense} />
      <IncomeForm open={incomeFormOpen} onOpenChange={setIncomeFormOpen} onSubmit={handleAddIncome} />
    </div>
  );
}