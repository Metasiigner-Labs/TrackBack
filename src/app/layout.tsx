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
  title: "TrackBack — Congressional Money Accountability",
  description:
    "See how much special interest, lobbyist, and corporate money each member of Congress takes. Real data from the FEC and GovTrack. They track us. We track them back.",
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