"use client";
// ============================================================
// Main Page – Scan & Snap 18th Birthday Edition
// Clean, elegant structure (inspired by wedding upload app UI)
// ============================================================

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Images, Upload, CloudUpload, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import imageCompression from "browser-image-compression";
import confetti from "canvas-confetti";
import eventConfig from "@/config/event.config";
import { formatBytes, generateId, randomFrom } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────
interface PreviewFile {
  id: string;
  file: File;
  preview: string;
  type: "photo" | "video";
  error?: string;
}
type UploadStatus = "idle" | "uploading" | "success" | "error";

// ─── Fire confetti ─────────────────────────────────────────
function fireConfetti() {
  const end = Date.now() + 3000;
  const colors = ["#E8A0BF", "#B76E79", "#C9A0DC", "#D4AF37", "#ffffff"];
  (function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export default function HomePage() {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // ─── Process incoming files ──────────────────────────────
  const processFiles = (incoming: File[]) => {
    const remaining = eventConfig.maxFilesPerUpload - files.length;
    const toProcess = incoming.slice(0, remaining);
    const processed: PreviewFile[] = toProcess.map((file) => {
      const isPhoto =
        file.type.startsWith("image/") ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif");
      const isVideo =
        file.type.startsWith("video/") ||
        file.name.toLowerCase().endsWith(".mov");

      if (!isPhoto && !isVideo) {
        return { id: generateId(), file, preview: "", type: "photo" as const, error: "Unsupported file type" };
      }
      const maxMB = isPhoto ? eventConfig.maxPhotoSizeMB : eventConfig.maxVideoSizeMB;
      if (file.size > maxMB * 1024 * 1024) {
        return { id: generateId(), file, preview: "", type: isPhoto ? "photo" as const : "video" as const, error: `File exceeds ${maxMB}MB` };
      }
      return {
        id: generateId(),
        file,
        preview: URL.createObjectURL(file),
        type: isPhoto ? "photo" as const : "video" as const,
      };
    });
    setFiles((prev) => [...prev, ...processed]);
  };

  // ─── Drag & Drop ──────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f?.preview) URL.revokeObjectURL(f.preview);
      return prev.filter((x) => x.id !== id);
    });
  };

  // ─── Upload ───────────────────────────────────────────────
  const handleUpload = async () => {
    const valid = files.filter((f) => !f.error);
    if (!valid.length) return;

    setUploadStatus("uploading");
    setUploadProgress(10);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("guestName", "Guest");

      setUploadProgress(30);
      for (const pf of valid) {
        let fileToUpload = pf.file;
        if (pf.type === "photo") {
          try {
            fileToUpload = await imageCompression(pf.file, {
              maxSizeMB: eventConfig.maxPhotoSizeMB,
              useWebWorker: true,
              initialQuality: eventConfig.features.compressionQuality,
              preserveExif: true,
            });
          } catch { /* use original */ }
        }
        formData.append("files", fileToUpload, pf.file.name);
      }

      setUploadProgress(70);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadProgress(100);
      setUploadStatus("success");
      setSuccessMsg(randomFrom(eventConfig.thankYouMessages));
      fireConfetti();

      files.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview); });
      setFiles([]);
    } catch (err) {
      setUploadStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setUploadProgress(0);
    }
  };

  const resetState = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const validFiles = files.filter((f) => !f.error);

  return (
    <main
      className="min-h-screen flex flex-col items-center px-5 py-14"
      style={{ background: "linear-gradient(160deg, #3b0d2a 0%, #5c1a40 50%, #3b0d2a 100%)" }}
    >
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-8">

        {/* ── HEADER ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Brand */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-rose-300/40" />
            <span className="text-rose-300/70 text-xs font-semibold tracking-[0.2em] uppercase">Scan &amp; Snap</span>
            <div className="h-px w-8 bg-rose-300/40" />
          </div>

          {/* Birthday label */}
          <p className="text-rose-200/60 text-sm font-light tracking-widest uppercase mb-1">
            Happy 18th Birthday
          </p>
          <p className="text-rose-200/40 text-sm italic mb-1">of</p>

          {/* Debutante name */}
          <h1
            className="text-5xl font-bold italic mb-3"
            style={{
              fontFamily: "var(--font-playfair)",
              background: "linear-gradient(135deg, #f8d7e8 0%, #E8A0BF 50%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {eventConfig.debutanteName}
          </h1>

          {/* Date */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, #D4AF37)" }} />
            <span className="text-amber-300/80 text-sm font-light tracking-wider">
              {new Date(eventConfig.eventDate + "T00:00:00").toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
              })}
            </span>
            <div className="h-px w-10" style={{ background: "linear-gradient(90deg, #D4AF37, transparent)" }} />
          </div>

          {/* Welcome message */}
          <p className="text-rose-100/70 text-sm leading-relaxed font-light max-w-xs mx-auto">
            {eventConfig.welcomeMessage}
          </p>
        </motion.div>

        {/* ── UPLOAD CARD ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full rounded-3xl p-5"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <AnimatePresence mode="wait">
            {/* ── SUCCESS STATE ── */}
            {uploadStatus === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-8 text-center"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(232,160,191,0.2)" }}>
                  <CheckCircle2 size={36} className="text-rose-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg mb-1">Uploaded! 🎉</p>
                  <p className="text-rose-200/70 text-sm italic">"{successMsg}"</p>
                </div>
                <button
                  onClick={resetState}
                  className="mt-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #E8A0BF, #B76E79)" }}
                >
                  Upload More 💕
                </button>
              </motion.div>

            ) : (
              <motion.div key="upload-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* ── DROP ZONE ── */}
                <div
                  ref={dropRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => galleryInputRef.current?.click()}
                  className="rounded-2xl p-6 mb-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300"
                  style={{
                    background: isDragging ? "rgba(232,160,191,0.12)" : "rgba(255,255,255,0.05)",
                    border: `2px dashed ${isDragging ? "rgba(232,160,191,0.6)" : "rgba(255,255,255,0.15)"}`,
                    minHeight: "140px",
                  }}
                >
                  <motion.div animate={isDragging ? { scale: 1.2 } : { scale: 1 }}>
                    <CloudUpload size={36} className="text-rose-300/60" />
                  </motion.div>
                  <p className="text-white/80 text-sm font-medium">
                    {isDragging ? "Drop your photos here!" : "Drag and drop your photos here"}
                  </p>
                  <p className="text-white/30 text-xs">
                    Supports PNG, JPG, JPEG, HEIC, MP4, MOV · up to {eventConfig.maxPhotoSizeMB}MB
                  </p>
                </div>

                {/* Hidden file inputs */}
                <input ref={galleryInputRef} type="file" multiple accept="image/*,video/*" className="hidden"
                  onChange={(e) => { if (e.target.files) processFiles(Array.from(e.target.files)); e.target.value = ""; }} />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden"
                  onChange={(e) => { if (e.target.files) processFiles(Array.from(e.target.files)); e.target.value = ""; }} />

                {/* ── FILE PREVIEWS ── */}
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="grid grid-cols-4 gap-1.5 mb-2">
                        {files.map((pf) => (
                          <motion.div
                            key={pf.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative aspect-square rounded-xl overflow-hidden group"
                            style={{ background: pf.error ? "rgba(255,100,100,0.2)" : "rgba(255,255,255,0.08)" }}
                          >
                            {pf.preview && !pf.error && (
                              pf.type === "photo"
                                ? <img src={pf.preview} alt="" className="w-full h-full object-cover" />
                                : <video src={pf.preview} className="w-full h-full object-cover" muted playsInline />
                            )}
                            {pf.error && (
                              <div className="absolute inset-0 flex items-center justify-center p-1">
                                <AlertCircle size={14} className="text-red-400" />
                              </div>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); removeFile(pf.id); }}
                              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 items-center justify-center hidden group-hover:flex"
                            >
                              <X size={8} className="text-white" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-white/40 text-xs text-center">
                        {validFiles.length} file{validFiles.length !== 1 ? "s" : ""} ready · tap a photo to remove
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── TAKE PHOTO / GALLERY BUTTONS ── */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-medium text-sm transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <Camera size={18} />
                    Take Photo
                  </button>
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-medium text-sm transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <Images size={18} />
                    Gallery
                  </button>
                </div>

                {/* ── UPLOAD PROGRESS ── */}
                <AnimatePresence>
                  {uploadStatus === "uploading" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-4 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs text-white/50">
                        <span className="flex items-center gap-1.5">
                          <Loader2 size={12} className="animate-spin" /> Uploading to Google Drive...
                        </span>
                        <span className="text-rose-300 font-medium">{uploadProgress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "linear-gradient(90deg, #E8A0BF, #B76E79, #C9A0DC)" }}
                          initial={{ width: "0%" }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── ERROR MESSAGE ── */}
                <AnimatePresence>
                  {uploadStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-4 flex items-center gap-2 p-3 rounded-xl text-sm"
                      style={{ background: "rgba(255,100,100,0.15)", border: "1px solid rgba(255,100,100,0.2)" }}
                    >
                      <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                      <span className="text-red-300">{errorMsg}</span>
                      <button onClick={resetState} className="ml-auto text-red-400 hover:text-red-300 underline text-xs">Retry</button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── UPLOAD BUTTON ── */}
                <motion.button
                  onClick={handleUpload}
                  disabled={validFiles.length === 0 || uploadStatus === "uploading"}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl font-semibold text-white text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
                  style={{
                    background: validFiles.length > 0
                      ? "linear-gradient(135deg, #E8A0BF 0%, #B76E79 50%, #C9A0DC 100%)"
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  {uploadStatus === "uploading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" /> Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Upload size={18} />
                      {validFiles.length > 0 ? `Upload ${validFiles.length} Memory${validFiles.length !== 1 ? "ies" : "y"}` : "Upload Photos"}
                    </span>
                  )}
                </motion.button>

              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── HOW IT WORKS ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full rounded-3xl p-5"
          style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-center text-white/50 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            How it Works
          </p>
          <div className="flex justify-between items-start gap-2">
            {[
              { n: "1", label: "Snap or select\nphotos" },
              { n: "2", label: "Press Upload\nbutton" },
              { n: "3", label: "Saved to our\nalbum!" },
            ].map((step) => (
              <div key={step.n} className="flex-1 flex flex-col items-center gap-2 text-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: "rgba(232,160,191,0.25)", border: "1px solid rgba(232,160,191,0.3)" }}
                >
                  {step.n}
                </div>
                <p className="text-white/50 text-xs leading-snug whitespace-pre-line">{step.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── FOOTER ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-white/20 text-xs">
            Made with 💕 for {eventConfig.debutanteName}'s 18th Birthday
          </p>
        </motion.div>

      </div>
    </main>
  );
}
