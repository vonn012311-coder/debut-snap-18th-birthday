// ============================================================
// Utility Functions
// ============================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function isImage(file: File): boolean {
  return (
    file.type.startsWith("image/") ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  );
}

export function isVideo(file: File): boolean {
  return file.type.startsWith("video/");
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function validateFileType(file: File): { valid: boolean; type: "photo" | "video" | null } {
  const photoTypes = ["image/jpeg", "image/png", "image/heic", "image/heif", "image/webp"];
  const videoTypes = ["video/mp4", "video/quicktime", "video/webm", "video/mov"];

  if (
    photoTypes.includes(file.type) ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  ) {
    return { valid: true, type: "photo" };
  }
  if (videoTypes.includes(file.type) || file.name.toLowerCase().endsWith(".mov")) {
    return { valid: true, type: "video" };
  }
  return { valid: false, type: null };
}

export function validateFileSize(
  file: File,
  maxPhotoMB: number,
  maxVideoMB: number
): boolean {
  const { type } = validateFileType(file);
  if (type === "photo") return file.size <= maxPhotoMB * 1024 * 1024;
  if (type === "video") return file.size <= maxVideoMB * 1024 * 1024;
  return false;
}

export function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
