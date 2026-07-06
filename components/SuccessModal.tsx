"use client";
// ============================================================
// SuccessModal Component
// Celebration animation shown after successful upload
// ============================================================

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import confetti from "canvas-confetti";

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  uploadedCount: number;
  onClose: () => void;
}

export default function SuccessModal({
  isOpen,
  message,
  uploadedCount,
  onClose,
}: SuccessModalProps) {
  // Trigger confetti animation
  const fireConfetti = useCallback(() => {
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
    };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#E8A0BF", "#B76E79", "#C9A0DC", "#D4AF37", "#FFD700", "#FF69B4"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#E8A0BF", "#B76E79", "#C9A0DC", "#D4AF37", "#FFD700", "#FF69B4"],
      });
    }, 250);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fireConfetti();
    }
  }, [isOpen, fireConfetti]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="relative max-w-md w-full rounded-3xl p-8 shadow-2xl border border-rose-200/50 text-center pointer-events-auto"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,249,245,0.97) 0%, rgba(255,240,250,0.97) 100%)",
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-rose-300 hover:text-rose-500 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {/* Animated check */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                className="flex justify-center mb-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 0deg, #E8A0BF, #C9A0DC, #E8A0BF)",
                    }}
                  />
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center m-0.5"
                    style={{ background: "white" }}
                  >
                    <CheckCircle2 size={40} className="text-rose-500" />
                  </div>
                </div>
              </motion.div>

              {/* Emojis rain */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl mb-3 flex justify-center gap-2"
              >
                {["🎉", "🎀", "🌸", "💕", "✨"].map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.2,
                    }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl sm:text-2xl font-bold text-rose-700 mb-3 leading-tight"
              >
                ✅ Thank you for celebrating my 18th Birthday!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-rose-500/90 text-sm sm:text-base mb-4 italic"
              >
                "{message}"
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl p-3 mb-5 border border-rose-100"
                style={{ background: "rgba(232,160,191,0.1)" }}
              >
                <p className="text-rose-600 font-semibold text-sm">
                  🎊 {uploadedCount} {uploadedCount === 1 ? "file" : "files"} uploaded successfully!
                </p>
                <p className="text-rose-400 text-xs mt-1">
                  We can't wait to relive these wonderful memories through your photos and videos.
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full py-3 rounded-2xl font-semibold text-white shadow-lg transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, #E8A0BF 0%, #B76E79 50%, #C9A0DC 100%)",
                }}
              >
                Upload More Memories 💕
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
