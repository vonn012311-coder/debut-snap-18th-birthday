"use client";
// ============================================================
// CountdownTimer Component
// Shows time remaining until the event date
// ============================================================

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatCountdown, formatDateDisplay } from "@/lib/utils";

interface CountdownTimerProps {
  eventDate: string; // ISO date string: YYYY-MM-DD
  eventTime: string;
  venue: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative">
        {/* Glassmorphism card */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl backdrop-blur-md border border-rose-200/40 flex items-center justify-center shadow-lg"
          style={{ background: "rgba(255,255,255,0.25)" }}
        >
          <motion.span
            key={value}
            className="text-2xl sm:text-3xl font-bold text-rose-600"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </div>
        {/* Sparkle decoration */}
        <span className="absolute -top-1 -right-1 text-xs">✨</span>
      </div>
      <span className="mt-1 text-xs sm:text-sm font-medium text-rose-400/80 uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  );
}

export default function CountdownTimer({ eventDate, eventTime, venue }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isEventPast, setIsEventPast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const tick = () => {
      const now = new Date();
      const target = new Date(eventDate + "T00:00:00");
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setIsEventPast(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft(formatCountdown(diff));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  // Don't render until mounted (avoids hydration mismatch)
  if (!mounted) return null;

  // Hide if event has passed
  if (isEventPast) return null;

  if (!timeLeft) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full"
    >
      <div
        className="rounded-3xl p-6 sm:p-8 border border-rose-200/30 shadow-xl backdrop-blur-sm mx-auto max-w-md"
        style={{ background: "rgba(255,255,255,0.2)" }}
      >
        {/* Header */}
        <div className="text-center mb-5">
          <p className="text-rose-500 font-semibold text-sm uppercase tracking-widest mb-1">
            🎀 Counting Down To
          </p>
          <h3 className="text-rose-700 font-bold text-lg sm:text-xl">
            {formatDateDisplay(eventDate)}
          </h3>
          <p className="text-rose-400 text-sm mt-1">
            {eventTime} · {venue}
          </p>
        </div>

        {/* Countdown Units */}
        <div className="flex justify-center gap-3 sm:gap-4">
          <CountdownUnit value={timeLeft.days} label="Days" />
          <div className="flex items-center pb-6 text-rose-400 font-bold text-xl">:</div>
          <CountdownUnit value={timeLeft.hours} label="Hours" />
          <div className="flex items-center pb-6 text-rose-400 font-bold text-xl">:</div>
          <CountdownUnit value={timeLeft.minutes} label="Mins" />
          <div className="flex items-center pb-6 text-rose-400 font-bold text-xl">:</div>
          <CountdownUnit value={timeLeft.seconds} label="Secs" />
        </div>
      </div>
    </motion.div>
  );
}
