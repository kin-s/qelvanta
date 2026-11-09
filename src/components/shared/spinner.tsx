"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Spinner({ className, size = "default" }: { className?: string; size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-10 w-10",
  };

  return (
    <div className={cn("flex items-center justify-center", sizeClasses[size], className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-full w-full text-accent"
      >
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          initial={{ pathLength: 0, rotate: 0 }}
          animate={{ pathLength: 1, rotate: 360 }}
          transition={{
            pathLength: { duration: 1.5, ease: "easeInOut", repeat: Infinity },
            rotate: { duration: 2, ease: "linear", repeat: Infinity },
          }}
          style={{ originX: "50%", originY: "50%" }}
        />
      </svg>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-muted animate-pulse">Loading data...</p>
    </div>
  );
}