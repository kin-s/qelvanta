"use client";

import { motion } from "framer-motion";
import { LogoIcon } from "./logo";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute h-24 w-24 rounded-full border-t-2 border-r-2 border-accent"
        />
        
        {/* Inner counter-rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute h-16 w-16 rounded-full border-b-2 border-l-2 border-accent/40"
        />

        {/* Pulsing Logo */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="z-10"
        >
          <LogoIcon size={36} />
        </motion.div>
      </div>

      {/* Fading Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 flex flex-col items-center"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
          BIZFLOW
        </p>
        <p className="mt-2 text-xs text-muted">
          Preparing your workspace...
        </p>
      </motion.div>
    </div>
  );
}