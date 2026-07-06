import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Playfair_Display, Lato } from "next/font/google";
import eventConfig from "@/config/event.config";
import "./globals.css";

// Elegant serif font for headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Clean sans-serif for body
const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: eventConfig.siteName,
  description: eventConfig.siteDescription,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000"
  ),
  openGraph: {
    title: eventConfig.siteName,
    description: eventConfig.siteDescription,
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
  },
  keywords: [
    "birthday",
    "debut",
    "18th birthday",
    "photo upload",
    eventConfig.debutanteName,
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
