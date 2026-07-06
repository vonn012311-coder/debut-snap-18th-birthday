"use client";
// ============================================================
// UploadSection Component
// Full-featured drag & drop uploader with camera support,
// file preview, progress bar, and Drive integration
// ============================================================

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Upload, Camera, Video, X, Image as ImageIcon,
  Film, AlertCircle, CheckCircle2, Loader2
} from "lucide-react";
import imageCompression from "browser-image-compression";
import { formatBytes, generateId, isImage, isVideo, randomFrom } from "@/lib/utils";
import SuccessModal from "./SuccessModal";

interface PreviewFile {
  id: string;
  file: File;
  preview: string;
  type: "photo" | "video";
  error?: string;
}

interface UploadSectionProps {
  maxPhotoMB: number;
  maxVideoMB: number;
  maxFiles: number;
  enableCompression: boolean;
  compressionQuality: number;
  thankYouMessages: string[];
  onUploadComplete?: () => void;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function UploadSection({
  maxPhotoMB,
  maxVideoMB,
  maxFiles,
  enableCompression,
  compressionQuality,
  thankYouMessages,
  onUploadComplete,
}: UploadSectionProps) {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [guestName, setGuestName] = useState("");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const cameraRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  // Validate and add files
  const processFiles = useCallback(
    async (newFiles: File[]) => {
      const processed: PreviewFile[] = [];

      for (const file of newFiles) {
        if (files.length + processed.length >= maxFiles) break;

        // Determine type
        const fileIsImage =
          file.type.startsWith("image/") ||
          file.name.toLowerCase().endsWith(".heic") ||
          file.name.toLowerCase().endsWith(".heif");
        const fileIsVideo =
          file.type.startsWith("video/") ||
          file.name.toLowerCase().endsWith(".mov");

        if (!fileIsImage && !fileIsVideo) {
          processed.push({
            id: generateId(),
            file,
            preview: "",
            type: "photo",
            error: "Unsupported file type. Use JPG, PNG, HEIC, MP4, or MOV.",
          });
          continue;
        }

        const maxSize = fileIsImage ? maxPhotoMB : maxVideoMB;
        if (file.size > maxSize * 1024 * 1024) {
          processed.push({
            id: generateId(),
            file,
            preview: "",
            type: fileIsImage ? "photo" : "video",
            error: `File too large. Max ${maxSize}MB allowed.`,
          });
          continue;
        }

        // Generate preview URL
        const preview = URL.createObjectURL(file);
        processed.push({
          id: generateId(),
          file,
          preview,
          type: fileIsImage ? "photo" : "video",
        });
      }

      setFiles((prev) => [...prev, ...processed]);
    },
    [files.length, maxFiles, maxPhotoMB, maxVideoMB]
  );

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: processFiles,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/heic": [".heic"],
      "image/heif": [".heif"],
      "video/mp4": [".mp4"],
      "video/quicktime": [".mov", ".qt"],
    },
    maxFiles,
    disabled: uploadStatus === "uploading",
    noClick: false,
  });

  // Remove a file from the list
  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  // Handle upload
  const handleUpload = async () => {
    const validFiles = files.filter((f) => !f.error);
    if (validFiles.length === 0) return;

    setUploadStatus("uploading");
    setUploadProgress(0);
    setErrors([]);
    setUploadMessage("Preparing your memories...");

    try {
      const formData = new FormData();
      formData.append("guestName", guestName || "Anonymous Guest");

      // Compress images if enabled
      setUploadMessage("Optimizing files...");
      let progress = 10;
      setUploadProgress(progress);

      for (const pf of validFiles) {
        let fileToUpload = pf.file;

        if (enableCompression && pf.type === "photo") {
          try {
            fileToUpload = await imageCompression(pf.file, {
              maxSizeMB: maxPhotoMB,
              useWebWorker: true,
              initialQuality: compressionQuality,
              preserveExif: true,
            });
          } catch {
            // Fall back to original file if compression fails
            fileToUpload = pf.file;
          }
        }

        formData.append("files", fileToUpload, pf.file.name);
        progress += 30 / validFiles.length;
        setUploadProgress(Math.min(progress, 60));
      }

      setUploadMessage("Uploading to Drive...");
      setUploadProgress(65);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(90);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadProgress(100);
      setUploadStatus("success");
      setUploadedCount(data.uploaded || validFiles.length);

      if (data.errors?.length > 0) {
        setErrors(data.errors.map((e: { file: string; error: string }) => `${e.file}: ${e.error}`));
      }

      // Show success modal
      const msg = randomFrom(thankYouMessages);
      setSuccessMessage(msg);
      setShowSuccess(true);

      // Reset files list
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      setFiles([]);

      // Notify parent
      onUploadComplete?.();
    } catch (error) {
      setUploadStatus("error");
      setUploadMessage(
        error instanceof Error ? error.message : "Upload failed. Please try again."
      );
      setUploadProgress(0);
    }
  };

  const resetUpload = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    setUploadMessage("");
    setErrors([]);
  };

  const validFiles = files.filter((f) => !f.error);
  const errorFiles = files.filter((f) => f.error);

  return (
    <>
      <SuccessModal
        isOpen={showSuccess}
        message={successMessage}
        uploadedCount={uploadedCount}
        onClose={() => {
          setShowSuccess(false);
          resetUpload();
        }}
      />

      <div className="space-y-5">
        {/* Guest Name Input */}
        <div>
          <label
            htmlFor="guest-name"
            className="block text-sm font-medium text-rose-700 mb-1.5"
          >
            Your Name (Optional)
          </label>
          <input
            id="guest-name"
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="e.g. Maria Santos"
            maxLength={50}
            className="w-full rounded-xl px-4 py-3 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-rose-800 placeholder-rose-300 transition-all"
            style={{ background: "rgba(255,255,255,0.8)" }}
            disabled={uploadStatus === "uploading"}
          />
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-rose-400 scale-[1.02]"
              : "border-rose-200 hover:border-rose-400"
          } ${uploadStatus === "uploading" ? "opacity-50 pointer-events-none" : ""}`}
          style={{
            background: isDragActive
              ? "rgba(232,160,191,0.15)"
              : "rgba(255,255,255,0.4)",
          }}
        >
          <input {...getInputProps()} />

          {/* Sparkle decorations */}
          <span className="absolute top-3 right-4 text-rose-200 text-xl pointer-events-none">✨</span>
          <span className="absolute bottom-3 left-4 text-purple-200 text-lg pointer-events-none">🌸</span>

          <div className="space-y-3">
            <motion.div
              animate={isDragActive ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-5xl"
            >
              {isDragActive ? "💕" : "📸"}
            </motion.div>

            {isDragActive ? (
              <p className="text-rose-500 font-semibold text-lg">Drop your memories here!</p>
            ) : (
              <>
                <p className="text-rose-700 font-semibold text-lg">
                  Drag & drop your photos and videos
                </p>
                <p className="text-rose-400 text-sm">
                  or <span className="underline font-medium">click to browse</span> your files
                </p>
                <p className="text-rose-300 text-xs">
                  JPG · PNG · HEIC · MP4 · MOV · Up to {maxFiles} files
                </p>
              </>
            )}
          </div>
        </div>

        {/* Camera / Video capture buttons */}
        <div className="grid grid-cols-2 gap-3">
          <label className="cursor-pointer">
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) processFiles(Array.from(e.target.files));
              }}
              disabled={uploadStatus === "uploading"}
            />
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-rose-200 font-medium text-rose-600 text-sm cursor-pointer transition-all hover:bg-rose-50"
              style={{ background: "rgba(255,255,255,0.6)" }}
            >
              <Camera size={18} />
              Take Photo
            </motion.div>
          </label>

          <label className="cursor-pointer">
            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) processFiles(Array.from(e.target.files));
              }}
              disabled={uploadStatus === "uploading"}
            />
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-purple-200 font-medium text-purple-600 text-sm cursor-pointer transition-all hover:bg-purple-50"
              style={{ background: "rgba(255,255,255,0.6)" }}
            >
              <Video size={18} />
              Record Video
            </motion.div>
          </label>
        </div>

        {/* File Previews */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-rose-700">
                  Selected Files ({files.length}/{maxFiles})
                </p>
                <button
                  onClick={() => {
                    files.forEach((f) => {
                      if (f.preview) URL.revokeObjectURL(f.preview);
                    });
                    setFiles([]);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-600 underline"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {files.map((pf) => (
                  <motion.div
                    key={pf.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-rose-100 shadow-sm"
                    style={{
                      background: pf.error ? "rgba(255,200,200,0.3)" : "rgba(255,240,248,0.5)",
                    }}
                  >
                    {/* Preview */}
                    {pf.preview && !pf.error && (
                      <>
                        {pf.type === "photo" ? (
                          <img
                            src={pf.preview}
                            alt={pf.file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={pf.preview}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                        )}
                      </>
                    )}

                    {/* Error overlay */}
                    {pf.error && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-center">
                        <AlertCircle size={16} className="text-red-400 mb-1" />
                        <p className="text-red-400 text-[9px] leading-tight">{pf.error}</p>
                      </div>
                    )}

                    {/* Type indicator */}
                    {!pf.error && (
                      <div className="absolute bottom-1 left-1">
                        <span className="bg-black/50 rounded-md px-1 py-0.5">
                          {pf.type === "photo" ? (
                            <ImageIcon size={10} className="text-white" />
                          ) : (
                            <Film size={10} className="text-white" />
                          )}
                        </span>
                      </div>
                    )}

                    {/* Size */}
                    {!pf.error && (
                      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-black/50 rounded-md px-1 py-0.5 text-[9px] text-white">
                          {formatBytes(pf.file.size, 1)}
                        </span>
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={() => removeFile(pf.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                      aria-label="Remove file"
                    >
                      <X size={10} className="text-white" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="text-xs text-rose-400 flex gap-3 flex-wrap">
                {validFiles.length > 0 && (
                  <span>✅ {validFiles.length} valid file{validFiles.length !== 1 ? "s" : ""}</span>
                )}
                {errorFiles.length > 0 && (
                  <span className="text-red-400">
                    ❌ {errorFiles.length} file{errorFiles.length !== 1 ? "s" : ""} with errors
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Progress */}
        <AnimatePresence>
          {uploadStatus === "uploading" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-rose-600">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm font-medium">{uploadMessage}</span>
              </div>

              {/* Progress bar */}
              <div className="h-3 rounded-full overflow-hidden"
                style={{ background: "rgba(232,160,191,0.2)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #E8A0BF, #B76E79, #C9A0DC)",
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              <p className="text-right text-sm font-bold text-rose-500">
                {uploadProgress}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        <AnimatePresence>
          {uploadStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 rounded-2xl p-4 border border-red-200"
              style={{ background: "rgba(255,220,220,0.4)" }}
            >
              <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium text-sm">{uploadMessage}</p>
                {errors.map((err, i) => (
                  <p key={i} className="text-red-500 text-xs mt-1">{err}</p>
                ))}
                <button
                  onClick={resetUpload}
                  className="mt-2 text-xs text-red-600 underline hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Button */}
        <motion.button
          id="upload-btn"
          whileHover={{ scale: validFiles.length === 0 || uploadStatus === "uploading" ? 1 : 1.02 }}
          whileTap={{ scale: validFiles.length === 0 || uploadStatus === "uploading" ? 1 : 0.98 }}
          onClick={handleUpload}
          disabled={validFiles.length === 0 || uploadStatus === "uploading"}
          className="relative w-full py-4 rounded-2xl font-bold text-white text-lg shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          style={{
            background:
              validFiles.length === 0 || uploadStatus === "uploading"
                ? "linear-gradient(135deg, #d4a0b5, #9e6e79)"
                : "linear-gradient(135deg, #E8A0BF 0%, #B76E79 50%, #C9A0DC 100%)",
          }}
        >
          {/* Shimmer effect */}
          {validFiles.length > 0 && uploadStatus === "idle" && (
            <motion.div
              className="absolute inset-0 -translate-x-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              }}
              animate={{ translateX: ["−100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          )}

          <span className="relative flex items-center justify-center gap-2">
            {uploadStatus === "uploading" ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} />
                Upload {validFiles.length > 0 ? `${validFiles.length} ` : ""}
                {validFiles.length === 1 ? "Memory" : "Memories"}
                {validFiles.length > 0 && " 💕"}
              </>
            )}
          </span>
        </motion.button>

        {/* Fine print */}
        <p className="text-center text-xs text-rose-300">
          Photos max {maxPhotoMB}MB · Videos max {maxVideoMB}MB · Up to {maxFiles} files at once
        </p>
      </div>
    </>
  );
}
