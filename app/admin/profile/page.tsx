"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin?tab=profile");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
      <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-6 py-4 rounded-2xl shadow-2xl">
        <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-200">
          অ্যাডমিন প্রোফাইল ও সিকিউরিটি হাব লোড হচ্ছে...
        </span>
      </div>
    </div>
  );
}
