// ============================================================
// API Route: /api/upload
// Handles multipart file uploads → Google Drive
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { uploadFileToDrive } from "@/lib/google-drive";
import eventConfig from "@/config/event.config";

// Route segment config — increase body size limit for large uploads
export const maxDuration = 60; // 60 second timeout for large files

// Rate limiting store (in-memory, resets on cold start)
const uploadCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // max uploads per hour per IP
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function getRateLimitKey(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = uploadCounts.get(key);

  if (!record || now > record.resetAt) {
    uploadCounts.set(key, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) return false;

  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit check
    const clientKey = getRateLimitKey(req);
    if (!checkRateLimit(clientKey)) {
      return NextResponse.json(
        { error: "Too many uploads. Please try again in an hour." },
        { status: 429 }
      );
    }

    // Parse the multipart form data
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const guestName = (formData.get("guestName") as string) || "Anonymous Guest";

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Validate file count
    if (files.length > eventConfig.maxFilesPerUpload) {
      return NextResponse.json(
        { error: `Maximum ${eventConfig.maxFilesPerUpload} files per upload` },
        { status: 400 }
      );
    }

    const folderId =
      process.env.GOOGLE_DRIVE_FOLDER_ID || eventConfig.googleDriveFolderId || "";

    if (!folderId || folderId === "YOUR_FOLDER_ID") {
      return NextResponse.json(
        { error: "Google Drive folder not configured" },
        { status: 500 }
      );
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        // Validate file type
        const photoTypes = [
          "image/jpeg", "image/png", "image/heic", "image/heif", "image/webp",
        ];
        const videoTypes = [
          "video/mp4", "video/quicktime", "video/webm",
        ];

        const isPhoto =
          photoTypes.includes(file.type) ||
          file.name.toLowerCase().endsWith(".heic") ||
          file.name.toLowerCase().endsWith(".heif");
        const isVideo = videoTypes.includes(file.type) ||
          file.name.toLowerCase().endsWith(".mov");

        if (!isPhoto && !isVideo) {
          errors.push({ file: file.name, error: "Unsupported file type" });
          continue;
        }

        // Validate file size
        const maxSize = isPhoto
          ? eventConfig.maxPhotoSizeMB * 1024 * 1024
          : eventConfig.maxVideoSizeMB * 1024 * 1024;

        if (file.size > maxSize) {
          const limit = isPhoto
            ? `${eventConfig.maxPhotoSizeMB}MB`
            : `${eventConfig.maxVideoSizeMB}MB`;
          errors.push({ file: file.name, error: `File exceeds ${limit} limit` });
          continue;
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Generate timestamped filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const fileName = `${timestamp}_${guestName.replace(/\s+/g, "_")}_${safeName}`;

        // Upload to Google Drive
        const result = await uploadFileToDrive({
          fileName,
          mimeType: file.type || "application/octet-stream",
          fileBuffer: buffer,
          folderId,
        });

        results.push({
          file: file.name,
          driveId: result.id,
          webViewLink: result.webViewLink,
        });
      } catch (fileError) {
        const msg = fileError instanceof Error ? fileError.message : String(fileError);
        console.error(`Error uploading ${file.name}:`, msg);
        errors.push({
          file: file.name,
          error: msg, // show real error for debugging
        });
      }
    }

    if (results.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { error: "All files failed to upload", details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      uploaded: results.length,
      errors: errors.length > 0 ? errors : undefined,
      message:
        results.length === files.length
          ? "All files uploaded successfully!"
          : `${results.length} of ${files.length} files uploaded`,
    });
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
