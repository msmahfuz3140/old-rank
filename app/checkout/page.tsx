import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata = {
  title: "ফাস্ট চেকআউট | Shop Genie",
  description: "সহজ ও দ্রুততম ১-পেজ চেকআউট প্রসেস। ক্যাশ অন ডেলিভারি ও অনলাইন পেমেন্ট সুবিধা।",
};

export default function CheckoutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          অর্ডার চেকআউট
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          সঠিক তথ্য দিয়ে এক ক্লিকে আপনার অর্ডারটি নিশ্চিত করুন
        </p>
      </div>
      <CheckoutForm />
    </div>
  );
}
