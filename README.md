# 📸 Scan & Snap – 18th Birthday Edition

> A beautiful, mobile-first web app that lets guests upload photos and videos from a debut celebration by simply scanning a QR code — all files automatically saved to Google Drive.

![Scan & Snap Banner](https://via.placeholder.com/1200x400/E8A0BF/4A2040?text=Scan+%26+Snap+%E2%80%93+18th+Birthday+Edition)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📸 Photo Upload | JPG, PNG, HEIC — up to 20MB each |
| 🎬 Video Upload | MP4, MOV — up to 100MB each |
| 📷 Camera Capture | Take photo / record video directly from phone |
| 🗂️ Drag & Drop | Beautiful drag-and-drop file zone |
| 🖼️ File Preview | Preview before uploading, remove unwanted files |
| 📊 Progress Bar | Live upload progress with percentage |
| 🎊 Confetti | Celebration animation after upload |
| 💝 Memory Counter | Live count of all uploaded memories |
| ⏰ Countdown Timer | Auto-hides after event date |
| 🎵 Background Music | Play/pause with animated controls |
| 🌙 Dark Mode | Toggle between light and dark themes |
| 📱 QR Code Page | Organizer page to download/print QR code |
| 🗜️ Compression | Images compressed before upload (preserves quality) |
| 🔒 Security | Rate limiting, file type/size validation |
| 🚀 Google Drive | Service account auto-upload to Drive folder |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/debut-snap.git
cd debut-snap
npm install
```

### 2. Set Up Google Drive

#### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g., `debut-snap`)
3. Enable the **Google Drive API** under APIs & Services → Enable APIs

#### Step 2: Create a Service Account
1. Go to **IAM & Admin → Service Accounts**
2. Click **Create Service Account**
3. Name it (e.g., `debut-snap-uploader`)
4. Skip roles, click **Done**
5. Click the service account → **Keys** tab → **Add Key → JSON**
6. Download the JSON key file

#### Step 3: Share Your Drive Folder
1. Create a folder in Google Drive (e.g., `Sophia's 18th Birthday Photos`)
2. Right-click the folder → **Share**
3. Add your **service account email** (from the JSON file) as **Editor**
4. Copy the **Folder ID** from the URL (the long string after `/folders/`)

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

> **Tip:** Copy `private_key` from the JSON file exactly, replacing actual newlines with `\n`

### 4. Customize Your Event

Open `config/event.config.ts` and edit:

```typescript
debutanteName: "Sophia",        // Change to your debutante's name
birthdayTitle: "Happy 18th Birthday",
eventDate: "2026-08-15",        // YYYY-MM-DD format
eventTime: "06:00 PM",
venue: "The Grand Ballroom, Manila Hotel",
welcomeMessage: "...",          // Your personal welcome message
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
debut-snap/
├── app/
│   ├── layout.tsx              # Root layout + Google Fonts + Theme provider
│   ├── page.tsx                # Main landing + upload page
│   ├── globals.css             # Global styles, glassmorphism, animations
│   ├── qr-code/
│   │   └── page.tsx            # QR code generator page for organizer
│   └── api/
│       ├── upload/route.ts     # File upload → Google Drive
│       ├── memories-count/route.ts  # Live file count
│       └── gallery/route.ts    # Gallery listing (optional)
│
├── components/
│   ├── FloatingDecorations.tsx # Animated balloons, flowers, sparkles
│   ├── CountdownTimer.tsx      # Countdown to event date
│   ├── MemoryCounter.tsx       # Live memory count
│   ├── UploadSection.tsx       # Full upload UI (dropzone + camera)
│   ├── SuccessModal.tsx        # Post-upload confetti celebration
│   ├── BackgroundMusic.tsx     # Audio player with controls
│   └── ThemeToggle.tsx         # Dark/light mode toggle
│
├── lib/
│   ├── google-drive.ts         # Google Drive API (server-side)
│   └── utils.ts                # Shared utility functions
│
├── config/
│   └── event.config.ts         # 🎯 ALL customizable settings here
│
├── public/
│   ├── favicon.svg             # Custom crown + camera favicon
│   └── music/
│       └── background.mp3      # (Add your background music here)
│
├── .env.example                # Environment variables template
├── .env.local                  # Your local credentials (never commit!)
├── vercel.json                 # Vercel deployment config
└── next.config.ts              # Next.js config with upload size limit
```

---

## 🎨 Customization

All settings are in `config/event.config.ts` — no need to edit component code:

| Setting | Description |
|---|---|
| `debutanteName` | Name displayed in heading |
| `birthdayTitle` | Main title (e.g., "Happy 18th Birthday") |
| `eventDate` | Date for countdown timer (YYYY-MM-DD) |
| `venue` | Venue name shown in event details |
| `welcomeMessage` | Personal message shown on the card |
| `maxPhotoSizeMB` | Max photo file size (default: 20) |
| `maxVideoSizeMB` | Max video file size (default: 100) |
| `maxFilesPerUpload` | Max files per batch (default: 20) |
| `features.showCountdown` | Toggle countdown timer |
| `features.showGallery` | Toggle public photo gallery |
| `features.enableMusic` | Toggle background music |
| `features.enableDarkMode` | Toggle dark/light mode button |
| `thankYouMessages` | Array of random thank-you messages |

### Adding Background Music

1. Convert your song to `.mp3`
2. Place it in `public/music/background.mp3`
3. The music player will appear automatically

---

## 🚀 Deploy to Vercel

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

Add environment variables when prompted.

### Option B: Vercel Dashboard

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Connect your GitHub repo
4. Add all environment variables from `.env.example`
5. Click **Deploy**

### Required Environment Variables on Vercel

```
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_PROJECT_ID
GOOGLE_DRIVE_FOLDER_ID
NEXT_PUBLIC_SITE_URL
```

> ⚠️ For `GOOGLE_PRIVATE_KEY` on Vercel, paste the raw value **with** actual newlines (not `\n`), or wrap it in double quotes with `\n` escape sequences.

---

## 📱 QR Code

After deploying:

1. Open `https://your-app.vercel.app/qr-code`
2. Download the PNG or print directly
3. Place on tables, at the entrance, or share in the group chat

---

## 🔒 Security

- ✅ File type validation (whitelist only images & videos)
- ✅ File size enforcement (per-file limits)
- ✅ Rate limiting (10 uploads/hour per IP)
- ✅ No public login or account required
- ✅ Server-side service account (credentials never exposed to client)
- ✅ Security headers (X-Frame-Options, CSP, etc.)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Storage | Google Drive API v3 |
| Auth | Google Service Account |
| Fonts | Google Fonts (Playfair Display + Lato) |
| Deployment | Vercel |

---

## 📋 License

MIT — Free to use and customize for your personal events.

---

Made with 💕 for **Sophia's 18th Birthday** · Powered by **Scan & Snap**
