// ============================================================
// Scan & Snap – 18th Birthday Edition
// Event Configuration
// Edit this file to customize your event details
// ============================================================

const eventConfig = {
  // ─── Debutante Info ───────────────────────────────────────
  debutanteName: "Sophia",
  birthdayTitle: "Happy 18th Birthday",
  tagline: "Eighteen and absolutely radiant ✨",

  // ─── Event Details ────────────────────────────────────────
  eventDate: "2026-08-15", // ISO format: YYYY-MM-DD
  eventTime: "06:00 PM",
  venue: "The Grand Ballroom, Manila Hotel",
  city: "Manila, Philippines",

  // ─── Welcome Message ──────────────────────────────────────
  welcomeMessage:
    "Thank you for celebrating this unforgettable milestone with me. " +
    "Capture the moments and upload your favorite photos and videos below " +
    "so we can treasure them forever. 💕",

  // ─── Upload Configuration ─────────────────────────────────
  maxPhotoSizeMB: 20,
  maxVideoSizeMB: 100,
  maxFilesPerUpload: 20,
  googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || "YOUR_FOLDER_ID",

  // ─── Features Toggle ──────────────────────────────────────
  features: {
    showCountdown: true,
    showGallery: false,
    enableMusic: true,
    enableDarkMode: true,
    showMemoryCounter: true,
    enableCompression: true,
    compressionQuality: 0.85,
  },

  // ─── Thank You Messages ───────────────────────────────────
  thankYouMessages: [
    "Thank you for making my 18th birthday unforgettable! 🎀",
    "Your memories are now part of my special day! 💕",
    "Thank you for celebrating with me! 🌸",
    "Every photo makes this celebration even more memorable! ✨",
    "I appreciate you for sharing this special moment! 🎊",
    "These memories will be treasured forever! 💖",
    "You've just added to the most beautiful chapter of my life! 🦋",
    "Thank you for being part of my magical 18th! 🌹",
  ],

  // ─── SEO & Meta ───────────────────────────────────────────
  siteName: "Scan & Snap – Sophia's 18th Birthday",
  siteDescription:
    "Upload your photos and videos from Sophia's 18th Birthday celebration.",

  // ─── Music ────────────────────────────────────────────────
  backgroundMusicUrl: "/music/background.mp3",
  backgroundMusicLabel: "🎵 Birthday Music",

  // ─── QR Code ──────────────────────────────────────────────
  qrCodeTitle: "Scan to Upload Your Photos!",
  qrCodeSubtitle: "Share your memories from Sophia's 18th Birthday",
};

export default eventConfig;
