import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0e1a" },
  ],
};

export const metadata: Metadata = {
  title: "VPDFX – Everything You Need in One Simple Place",
  description:
    "Convert, compress, merge, edit PDFs, videos, images and more. Fast, free, and secure online tools for all your file needs.",
  keywords: "PDF tools, video converter, image editor, file converter, online tools",
};

import MobileBottomBar from "@/components/MobileBottomBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col pb-16 md:pb-0" suppressHydrationWarning>
        {children}
        <MobileBottomBar />
      </body>
    </html>
  );
}
