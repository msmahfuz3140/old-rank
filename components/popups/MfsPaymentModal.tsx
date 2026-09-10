"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Phone, MessageSquare, Sparkles, X, Check } from "lucide-react";

interface MfsPaymentModalProps {
  isOpen: boolean;
  gateway: "bkash" | "nagad";
  amount: number;
  customerPhone?: string;
  onClose: () => void;
  onSuccess: (paymentData: { method: string; trxId: string; senderPhone: string }) => void;
}

export default function MfsPaymentModal({
  isOpen,
  gateway,
  amount,
  customerPhone = "",
  onClose,
  onSuccess,
}: MfsPaymentModalProps) {
  const isBkash = gateway === "bkash";

  // Brand Configuration
  const brandColor = isBkash ? "#E2136E" : "#F7941D";
  const brandName = isBkash ? "bKash" : "Nagad";
  const helpline = isBkash ? "16247" : "16167";
  const copyright = isBkash
    ? "© 2026 bKash, All Rights Reserved"
    : "© 2026 Nagad, All Rights Reserved";

  // Step: 1 = Account Number, 2 = OTP Verification, 3 = PIN, 4 = Processing/Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("482910");
  const [pin, setPin] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const [invNo, setInvNo] = useState("InvnsTTpwC6Gm");

  // Reset modal state whenever it opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhone(customerPhone || "");
      setOtp("");
      setPin("");
      setErrorMsg("");
      setShowSmsBanner(false);
      setCountdown(30);

      // Generate realistic invoice number like in screenshot
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
      let res = "Invns";
      for (let i = 0; i < 7; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setInvNo(res);
    }
  }, [isOpen, customerPhone]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  if (!isOpen) return null;

  // Generate realistic Transaction ID
  const generateTrxId = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let res = isBkash ? "BK" : "NG";
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  // Step 1: Submit Phone Number
  const handleProceedToOtp = () => {
    setErrorMsg("");
    const cleanPhone = phone.replace(/\s+/g, "");

    if (!cleanPhone) {
      setErrorMsg(`আপনার ${brandName} একাউন্ট নম্বর লিখুন`);
      return;
    }

    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setErrorMsg("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)");
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setStep(2);
    setCountdown(30);

    setTimeout(() => {
      setShowSmsBanner(true);
    }, 400);
  };

  // Step 2: Submit OTP
  const handleConfirmOtp = () => {
    setErrorMsg("");
    if (otp.trim().length !== 6) {
      setErrorMsg("অনুগ্রহ করে মোবাইলে পাঠানো ৬ ডিজিটের কোড দিন।");
      return;
    }
    setStep(3);
    setShowSmsBanner(false);
  };

  // Step 3: Submit PIN and Complete Payment
  const handleConfirmPin = () => {
    setErrorMsg("");
    if (pin.trim().length < 4) {
      setErrorMsg("অনুগ্রহ করে আপনার পিন (PIN) নম্বর দিন।");
      return;
    }

    setStep(4);
    const trxId = generateTrxId();

    setTimeout(() => {
      onSuccess({
        method: isBkash ? "bkash_auto" : "nagad_auto",
        trxId,
        senderPhone: phone || "017XXXXXXXX",
      });
    }, 1500);
  };

  // Central Confirm Handler
  const handleConfirm = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (step === 1) handleProceedToOtp();
    else if (step === 2) handleConfirmOtp();
    else if (step === 3) handleConfirmPin();
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setCountdown(30);
    setShowSmsBanner(true);
  };

  // Validation state for Confirm button
  const canConfirm = () => {
    if (step === 1) return phone.replace(/\s+/g, "").length >= 11;
    if (step === 2) return otp.trim().length === 6;
    if (step === 3) return pin.trim().length >= 4;
    return false;
  };

  return (
    <div
      className="fixed inset-0 z-100 bg-[#707786]/90 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 4) onClose();
      }}
    >
      {/* Simulated Incoming SMS Toast Banner */}
      {showSmsBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-110 max-w-sm w-full mx-auto bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700 flex items-start gap-3 animate-slide-down">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <MessageSquare size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold text-white uppercase">{brandName} SMS</span>
              <span>এখনই</span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5 font-medium">
              আপনার {brandName} ভেরিফিকেশন কোড (OTP) হলো:{" "}
              <strong className="text-amber-400 font-mono text-sm">{generatedOtp}</strong>
            </p>
            <button
              type="button"
              onClick={() => {
                setOtp(generatedOtp);
                setShowSmsBanner(false);
              }}
              className="mt-1.5 text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={12} /> ওটিপি কোডটি স্বয়ংক্রিয়ভাবে বসান
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowSmsBanner(false)}
            className="text-slate-400 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Payment Gateway Modal Card - 1:1 Match with official bKash / Nagad Screen */}
      <div
        className="w-full max-w-[430px] bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header Logo Strip (Pure White with Centered Brand Logo) */}
        <div className="bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-center relative">
          {isBkash ? (
            <div className="flex items-center justify-center gap-3">
              {/* Official Bengali "বিকাশ" script */}
              <span className="text-3xl font-black text-[#E2136E] tracking-tight font-sans">
                বিকাশ
              </span>
              {/* Official Origami Bird Icon */}
              <svg
                width="42"
                height="42"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path d="M12 42 L52 18 L42 62 Z" fill="#E2136E" />
                <path d="M52 18 L88 8 L62 46 Z" fill="#D01060" />
                <path d="M42 62 L62 46 L82 78 Z" fill="#E2136E" />
                <path d="M62 46 L96 42 L82 78 Z" fill="#9B0D45" />
                <path d="M42 62 L16 78 L32 52 Z" fill="#E2136E" />
                <path d="M16 78 L6 68 L22 62 Z" fill="#9B0D45" />
              </svg>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-black text-[#F7941D] tracking-tight font-sans">
                নগদ
              </span>
              <svg
                width="38"
                height="38"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="40" stroke="#F7941D" strokeWidth="8" />
                <path
                  d="M35 65 C 35 35, 65 35, 65 65"
                  stroke="#EA580C"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="38" r="9" fill="#EA580C" />
              </svg>
            </div>
          )}
        </div>

        {/* 2. Merchant & Invoice Strip */}
        <div className="bg-white px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Orange shopping cart circle icon */}
            <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 shrink-0">
              <ShoppingCart size={20} strokeWidth={2.2} />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-slate-800 leading-tight">
                TokenizedMerchant02
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Inv No: {invNo}
              </div>
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 font-mono tracking-tight">
            ৳{amount.toLocaleString()}
          </div>
        </div>

        {/* 3. Iconic Solid Magenta / Brand Body Box */}
        <div
          style={{ backgroundColor: brandColor }}
          className="px-6 py-8 text-white text-center transition-all"
        >
          {/* Error message inside box */}
          {errorMsg && (
            <div className="mb-4 p-2.5 bg-white/20 backdrop-blur-xs border border-white/40 rounded text-xs font-semibold text-white animate-fadeIn">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Phone / Account Number */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white tracking-wide">
                Your {brandName} Account Number
              </h3>

              <div className="max-w-[340px] mx-auto">
                <input
                  type="tel"
                  autoFocus
                  placeholder="e.g 01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleProceedToOtp();
                    }
                  }}
                  className="w-full bg-white text-slate-900 text-center py-3 px-4 rounded shadow-inner text-base font-bold font-mono tracking-wider placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-3 focus:ring-white/40 transition-all"
                />
              </div>

              <div className="text-xs text-white/90 font-medium pt-1">
                Confirm and proceed,{" "}
                <a
                  href="#terms"
                  onClick={(e) => e.preventDefault()}
                  className="underline hover:text-white font-semibold"
                >
                  terms & conditions
                </a>
              </div>
            </div>
          )}

          {/* STEP 2: Verification Code (OTP) */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white tracking-wide">
                {brandName} Verification Code
              </h3>

              <div className="max-w-[340px] mx-auto">
                <input
                  type="text"
                  autoFocus
                  maxLength={6}
                  placeholder="e.g 123456"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    if (errorMsg) setErrorMsg("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleConfirmOtp();
                    }
                  }}
                  className="w-full bg-white text-slate-900 text-center py-3 px-4 rounded shadow-inner text-lg font-black font-mono tracking-[0.3em] placeholder:tracking-normal placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-3 focus:ring-white/40 transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-white/90 max-w-[340px] mx-auto pt-1 font-medium">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0}
                  className="underline hover:text-white disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `Resend Code (${countdown}s)` : "Resend Code"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtp(generatedOtp);
                    if (errorMsg) setErrorMsg("");
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Auto Fill OTP ({generatedOtp})
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PIN Number Entry */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white tracking-wide">
                Enter {isBkash ? "5" : "4"} digit PIN
              </h3>

              <div className="max-w-[340px] mx-auto">
                <input
                  type="password"
                  autoFocus
                  maxLength={isBkash ? 5 : 4}
                  placeholder="•••••"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleConfirmPin();
                    }
                  }}
                  className="w-full bg-white text-slate-900 text-center py-3 px-4 rounded shadow-inner text-xl font-black font-mono tracking-[0.4em] placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-white/40 transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-white/90 max-w-[340px] mx-auto pt-1 font-medium">
                <span className="text-[11px] text-white/80">Demo PIN: 12345</span>
                <button
                  type="button"
                  onClick={() => {
                    setPin(isBkash ? "12345" : "1234");
                    if (errorMsg) setErrorMsg("");
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Use Demo PIN
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Processing / Loading Animation */}
          {step === 4 && (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              <h3 className="text-base font-bold text-white tracking-wide">
                Processing {brandName} Payment...
              </h3>
              <p className="text-xs text-white/80 font-medium">
                অনুগ্রহ করে অপেক্ষা করুন, পেমেন্ট ভেরিফাই করা হচ্ছে...
              </p>
            </div>
          )}
        </div>

        {/* 4. Action Buttons Bar (Cancel & Confirm side-by-side) */}
        <div className="bg-white px-6 pt-5 pb-3">
          {step !== 4 ? (
            <div className="flex items-center gap-3">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded text-sm transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>

              {/* Confirm Button - Direct click handler */}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canConfirm()}
                style={{
                  backgroundColor: canConfirm() ? brandColor : "#E2E8F0",
                  color: canConfirm() ? "#FFFFFF" : "#94A3B8",
                }}
                className={`w-1/2 py-2.5 px-4 font-bold rounded text-sm transition-all text-center ${
                  canConfirm()
                    ? "hover:opacity-95 shadow-md cursor-pointer active:scale-98"
                    : "cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>
          ) : (
            <div className="text-center py-2 text-xs font-semibold text-slate-500">
              দয়া করে অপেক্ষা করুন...
            </div>
          )}

          {/* 5. Helpline & Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
              <span className="w-5 h-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                <Phone size={12} fill="currentColor" />
              </span>
              <span>{helpline}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">{copyright}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
