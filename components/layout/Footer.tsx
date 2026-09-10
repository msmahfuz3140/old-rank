"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#131a22] text-slate-300 pt-12 pb-24 md:pb-8 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#303d6e] to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow">
                SG
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Shop<span className="text-indigo-400">Genie</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              বাংলাদেশের সেরা ও দ্রুততম বিশ্বস্ত ই-কমার্স প্ল্যাটফর্ম। অরিজিনাল গ্যাজেট, ফ্যাশন ও ডিজিটাল সার্ভিস শতভাগ নিশ্চিন্তে কিনুন।
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2"><Phone size={14} className="text-indigo-400" /> +880 1849-832178 (Hotline)</p>
              <p className="flex items-center gap-2"><Mail size={14} className="text-indigo-400" /> support@shopgenie.com</p>
              <p className="flex items-center gap-2"><MapPin size={14} className="text-indigo-400" /> Dhanmondi, Dhaka, Bangladesh</p>
            </div>
          </div>

          {/* Col 2: Useful Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-indigo-500/40 pb-2 inline-block">
              Useful Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/order-track" className="hover:text-white transition-colors">অর্ডার ট্র্যাকিং (Track Order)</Link></li>
              <li><Link href="/sellers" className="hover:text-white transition-colors">ভেরিফাইড শপস (Verified Sellers)</Link></li>
              <li><Link href="/page/order-procedure" className="hover:text-white transition-colors">অর্ডার করার নিয়মাবলী</Link></li>
              <li><Link href="/page/delivery-rules" className="hover:text-white transition-colors">ডেলিভারি পলিসি ও চার্জ</Link></li>
              <li><Link href="/complaint" className="hover:text-white transition-colors">কমপ্লেইন বা অভিযোগ জানান</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-indigo-500/40 pb-2 inline-block">
              Policies & Help
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/page/return-policy" className="hover:text-white transition-colors">৭ দিনের রিটার্ন ও রিফান্ড পলিসি</Link></li>
              <li><Link href="/page/terms" className="hover:text-white transition-colors">টার্মস অ্যান্ড কন্ডিশন্স</Link></li>
              <li><Link href="/page/privacy" className="hover:text-white transition-colors">প্রাইভেসি পলিসি</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">কাস্টমার সাপোর্ট হেল্পলাইন</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Apps */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-indigo-500/40 pb-2 inline-block">
              Newsletter & Updates
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              বিশেষ অফার ও ডিসকাউন্ট কুপন সরাসরি ইনবক্সে পেতে ইমেইল সাবস্ক্রাইব করুন।
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 mb-4">
              <input
                type="email"
                placeholder="আপনার ইমেইল..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 flex-1"
              />
              <button
                type="submit"
                className="bg-[#303d6e] hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow"
              >
                <Send size={13} /> Join
              </button>
            </form>
            {isSubscribed && (
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={13} /> সাবস্ক্রিপশন সফল হয়েছে! ধন্যবাদ।
              </p>
            )}

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-400 mb-2">We Accept:</p>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-300">
                <span className="bg-pink-900/40 text-pink-300 border border-pink-700/50 px-2 py-1 rounded">bKash</span>
                <span className="bg-orange-900/40 text-orange-300 border border-orange-700/50 px-2 py-1 rounded">Nagad</span>
                <span className="bg-purple-900/40 text-purple-300 border border-purple-700/50 px-2 py-1 rounded">Rocket</span>
                <span className="bg-blue-900/40 text-blue-300 border border-blue-700/50 px-2 py-1 rounded">Visa/Mastercard</span>
                <span className="bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 px-2 py-1 rounded">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 <strong>Shop Genie Next</strong>. All rights reserved.</p>
          <p className="text-slate-400">
            Powered by Next.js & Express.js • Made for High Conversion E-Commerce
          </p>
        </div>
      </div>
    </footer>
  );
}
