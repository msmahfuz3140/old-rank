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
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/images/logo.png"
                alt="Old Rank Logo"
                className="w-11 h-11 rounded-full object-cover shadow border border-amber-400/30"
              />
              <div>
                <span className="font-extrabold text-2xl text-white tracking-tight block leading-none">
                  Old<span className="text-amber-400">Rank</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5 block">
                  Wear Your Rank
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              বাংলাদেশের প্রিমিয়াম মেনস ওয়্যার ও ফ্যাশন লাইফস্টাইল ব্র্যান্ড। অরিজিনাল ক্লোথিং ও কোয়ালিটি প্রোডাক্ট শতভাগ নিশ্চিন্তে কিনুন।
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-amber-400 shrink-0" />
                <span>
                  <a href="tel:01956016119" className="hover:text-white transition-colors">+880 1956-016119</a>,{" "}
                  <a href="tel:01301010553" className="hover:text-white transition-colors">+880 1301-010553</a>
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-amber-400 shrink-0" />
                <a href="mailto:mdmahfuzulhaque3140@gmail.com" className="hover:text-white transition-colors truncate">
                  mdmahfuzulhaque3140@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-amber-400 shrink-0" />
                <a href="mailto:niloy@gmail.com" className="hover:text-white transition-colors truncate">
                  niloy@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-amber-400 shrink-0" /> Dhanmondi, Dhaka, Bangladesh
              </p>
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
              <p className="text-xs font-semibold text-slate-400 mb-2">Payment Method:</p>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-300">
                <span className="bg-emerald-900/50 text-emerald-300 border border-emerald-600/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  ✓ Cash on Delivery (ক্যাশ অন ডেলিভারি)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 <strong>Old Rank</strong>. All rights reserved.</p>
          <p className="text-slate-400">
            Powered by Next.js & Express.js • Made for High Conversion E-Commerce
          </p>
        </div>
      </div>
    </footer>
  );
}
