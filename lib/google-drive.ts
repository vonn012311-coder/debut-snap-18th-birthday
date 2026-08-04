// ============================================================
// Google Drive Integration
// Uses OAuth2 refresh token (works with personal Google Drive)
// ============================================================

import { google } from "googleapis";
import { Readable } from "stream";

function getDriveClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.drive({ version: "v3", auth: oauth2Client });
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
  const n8nUrl =
    process.env.N8N_WEBHOOK_URL ||
    "https://condense-harpist-siding.ngrok-free.dev/webhook/birthday-upload";

  if (n8nUrl) {
    try {
      const formData = new FormData();
      const uint8Array = new Uint8Array(fileBuffer);
      const blob = new Blob([uint8Array], { type: mimeType });
      formData.append("file", blob, fileName);
      formData.append("fileName", fileName);
      formData.append("folderId", folderId);

      const reqHeaders = {
        "ngrok-skip-browser-warning": "true",
        "User-Agent": "DebutSnapApp/1.0",
      };

      let response = await fetch(n8nUrl, {
        method: "POST",
        headers: reqHeaders,
        body: formData,
      });

      // If production webhook 404s (workflow inactive / in test mode), try test webhook endpoint
      if (response.status === 404 && n8nUrl.includes("/webhook/")) {
        const testUrl = n8nUrl.replace("/webhook/", "/webhook-test/");
        response = await fetch(testUrl, {
          method: "POST",
          headers: reqHeaders,
          body: formData,
        });
      }

      if (!response.ok) {
        const errText = await response.text();
        let errMsg = `n8n webhook error (${response.status})`;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.message) errMsg += `: ${parsed.message}`;
          else if (parsed.hint) errMsg += `: ${parsed.hint}`;
        } catch {
          if (errText) errMsg += `: ${errText.substring(0, 150)}`;
        }
        throw new Error(errMsg);
      }

      let data: Record<string, unknown> = {};
      try {
        data = (await response.json()) as Record<string, unknown>;
      } catch {
        // Response might be plain text
      }

      return {
        id: String(data.id || data.fileId || Date.now()),
        webViewLink: String(data.webViewLink || data.url || ""),
      };
    } catch (err) {
      console.error("n8n upload error:", err);
      throw err; // Throw n8n error directly so user sees why n8n failed
    }
  }

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
