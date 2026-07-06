"use client";
// ============================================================
// QR Code Page – /qr-code
// Organizer page to download the QR code for printing
// ============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { Download, ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import eventConfig from "@/config/event.config";

export default function QRCodePage() {
  const [isCopied, setIsCopied] = useState(false);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://your-domain.vercel.app");

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(siteUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    // Convert SVG to PNG for download
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 512;
    canvas.height = 512;

    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      const link = document.createElement("a");
      link.download = `${eventConfig.debutanteName}-18th-birthday-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #E8A0BF, transparent)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #C9A0DC, transparent)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-600 mb-8 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Back to Upload Page</span>
        </Link>

        {/* QR Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 text-center"
        >
          {/* Header */}
          <div className="mb-6">
            <div className="text-4xl mb-3">📱</div>
            <h1
              className="font-heading text-3xl font-bold gradient-text mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {eventConfig.qrCodeTitle}
            </h1>
            <p className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              {eventConfig.qrCodeSubtitle}
            </p>
          </div>

          {/* QR Code */}
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-4 rounded-2xl border-2 shadow-inner"
              style={{
                background: "white",
                borderColor: "rgba(232,160,191,0.3)",
              }}
            >
              <QRCode
                id="qr-code-svg"
                value={siteUrl}
                size={220}
                fgColor="#4A2040"
                bgColor="white"
                level="H"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
          </motion.div>

          {/* Event info */}
          <div className="rounded-2xl p-4 mb-6 border"
            style={{
              background: "rgba(232,160,191,0.08)",
              borderColor: "rgba(232,160,191,0.2)",
            }}
          >
            <p className="font-heading text-lg font-bold text-rose-700 mb-1"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {eventConfig.birthdayTitle}, {eventConfig.debutanteName}!
            </p>
            <p className="text-sm text-rose-500">{eventConfig.venue}</p>
            <p className="text-xs text-rose-400 mt-1 font-mono break-all">{siteUrl}</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownload}
              id="download-qr-btn"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-white shadow-lg"
              style={{
                background: "linear-gradient(135deg, #E8A0BF, #B76E79)",
              }}
            >
              <Download size={18} />
              Download PNG
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePrint}
              id="print-qr-btn"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold border"
              style={{
                borderColor: "rgba(183,110,121,0.4)",
                color: "#B76E79",
                background: "rgba(232,160,191,0.1)",
              }}
            >
              <Printer size={18} />
              Print QR Code
            </motion.button>
          </div>

          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            id="copy-link-btn"
            className="mt-3 w-full py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              color: isCopied ? "#16a34a" : "var(--text-muted)",
              background: isCopied ? "rgba(220,255,220,0.5)" : "transparent",
              border: "1px solid rgba(232,160,191,0.2)",
            }}
          >
            {isCopied ? "✅ Link Copied!" : "📋 Copy Upload Link"}
          </button>
        </motion.div>

        {/* Printing tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 glass-card p-5"
        >
          <h3 className="font-semibold text-rose-700 mb-3 text-sm flex items-center gap-2">
            💡 Tips for Organizers
          </h3>
          <ul className="space-y-2 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <li>• Print this QR code and place it on each table</li>
            <li>• Share the link on your event's group chat</li>
            <li>• Display it on a screen at the venue entrance</li>
            <li>• Guests don't need to download anything — just scan & upload!</li>
            <li>• All uploads go directly to your Google Drive folder</li>
          </ul>
        </motion.div>

        {/* Print styles */}
        <style>{`
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; }
          }
        `}</style>
      </div>
    </main>
  );
}
