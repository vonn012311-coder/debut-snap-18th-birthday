"use client";
// ============================================================
// ThemeToggle Component
// Dark / Light mode toggle button
// ============================================================

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.button
      id="theme-toggle"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center border shadow-lg backdrop-blur-sm transition-colors"
      style={{
        background: isDark ? "rgba(40,20,40,0.8)" : "rgba(255,255,255,0.8)",
        borderColor: isDark ? "rgba(201,160,220,0.4)" : "rgba(232,160,191,0.4)",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {isDark ? (
          <Moon size={18} className="text-purple-300" />
        ) : (
          <Sun size={18} className="text-rose-500" />
        )}
      </motion.div>
    </motion.button>
  );
}
