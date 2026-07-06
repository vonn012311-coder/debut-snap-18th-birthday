// ============================================================
// Google Drive Integration
// Server-side only – handles file uploads via service account
// ============================================================

import { google } from "googleapis";
import { Readable } from "stream";

function getDriveClient() {
  const credentials = {
    type: "service_account",
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")!,
    project_id: process.env.GOOGLE_PROJECT_ID,
  };

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return google.drive({ version: "v3", auth });
}

export async function uploadFileToDrive({
  fileName,
  mimeType,
  fileBuffer,
  folderId,
}: {
  fileName: string;
  mimeType: string;
  fileBuffer: Buffer;
  folderId: string;
}): Promise<{ id: string; webViewLink: string }> {
  const drive = getDriveClient();
  const stream = Readable.from(fileBuffer);

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
      description: "Uploaded via Scan & Snap – 18th Birthday Edition",
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: "id, webViewLink, name",
  });

  if (!response.data.id) {
    throw new Error("Failed to upload file to Google Drive");
  }

  return {
    id: response.data.id,
    webViewLink: response.data.webViewLink || "",
  };
}

export async function getFileCount(folderId: string): Promise<number> {
  try {
    const drive = getDriveClient();
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id)",
      pageSize: 1000,
    });
    return response.data.files?.length || 0;
  } catch {
    return 0;
  }
}

export async function listGalleryFiles(folderId: string, max = 50) {
  try {
    const drive = getDriveClient();
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`,
      fields: "files(id, name, mimeType, thumbnailLink)",
      pageSize: max,
      orderBy: "createdTime desc",
    });
    return response.data.files || [];
  } catch {
    return [];
  }
}
