"use client";
// ============================================================
// FloatingDecorations Component
// Renders animated balloons, flowers, sparkles, and confetti
// ============================================================

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingItem {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  emoji: string;
  opacity: number;
}

const EMOJIS = [
  "🎈", "🌸", "✨", "🎀", "💕", "🌹", "🎊", "🦋",
  "🌺", "💖", "⭐", "🌷", "🎉", "💫", "🌼", "💝",
];

export default function FloatingDecorations() {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    // Generate random floating elements
    const generated: FloatingItem[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      size: 16 + Math.random() * 24,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      opacity: 0.4 + Math.random() * 0.5,
    }));
    setItems(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="absolute select-none"
            style={{
              left: `${item.x}%`,
              bottom: "-10%",
              fontSize: `${item.size}px`,
              opacity: item.opacity,
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, (Math.random() - 0.5) * 200],
              rotate: [0, 360],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: Math.random() * 4,
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Sparkle glitter effect */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-rose-300"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 5,
            repeat: Infinity,
            repeatDelay: Math.random() * 4,
          }}
        />
      ))}

      {/* Soft gradient orbs */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(232,160,191,0.15) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,160,220,0.15) 0%, transparent 70%)",
        }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.8, 0.5, 0.8] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
