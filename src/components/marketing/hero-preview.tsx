"use client";

import { motion } from "framer-motion";
import { TrendingUp, Package, Wallet, Users } from "lucide-react";

export function HeroPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-8 rounded-3xl bg-accent/10 blur-3xl"
      />
      
      {/* Floating Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        >
          <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
            <div className="ml-3 rounded-sm bg-background/60 px-2 py-0.5 text-[10px] text-muted">
              qelvanta.app/dashboard
            </div>
          </div>

          <div className="grid grid-cols-[64px_1fr]">
            <div className="border-r border-border bg-surface/40 py-4">
              <div className="mx-auto mb-4 h-6 w-6 rounded-md bg-accent/30" />
              {[TrendingUp, Package, Wallet, Users].map((Icon, i) => (
                <div
                  key={i}
                  className={`mx-auto my-2 flex h-7 w-7 items-center justify-center rounded ${
                    i === 0 ? "bg-accent/20 text-accent" : "text-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-3 gap-2">
                <MiniKpi label="Revenue" value="$128.4k" delta="+12.4%" positive />
                <MiniKpi label="Expenses" value="$48.2k" delta="+4.1%" />
                <MiniKpi label="Net profit" value="$80.2k" delta="+18.7%" positive />
              </div>

              <div className="mt-4 rounded-md border border-border bg-surface/60 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted">
                    Revenue trend
                  </span>
                  <span className="text-[10px] text-success">▲ 12.4%</span>
                </div>
                <div className="flex h-16 items-end gap-1">
                  {[32, 44, 28, 58, 46, 62, 40, 72, 54, 68, 58, 80].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                      className="flex-1 rounded-sm bg-accent/60"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                {[
                  { id: "INV-1042", customer: "Acme Ltd", amount: "$4,250", status: "Paid" },
                  { id: "INV-1043", customer: "Globex", amount: "$1,890", status: "Pending" },
                ].map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-md border border-border bg-surface/40 px-2.5 py-1.5 text-[10px]"
                  >
                    <span className="text-muted">{r.id}</span>
                    <span className="text-foreground">{r.customer}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 ${
                        r.status === "Paid"
                          ? "bg-success/15 text-success"
                          : "bg-warning/15 text-warning"
                      }`}
                    >
                      {r.status}
                    </span>
                    <span className="tabular font-medium text-foreground">{r.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function MiniKpi({
  label,
  value,
  delta,
  positive,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-surface/60 p-2.5">
      <div className="text-[9px] uppercase tracking-wider text-muted">{label}</div>
      <div className="tabular mt-0.5 text-sm font-semibold text-foreground">{value}</div>
      <div className={`text-[9px] ${positive ? "text-success" : "text-warning"}`}>
        {delta}
      </div>
    </div>
  );
}