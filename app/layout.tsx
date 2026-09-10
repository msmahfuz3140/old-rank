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
  title: "Shop Genie | Ultra-Premium E-Commerce Marketplace",
  description:
    "বাংলাদেশের সেরা লারাভেল ভিত্তিক ই-কমার্স প্ল্যাটফর্মের চেয়েও উন্নত, সুপার ফাস্ট ও আধুনিক নেক্সট জেএস ই-কমার্স ওয়েবসাইট।",
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
