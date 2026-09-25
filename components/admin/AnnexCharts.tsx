"use client";

import React, { useState } from "react";

// ==========================================
// 1. OVERLAPPING BARS ON MOBILE / SALES TREND
// ==========================================
export function SalesBarChart({
  marketplaceTotal = 0,
  lastWeekTotal = 0,
  lastMonthTotal = 0,
  orders = [],
}: {
  marketplaceTotal?: number;
  lastWeekTotal?: number;
  lastMonthTotal?: number;
  orders?: any[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentYear = new Date().getFullYear();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Calculate real live monthly breakdown from orders
  const monthlyData = monthNames.map((name, index) => {
    let sales = 0;
    let cost = 0;
    if (orders && Array.isArray(orders)) {
      orders.forEach((ord) => {
        if (ord.status === "cancelled") return;
        const d = new Date(ord.createdAt);
        if (!isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === index) {
          sales += Number(ord.grandTotal) || Number(ord.subtotal) || 0;
          if (ord.items && Array.isArray(ord.items)) {
            ord.items.forEach((item: any) => {
              cost += (Number(item.costPrice) || 0) * (Number(item.quantity) || 1);
            });
          }
        }
      });
    }
    return { name, sales, cost };
  });

  const maxMonthSale = Math.max(...monthlyData.map((m) => m.sales), 1);
  const months = monthlyData.map((m) => ({
    name: m.name,
    bar1: m.sales > 0 ? Math.max(12, Math.round((m.sales / maxMonthSale) * 100)) : 4,
    bar2: m.cost > 0 ? Math.max(10, Math.round((m.cost / maxMonthSale) * 100)) : 2,
    val: m.sales > 0 ? `৳ ${m.sales.toLocaleString()}` : "৳ ০",
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-bold text-sm text-slate-800 tracking-tight">
            মাসভিত্তিক লাইভ বিক্রয় ও ব্যয় (Monthly Live Sales Trend)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            ডাটাবেজে সংরক্ষিত কাস্টমার অর্ডারের রিয়েল-টাইম মাসিক বিক্রয় ও ক্রয়মূল্যের গ্রাফ
          </p>
        </div>

        {/* 3 Metric Headers matching Annex */}
        <div className="grid grid-cols-3 gap-2 text-center py-2 mb-4 bg-slate-50/70 rounded-xl border border-slate-100">
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              ৳ {Number(marketplaceTotal || 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              মোট লাইভ বিক্রয়
            </span>
          </div>
          <div className="border-x border-slate-200">
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              ৳ {Number(lastWeekTotal || 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              বিগত ৭ দিন
            </span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              ৳ {Number(lastMonthTotal || 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              চলতি মাস
            </span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="relative pt-2">
        {/* Y Axis Legend */}
        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mb-1 px-1">
          <span>৳ {maxMonthSale > 1 ? maxMonthSale.toLocaleString() : "10k"}</span>
          <span>৳ {maxMonthSale > 1 ? Math.round(maxMonthSale * 0.75).toLocaleString() : "7.5k"}</span>
          <span>৳ {maxMonthSale > 1 ? Math.round(maxMonthSale * 0.5).toLocaleString() : "5.0k"}</span>
          <span>৳ {maxMonthSale > 1 ? Math.round(maxMonthSale * 0.25).toLocaleString() : "2.5k"}</span>
          <span>০</span>
        </div>

        {/* Chart SVG */}
        <div className="w-full h-44 sm:h-52 relative flex items-end">
          {/* Dashed Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-5">
            <div className="w-full border-b border-dashed border-slate-100" />
            <div className="w-full border-b border-dashed border-slate-100" />
            <div className="w-full border-b border-dashed border-slate-100" />
            <div className="w-full border-b border-dashed border-slate-100" />
            <div className="w-full border-b border-slate-200" />
          </div>

          {/* Bars Container */}
          <div className="relative w-full h-full flex items-end justify-between px-1 z-10 pb-5">
            {months.map((m, idx) => {
              const isHov = hoveredIndex === idx;
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full px-0.5 sm:px-1 group cursor-pointer relative"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHov && (
                    <div className="absolute -top-7 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-20 pointer-events-none">
                      {m.val}
                    </div>
                  )}

                  {/* Dual Overlapping/Side-by-side Bars */}
                  <div className="w-full max-w-[16px] flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                    {/* Primary Bar (Indigo) */}
                    <div
                      className="w-1/2 rounded-t-xs bg-[#5064df] group-hover:bg-[#3f51b5] transition-all duration-300"
                      style={{ height: `${m.bar1}%` }}
                    />
                    {/* Secondary Bar (Sky Cyan) */}
                    <div
                      className="w-1/2 rounded-t-xs bg-[#38bdf8] group-hover:bg-[#0ea5e9] transition-all duration-300"
                      style={{ height: `${m.bar2}%` }}
                    />
                  </div>

                  {/* Month Label */}
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium mt-1 truncate">
                    {m.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#5064df]" />
            <span>বিক্রয় রেভিনিউ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#38bdf8]" />
            <span>সোর্সিং ব্যয় (COGS)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. STACKED BAR CHART / ORDER FULFILLMENT
// ==========================================
export function StackedBarChart({
  deliveredCount = 0,
  processingCount = 0,
  pendingCount = 0,
  orders = [],
}: {
  deliveredCount?: number;
  processingCount?: number;
  pendingCount?: number;
  orders?: any[];
}) {
  const totalCount = (deliveredCount || 0) + (processingCount || 0) + (pendingCount || 0);

  // Group real live orders by quarter
  const currentYear = new Date().getFullYear();
  const qData = [
    { name: "Q1", s1: 0, s2: 0, s3: 0 },
    { name: "Q2", s1: 0, s2: 0, s3: 0 },
    { name: "Q3", s1: 0, s2: 0, s3: 0 },
    { name: "Q4", s1: 0, s2: 0, s3: 0 },
  ];

  if (orders && Array.isArray(orders)) {
    orders.forEach((ord) => {
      if (ord.status === "cancelled") return;
      const d = new Date(ord.createdAt);
      if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
        const qIndex = Math.floor(d.getMonth() / 3);
        if (qIndex >= 0 && qIndex < 4) {
          if (ord.status === "delivered") qData[qIndex].s1++;
          else if (["confirmed", "processing", "shipped"].includes(ord.status)) qData[qIndex].s2++;
          else qData[qIndex].s3++;
        }
      }
    });
  }

  // If no quarter data yet, show overall breakdown in current quarter
  const currentQ = Math.floor(new Date().getMonth() / 3);
  if (qData.every((q) => q.s1 === 0 && q.s2 === 0 && q.s3 === 0)) {
    qData[currentQ].s1 = deliveredCount || 0;
    qData[currentQ].s2 = processingCount || 0;
    qData[currentQ].s3 = pendingCount || 0;
  }

  const maxVal = Math.max(...qData.map((q) => q.s1 + q.s2 + q.s3), 5);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-bold text-sm text-slate-800 tracking-tight">
            অর্ডার স্ট্যাটাস ও ডেলিভারি পাইপলাইন (Order Pipeline)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            ডাটাবেজে রক্ষিত সকল লাইভ অর্ডারের বর্তমান অবস্থা এবং কোয়ার্টার অনুযায়ী বণ্টন
          </p>
        </div>

        {/* 3 Metric Headers matching Annex */}
        <div className="grid grid-cols-3 gap-2 text-center py-2 mb-4 bg-slate-50/70 rounded-xl border border-slate-100">
          <div>
            <span className="block text-lg sm:text-xl font-black text-emerald-600">
              {deliveredCount}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              ডেলিভার্ড
            </span>
          </div>
          <div className="border-x border-slate-200">
            <span className="block text-lg sm:text-xl font-black text-[#5064df]">
              {processingCount}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              প্রসেসিং / কনফার্মড
            </span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-black text-amber-500">
              {pendingCount}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              পেন্ডিং অর্ডার
            </span>
          </div>
        </div>
      </div>

      {/* SVG Stacked Bar Chart */}
      <div className="relative pt-2">
        {/* Y Axis Legend */}
        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mb-1 px-1">
          <span>{maxVal}</span>
          <span>{Math.round(maxVal * 0.75)}</span>
          <span>{Math.round(maxVal * 0.5)}</span>
          <span>{Math.round(maxVal * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart SVG */}
        <div className="w-full h-44 sm:h-52 relative flex items-end">
          {/* Dashed Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-5">
            <div className="w-full border-b border-dashed border-slate-100" />
            <div className="w-full border-b border-dashed border-slate-100" />
            <div className="w-full border-b border-dashed border-slate-100" />
            <div className="w-full border-b border-dashed border-slate-100" />
            <div className="w-full border-b border-slate-200" />
          </div>

          {/* Stacked Bars Container */}
          <div className="relative w-full h-full flex items-end justify-around px-2 z-10 pb-5">
            {qData.map((q, idx) => {
              const h1 = (q.s1 / maxVal) * 100;
              const h2 = (q.s2 / maxVal) * 100;
              const h3 = (q.s3 / maxVal) * 100;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full px-2 max-w-[48px] group cursor-pointer"
                >
                  {/* The Stacked Bar Column */}
                  <div className="w-full rounded-t-sm overflow-hidden flex flex-col-reverse shadow-xs">
                    {/* Layer 1: Indigo */}
                    <div
                      className="w-full bg-[#5064df] group-hover:opacity-90 transition-all duration-300"
                      style={{ height: `${h1}%` }}
                      title={`Delivered: ${q.s1}`}
                    />
                    {/* Layer 2: Sky Cyan */}
                    <div
                      className="w-full bg-[#38bdf8] group-hover:opacity-90 transition-all duration-300"
                      style={{ height: `${h2}%` }}
                      title={`Processing: ${q.s2}`}
                    />
                    {/* Layer 3: Amber / Orange */}
                    <div
                      className="w-full bg-[#f59e0b] group-hover:opacity-90 transition-all duration-300"
                      style={{ height: `${h3}%` }}
                      title={`Pending: ${q.s3}`}
                    />
                  </div>

                  {/* Quarter Label */}
                  <span className="text-[10px] text-slate-400 font-bold mt-1">
                    {q.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#5064df]" />
            <span>ডেলিভার্ড</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#38bdf8]" />
            <span>শিপিং/ইন-ট্রানজিট</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#f59e0b]" />
            <span>পেন্ডিং সিওডি</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. ANIMATING A DONUT WITH SVG / CATEGORY RADIAL
// ==========================================
export function DonutWheelChart({
  cat1 = 0,
  cat2 = 1,
  cat3 = 0,
  products = [],
}: {
  cat1?: number;
  cat2?: number;
  cat3?: number;
  products?: any[];
}) {
  const segmentColors = [
    "#ef4444", "#f87171", "#fb923c", "#f97316", "#ea580c",
    "#facc15", "#eab308", "#ca8a04", "#fbbf24", "#34d399",
    "#10b981", "#059669", "#38bdf8", "#0284c7", "#6366f1",
    "#4f46e5", "#4338ca", "#3730a3", "#1e1b4b", "#0f172a",
    "#334155", "#64748b", "#94a3b8", "#f43f5e"
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-bold text-sm text-slate-800 tracking-tight">
            ক্যাটালগ ও ডাটাবেজ ডিস্ট্রিবিউশন (Database Catalog Radial)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            সরাসরি MongoDB-তে সংরক্ষিত সক্রিয় পণ্য, অফিসিয়াল ভেন্ডর এবং মোট অর্ডারের অনুপাত
          </p>
        </div>

        {/* 3 Metric Headers matching Annex */}
        <div className="grid grid-cols-3 gap-2 text-center py-2 mb-4 bg-slate-50/70 rounded-xl border border-slate-100">
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {cat1}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              সক্রিয় পণ্য
            </span>
          </div>
          <div className="border-x border-slate-200">
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {cat2}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              ভেন্ডর হাব
            </span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {cat3}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              মোট লাইভ অর্ডার
            </span>
          </div>
        </div>
      </div>

      {/* Radial Wheel Circular Chart SVG */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
            {segmentColors.map((color, idx) => {
              const count = segmentColors.length;
              const angle = (idx / count) * 360;
              const rad = (angle * Math.PI) / 180;
              const rInner = 60;
              const rOuter = 82;
              const cx = 100;
              const cy = 100;

              const x1 = cx + rInner * Math.cos(rad);
              const y1 = cy + rInner * Math.sin(rad);
              const x2 = cx + rOuter * Math.cos(rad);
              const y2 = cy + rOuter * Math.sin(rad);

              return (
                <line
                  key={idx}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="transition-all duration-300 hover:stroke-width-[11] cursor-pointer"
                />
              );
            })}
          </svg>

          {/* Center Hub */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-slate-800">{cat1} টি</span>
            <span className="text-[9px] font-bold text-emerald-600 uppercase">MongoDB Live</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-500 pt-3 border-t border-slate-100 w-full mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>জুয়েলারি ও অলংকার</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>প্রিমিয়াম স্টক</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span>ভেরিফাইড ভেন্ডর</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span>সরাসরি ডাটাবেজ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. SIMPLE PIE CHART / LIVE ORDER RATIO
// ==========================================
export function CleanPieChart({
  deliveredCount = 0,
  confirmedCount = 0,
  pendingCount = 0,
  totalCount = 0,
}: {
  deliveredCount?: number;
  confirmedCount?: number;
  pendingCount?: number;
  totalCount?: number;
  p1?: number;
  p2?: number;
  p3?: number;
}) {
  const sum = (deliveredCount || 0) + (confirmedCount || 0) + (pendingCount || 0);
  const baseTotal = totalCount > 0 ? totalCount : Math.max(sum, 1);

  const pDelivered = Math.round(((deliveredCount || 0) / baseTotal) * 100);
  const pConfirmed = Math.round(((confirmedCount || 0) / baseTotal) * 100);
  const pPending = sum > 0 ? Math.max(0, 100 - pDelivered - pConfirmed) : 100;

  // Circle perimeter = 2 * PI * 25 ≈ 157.08
  const dash1 = (pDelivered / 100) * 157.08;
  const dash2 = (pConfirmed / 100) * 157.08;
  const dash3 = (pPending / 100) * 157.08;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-bold text-sm text-slate-800 tracking-tight">
            লাইভ অর্ডার স্ট্যাটাস বণ্টন (Order Status Ratio)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            ডাটাবেজে রক্ষিত মোট {baseTotal} টি অর্ডারের শতাংশভিত্তিক স্ট্যাটাস
          </p>
        </div>

        {/* 3 Metric Headers matching Annex */}
        <div className="grid grid-cols-3 gap-2 text-center py-2 mb-4 bg-slate-50/70 rounded-xl border border-slate-100">
          <div>
            <span className="block text-lg sm:text-xl font-black text-emerald-600">
              {pDelivered}%
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              ডেলিভার্ড
            </span>
          </div>
          <div className="border-x border-slate-200">
            <span className="block text-lg sm:text-xl font-black text-[#5064df]">
              {pConfirmed}%
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              কনফার্মড
            </span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-black text-amber-500">
              {pPending}%
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              পেন্ডিং
            </span>
          </div>
        </div>
      </div>

      {/* SVG Simple Pie Chart matching Annex */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Slice 1: Emerald (Delivered) */}
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="50"
              strokeDasharray={`${dash1} 157.08`}
              strokeDashoffset="0"
              className="hover:opacity-90 transition-opacity cursor-pointer"
            />
            {/* Slice 2: Indigo (Confirmed/Processing) */}
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="transparent"
              stroke="#5064df"
              strokeWidth="50"
              strokeDasharray={`${dash2} 157.08`}
              strokeDashoffset={`-${dash1}`}
              className="hover:opacity-90 transition-opacity cursor-pointer"
            />
            {/* Slice 3: Amber (Pending) */}
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="50"
              strokeDasharray={`${dash3} 157.08`}
              strokeDashoffset={`-${dash1 + dash2}`}
              className="hover:opacity-90 transition-opacity cursor-pointer"
            />
          </svg>

          {/* Direct Percentage Labels placed over the slices matching Annex screenshot */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="text-sm font-black text-slate-900 bg-white/90 px-2 py-0.5 rounded-full shadow-xs">
              {baseTotal} Orders
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-3 border-t border-slate-100 w-full mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            <span>ডেলিভার্ড ({pDelivered}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5064df]" />
            <span>কনফার্মড ({pConfirmed}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <span>পেন্ডিং ({pPending}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
