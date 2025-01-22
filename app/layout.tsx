import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://snalv.it"
  ),
  title: {
    default: "SNALV Confsal",
    template: "%s | SNALV Confsal",
  },
  description: "SNALV Confsal - Sindacato Nazionale Autonomo Lavoratori",

  // Open Graph
  openGraph: {
    type: "website",
    siteName: "SNALV Confsal",
    locale: "it_IT",
    images: [
      {
        url: "/og-image.jpg", // Assicurati di avere un'immagine di default
        width: 1200,
        height: 630,
        alt: "SNALV Confsal",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    site: "@snalv_confsal",
    creator: "@snalv_confsal",
  },

  // Altri meta tags
  other: {
    "theme-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "white",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
