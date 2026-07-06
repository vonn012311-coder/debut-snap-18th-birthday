// ============================================================
// API Route: /api/gallery
// Returns gallery images from the Drive folder (if enabled)
// ============================================================

import { NextResponse } from "next/server";
import { listGalleryFiles } from "@/lib/google-drive";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || "";

    if (!folderId) {
      return NextResponse.json({ files: [] });
    }

    const files = await listGalleryFiles(folderId, 50);
    return NextResponse.json({ files });
  } catch (error) {
    console.error("Gallery error:", error);
    return NextResponse.json({ files: [] });
  }
}
