import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Ultra HD AI Camera',
  description: 'AI-powered camera enhancement app',
};

// New viewport export
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

// New theme configuration
export const themeColor = [
  { media: '(prefers-color-scheme: dark)', color: '#000000' },
  { media: '(prefers-color-scheme: light)', color: '#000000' },
];

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </head>
        <body className="bg-black">{children}</body>
      </html>
    </ClerkProvider>
  );
}
