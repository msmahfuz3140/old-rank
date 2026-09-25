"use client";

import { usePathname } from "next/navigation";
import NewsTickerBar from "@/components/layout/NewsTickerBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import PromoModal from "@/components/popups/PromoModal";
import QuickViewModal from "@/components/popups/QuickViewModal";
import CartDrawer from "@/components/cart/CartDrawer";
import CartToast from "@/components/cart/CartToast";

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <div className="w-full min-h-screen bg-[#f4f6fb]">{children}</div>;
  }

  return (
    <>
      <NewsTickerBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />

      {/* Storefront Popups & Drawers */}
      <PromoModal />
      <QuickViewModal />
      <CartDrawer />
      <CartToast />
    </>
  );
}
