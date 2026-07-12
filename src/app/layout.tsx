import type { Metadata } from "next";
import localFont from "next/font/local";
import DataDisclaimer from "@/components/DataDisclaimer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
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
  metadataBase: new URL("https://track-back-eight.vercel.app"),
  title: {
    default: "TrackBack — Congressional Money Accountability",
    template: "%s | TrackBack",
  },
  description:
    "Citizen money vs institutional money for every member of Congress. Real FEC and GovTrack data. They track us. We track them back.",
  openGraph: {
    title: "TrackBack — They track us. We track them back.",
    description:
      "Public accountability for congressional money: people vs institutions, industry breakdowns, and votes — from legal public filings.",
    siteName: "TrackBack",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrackBack — They track us. We track them back.",
    description:
      "Citizen money vs institutional money. Every disclosed industry. Public FEC data.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-950 font-sans text-slate-100 antialiased`}
      >
        <Header />
        <DataDisclaimer />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}