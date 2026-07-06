"use client";
// ============================================================
// Main Landing Page – Scan & Snap 18th Birthday Edition
// ============================================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Heart } from "lucide-react";
import eventConfig from "@/config/event.config";
import FloatingDecorations from "@/components/FloatingDecorations";
import CountdownTimer from "@/components/CountdownTimer";
import MemoryCounter from "@/components/MemoryCounter";
import UploadSection from "@/components/UploadSection";
import BackgroundMusic from "@/components/BackgroundMusic";
import ThemeToggle from "@/components/ThemeToggle";
import { formatDateDisplay } from "@/lib/utils";

// ─── Section fade-in animation variant ───────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HomePage() {
  const [uploadRefreshTrigger, setUploadRefreshTrigger] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleUploadComplete = () => {
    setUploadRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, #E8A0BF, transparent)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, #C9A0DC, transparent)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #D4AF37, transparent)" }}
        />
      </div>

      {/* Floating birthday decorations */}
      <FloatingDecorations />

      {/* Dark mode toggle */}
      {eventConfig.features.enableDarkMode && <ThemeToggle />}

      {/* Background music */}
      {eventConfig.features.enableMusic && mounted && (
        <BackgroundMusic
          musicUrl={eventConfig.backgroundMusicUrl}
          label={eventConfig.backgroundMusicLabel}
        />
      )}

      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl mx-auto text-center">

          {/* Decorative top sparkles */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl mb-4 flex justify-center gap-3"
          >
            <span className="twinkle">✨</span>
            <span className="float" style={{ animationDelay: "0.5s" }}>🌸</span>
            <span className="twinkle" style={{ animationDelay: "1s" }}>✨</span>
          </motion.div>

          {/* Title badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6 text-sm font-semibold tracking-wide"
            style={{
              background: "linear-gradient(135deg, rgba(232,160,191,0.3), rgba(201,160,220,0.3))",
              border: "1px solid rgba(232,160,191,0.4)",
              color: "#B76E79",
            }}
          >
            <span>🎀</span>
            <span>Scan & Snap — Birthday Edition</span>
            <span>🎀</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            <span className="gradient-text">
              {eventConfig.birthdayTitle},
            </span>
          </motion.h1>

          {/* Debutante name with gold glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="relative inline-block"
          >
            <h2
              className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold gradient-gold mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {eventConfig.debutanteName}!
            </h2>
            {/* Decorative underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-1 rounded-full mb-5"
              style={{
                background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
              }}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg sm:text-xl text-rose-400/80 italic mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {eventConfig.tagline}
          </motion.p>

          {/* Event details chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-6"
          >
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
              style={{
                background: "rgba(232,160,191,0.15)",
                border: "1px solid rgba(232,160,191,0.3)",
                color: "#B76E79",
              }}
            >
              <Calendar size={14} />
              {formatDateDisplay(eventConfig.eventDate)} · {eventConfig.eventTime}
            </div>
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
              style={{
                background: "rgba(201,160,220,0.15)",
                border: "1px solid rgba(201,160,220,0.3)",
                color: "#9570B0",
              }}
            >
              <MapPin size={14} />
              {eventConfig.venue}
            </div>
          </motion.div>

          {/* Welcome message card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="glass-card p-6 mb-8 text-left relative overflow-hidden"
          >
            {/* Quote mark */}
            <span
              className="absolute -top-2 -left-1 text-7xl font-heading opacity-10 leading-none"
              style={{ color: "#E8A0BF" }}
            >
              "
            </span>
            <div className="flex items-start gap-3">
              <Heart size={18} className="text-rose-400 mt-1 flex-shrink-0" style={{ fill: "currentColor" }} />
              <p className="text-sm sm:text-base leading-relaxed italic"
                style={{ color: "var(--text-muted)" }}
              >
                {eventConfig.welcomeMessage}
              </p>
            </div>
          </motion.div>

          {/* Live Memory Counter */}
          {eventConfig.features.showMemoryCounter && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex justify-center mb-8"
            >
              <MemoryCounter refreshTrigger={uploadRefreshTrigger} />
            </motion.div>
          )}

          {/* Countdown Timer */}
          {eventConfig.features.showCountdown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mb-8"
            >
              <CountdownTimer
                eventDate={eventConfig.eventDate}
                eventTime={eventConfig.eventTime}
                venue={eventConfig.venue}
              />
            </motion.div>
          )}

          {/* ────────────────────────────────────────────────
              UPLOAD CARD
          ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            id="upload-section"
            className="glass-card p-6 sm:p-8 relative overflow-hidden"
          >
            {/* Card decorations */}
            <div className="absolute top-3 right-4 text-2xl pointer-events-none opacity-40">🎊</div>
            <div className="absolute bottom-3 left-4 text-2xl pointer-events-none opacity-40">🌸</div>

            {/* Upload card header */}
            <div className="text-center mb-6">
              <motion.div
                className="text-4xl mb-2"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                📸
              </motion.div>
              <h3
                className="font-heading text-2xl sm:text-3xl font-bold gradient-text mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Share Your Memories
              </h3>
              <p className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Upload your photos and videos from the celebration
              </p>

              {/* Divider */}
              <div className="divider mt-4" />
            </div>

            {/* Upload Section */}
            <UploadSection
              maxPhotoMB={eventConfig.maxPhotoSizeMB}
              maxVideoMB={eventConfig.maxVideoSizeMB}
              maxFiles={eventConfig.maxFilesPerUpload}
              enableCompression={eventConfig.features.enableCompression}
              compressionQuality={eventConfig.features.compressionQuality}
              thankYouMessages={eventConfig.thankYouMessages}
              onUploadComplete={handleUploadComplete}
            />
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mt-10 text-center"
          >
            <p className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Made with 💕 for {eventConfig.debutanteName}'s 18th Birthday
            </p>
            <p className="text-xs mt-1 opacity-60"
              style={{ color: "var(--text-muted)" }}
            >
              Powered by Scan & Snap · All photos saved to Google Drive
            </p>
            <div className="mt-4 flex justify-center gap-4 text-xs">
              <a href="/qr-code"
                className="text-rose-400 hover:text-rose-600 underline underline-offset-2 transition-colors"
              >
                📱 QR Code Page
              </a>
            </div>
          </motion.footer>
        </div>
      </section>
    </main>
  );
}
