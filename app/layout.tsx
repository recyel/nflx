import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
const myFont = localFont({ src: './fonts/medium.woff2' })
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const boldFont = localFont({
  src: "./fonts/bold.woff2",
  variable: "--bold",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Netflix",
  description: "Watch New Interesting Web Series On Netflix ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${boldFont.variable} ${geistMono.variable} antialiased ${myFont.className}`}
      >
        {children}
      </body>
    </html>
  );
}
