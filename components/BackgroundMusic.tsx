"use client";
// ============================================================
// BackgroundMusic Component
// Audio player with play/pause control
// ============================================================

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";

interface BackgroundMusicProps {
  musicUrl: string;
  label?: string;
}

export default function BackgroundMusic({ musicUrl, label = "🎵 Birthday Music" }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the control after a delay
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    setHasInteracted(true);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked – user must interact
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="none"
        className="hidden"
        onEnded={() => setIsPlaying(false)}
      />

      {/* Music control pill */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.div
              className="flex items-center gap-2 rounded-full px-4 py-2.5 shadow-xl border border-rose-200/40 backdrop-blur-md cursor-pointer"
              style={{ background: "rgba(255,255,255,0.85)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated music note icon */}
              <motion.div
                animate={isPlaying ? { rotate: [0, 15, -15, 0] } : {}}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <Music
                  size={16}
                  className={isPlaying ? "text-rose-500" : "text-gray-400"}
                />
              </motion.div>

              {/* Sound bars animation when playing */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-end gap-0.5 h-4 overflow-hidden"
                  >
                    {[0.6, 1, 0.7, 0.9, 0.5].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-1 rounded-full bg-rose-400"
                        animate={{ scaleY: [h, 1, h * 0.5, 1, h] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          delay: i * 0.1,
                        }}
                        style={{ height: "100%", transformOrigin: "bottom" }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <span className="text-xs font-medium text-rose-600 hidden sm:block">
                {isPlaying ? "Now Playing" : label}
              </span>

              {/* Play/Pause button */}
              <button
                onClick={togglePlay}
                className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center hover:bg-rose-600 transition-colors"
                aria-label={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? (
                  <Pause size={12} className="text-white" />
                ) : (
                  <Play size={12} className="text-white ml-0.5" />
                )}
              </button>

              {/* Mute button */}
              {hasInteracted && (
                <button
                  onClick={toggleMute}
                  className="text-rose-400 hover:text-rose-600 transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
