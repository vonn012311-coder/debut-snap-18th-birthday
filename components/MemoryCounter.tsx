"use client";
// ============================================================
// MemoryCounter Component
// Shows live count of uploaded photos/videos
// ============================================================

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MemoryCounterProps {
  refreshTrigger?: number; // Increment this to trigger a refresh
}

export default function MemoryCounter({ refreshTrigger = 0 }: MemoryCounterProps) {
  const [count, setCount] = useState<number | null>(null);
  const [prevCount, setPrevCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/memories-count", { cache: "no-store" });
      const data = await res.json();
      setPrevCount(count);
      setCount(data.count || 0);
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCount();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Refresh when a new upload happens
  useEffect(() => {
    if (refreshTrigger > 0) {
      setTimeout(fetchCount, 2000); // Small delay for Drive to process
    }
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-rose-300 text-sm">
        <motion.div
          className="w-2 h-2 rounded-full bg-rose-300"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        Loading memories...
      </div>
    );
  }

  if (count === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 rounded-full px-5 py-2.5 border border-rose-200/40 backdrop-blur-sm shadow-md"
      style={{ background: "rgba(255,255,255,0.25)" }}
    >
      {/* Pulsing heart icon */}
      <motion.span
        className="text-xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        💝
      </motion.span>

      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            className="block text-xl font-bold text-rose-600"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {count.toLocaleString()}
          </motion.span>
        </AnimatePresence>
        <span className="text-xs text-rose-400/80 font-medium tracking-wide">
          Memories Shared
        </span>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-green-400"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <span className="text-xs text-green-500 font-medium">LIVE</span>
      </div>
    </motion.div>
  );
}
