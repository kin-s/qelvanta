"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel — desktop only */}
      <aside className="relative hidden overflow-hidden bg-[#191919] p-12 text-[#F5F0E7] lg:flex lg:flex-col lg:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_30%,rgba(198,166,107,0.18),transparent_70%)]" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 w-fit"
        >
          <Link href="/">
            <Logo size="md" />
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-md"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C6A66B]">
            QELVANTA
          </p>
          <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight">
            Work smarter.
            <br />
            Grow faster.
          </h2>
          <p className="mt-4 text-sm text-[#A6A29A]">
            One operating system for inventory, sales, finance, people, and
            business performance.
          </p>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10 text-xs text-[#A6A29A]"
        >
          © QELVANTA · Frontend demonstration · Backend integration coming
        </motion.p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col bg-background">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <Link href="/" className="text-xs text-muted hover:text-foreground">
            ← Back home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-sm"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}