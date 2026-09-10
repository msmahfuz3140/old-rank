import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NewsTickerBar from "@/components/layout/NewsTickerBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import PromoModal from "@/components/popups/PromoModal";
import SocialProofPopup from "@/components/popups/SocialProofPopup";
import QuickViewModal from "@/components/popups/QuickViewModal";
import CartDrawer from "@/components/cart/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Old Rank | Premium Men's Wear & Clothing Brand",
  description:
    "Old Rank - Wear Your Rank. বাংলাদেশের সেরা প্রিমিয়াম লাইফস্টাইল ও মেনস ওয়্যার ক্লথিং ব্র্যান্ড।",
  icons: {
    icon: [
      { url: "/images/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-[#303d6e] selection:text-white">
        <NewsTickerBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />

        {/* Dynamic Modals & Notifications */}
        <PromoModal />
        <SocialProofPopup />
        <QuickViewModal />
        <CartDrawer />
      </body>
    </html>
  );
}
