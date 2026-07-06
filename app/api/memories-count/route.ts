// ============================================================
// API Route: /api/memories-count
// Returns the total number of uploaded files in the Drive folder
// ============================================================

import { NextResponse } from "next/server";
import { getFileCount } from "@/lib/google-drive";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || "";

    if (!folderId || folderId === "YOUR_FOLDER_ID") {
      return NextResponse.json({ count: 0 });
    }

    const count = await getFileCount(folderId);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Memory count error:", error);
    return NextResponse.json({ count: 0 });
  }
}
