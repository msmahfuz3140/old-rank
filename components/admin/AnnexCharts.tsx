"use client";

import React, { useState } from "react";

// ==========================================
// 1. OVERLAPPING BARS ON MOBILE / SALES TREND
// ==========================================
export function SalesBarChart({
  marketplaceTotal = 365400,
  lastWeekTotal = 95400,
  lastMonthTotal = 846200,
}: {
  marketplaceTotal?: number;
  lastWeekTotal?: number;
  lastMonthTotal?: number;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const months = [
    { name: "Jan", bar1: 52, bar2: 35, val: "৳ ৬২,০০০" },
    { name: "Feb", bar1: 38, bar2: 45, val: "৳ ৫৪,০০০" },
    { name: "Mar", bar1: 65, bar2: 50, val: "৳ ৭৮,০০০" },
    { name: "Apr", bar1: 82, bar2: 60, val: "৳ ৯৮,০০০" },
    { name: "May", bar1: 48, bar2: 70, val: "৳ ৬৫,০০০" },
    { name: "Jun", bar1: 95, bar2: 80, val: "৳ ১,২০,০০০" },
    { name: "Jul", bar1: 58, bar2: 42, val: "৳ ৭২,০০০" },
    { name: "Aug", bar1: 74, bar2: 66, val: "৳ ৮৯,০০০" },
    { name: "Sep", bar1: 100, bar2: 85, val: "৳ ১,৩৫,০০০" },
    { name: "Oct", bar1: 86, bar2: 75, val: "৳ ১,০৫,০০০" },
    { name: "Nov", bar1: 68, bar2: 55, val: "৳ ৮৪,০০০" },
    { name: "Dec", bar1: 90, bar2: 78, val: "৳ ১,১৫,০০০" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-bold text-sm text-slate-800 tracking-tight">
            Overlapping bars on mobile (মাসভিত্তিক সেলস ও রেভিনিউ)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            This example makes use of label interpolation and the seriesBarDistance property that allows you to make bars overlap over each other.
          </p>
        </div>

        {/* 3 Metric Headers matching Annex */}
        <div className="grid grid-cols-3 gap-2 text-center py-2 mb-4 bg-slate-50/70 rounded-xl border border-slate-100">
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {marketplaceTotal > 1000 ? `৳ ${(marketplaceTotal / 100).toFixed(0)}` : marketplaceTotal}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Marketplace
            </span>
          </div>
          <div className="border-x border-slate-200">
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {lastWeekTotal > 1000 ? `৳ ${(lastWeekTotal / 100).toFixed(0)}` : lastWeekTotal}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Last week
            </span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {lastMonthTotal > 1000 ? `৳ ${(lastMonthTotal / 100).toFixed(0)}` : lastMonthTotal}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Last Month
            </span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="relative pt-2">
        {/* Y Axis Legend */}
        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mb-1 px-1">
          <span>10k</span>
          <span>7.5k</span>
          <span>5.0k</span>
          <span>2.5k</span>
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
            <span>মার্কেটপ্লেস সেলস</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#38bdf8]" />
            <span>সেলার ভেন্ডর রেভিনিউ</span>
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
  deliveredCount = 3654,
  processingCount = 954,
  pendingCount = 8462,
}: {
  deliveredCount?: number;
  processingCount?: number;
  pendingCount?: number;
}) {
  const quarters = [
    { name: "Q1", s1: 45, s2: 30, s3: 20 },
    { name: "Q2", s1: 70, s2: 40, s3: 35 },
    { name: "Q3", s1: 85, s2: 45, s3: 40 },
    { name: "Q4", s1: 95, s2: 50, s3: 45 },
    { name: "Q5", s1: 110, s2: 60, s3: 50 },
    { name: "Q6", s1: 90, s2: 45, s3: 38 },
  ];

  const maxVal = 230;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-bold text-sm text-slate-800 tracking-tight">
            Stacked bar chart (অর্ডার স্ট্যাক ও পাইপলাইন)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            You can also set your bar chart to stack the series bars on top of each other easily by using the stackBars property in your configuration.
          </p>
        </div>

        {/* 3 Metric Headers matching Annex */}
        <div className="grid grid-cols-3 gap-2 text-center py-2 mb-4 bg-slate-50/70 rounded-xl border border-slate-100">
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {deliveredCount}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Marketplace
            </span>
          </div>
          <div className="border-x border-slate-200">
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {processingCount}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Last week
            </span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {pendingCount}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Last Month
            </span>
          </div>
        </div>
      </div>

      {/* SVG Stacked Bar Chart */}
      <div className="relative pt-2">
        {/* Y Axis Legend */}
        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mb-1 px-1">
          <span>200k</span>
          <span>150k</span>
          <span>100k</span>
          <span>50k</span>
          <span>0k</span>
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
            {quarters.map((q, idx) => {
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
  cat1 = 3654,
  cat2 = 954,
  cat3 = 8462,
}: {
  cat1?: number;
  cat2?: number;
  cat3?: number;
}) {
  // 24 segments around the circle, exactly matching the Annex Donut screenshot
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
            Animating a Donut with Svg.animate (ক্যাটাগরি ডিস্ট্রিবিউশন)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Although it'd be also possible to achieve this animation with CSS, with some minor suboptimal things, here's an example of how to animate donut charts using Chartist.Svg.animate and SMIL.
          </p>
        </div>

        {/* 3 Metric Headers matching Annex */}
        <div className="grid grid-cols-3 gap-2 text-center py-2 mb-4 bg-slate-50/70 rounded-xl border border-slate-100">
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {cat1}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Marketplace
            </span>
          </div>
          <div className="border-x border-slate-200">
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {cat2}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Last week
            </span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {cat3}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Last Month
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
            <span className="text-xl font-black text-slate-800">100%</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Live Stock</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-500 pt-3 border-t border-slate-100 w-full mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>পাঞ্জাবি ও কুর্তা</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>টি-শার্ট ও শার্ট</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span>ডেনিম ও প্যান্ট</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span>ঘড়ি ও এক্সেসরিজ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. SIMPLE PIE CHART / PAYMENT & RETENTION
// ==========================================
export function CleanPieChart({
  p1 = 33,
  p2 = 42,
  p3 = 25,
}: {
  p1?: number;
  p2?: number;
  p3?: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-bold text-sm text-slate-800 tracking-tight">
            Simple pie chart (কাস্টমার ও পেমেন্ট অনুপাত)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            A very simple pie chart with label interpolation to show percentage instead of the actual data series value.
          </p>
        </div>

        {/* 3 Metric Headers matching Annex */}
        <div className="grid grid-cols-3 gap-2 text-center py-2 mb-4 bg-slate-50/70 rounded-xl border border-slate-100">
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {p1}%
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Marketplace
            </span>
          </div>
          <div className="border-x border-slate-200">
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {p2}%
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Last week
            </span>
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-800">
              {p3}%
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Last Month
            </span>
          </div>
        </div>
      </div>

      {/* SVG Simple Pie Chart matching Annex */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Slice 1: Dark Navy (33%) -> Path from 0 to 33% (118.8 deg) */}
            {/* Using SVG circle dasharray for pixel-perfect standard Pie */}
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="transparent"
              stroke="#0f172a"
              strokeWidth="50"
              strokeDasharray="51.84 157.08"
              strokeDashoffset="0"
              className="hover:opacity-90 transition-opacity cursor-pointer"
            />
            {/* Slice 2: Indigo (42%) -> Next 42% */}
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="transparent"
              stroke="#5064df"
              strokeWidth="50"
              strokeDasharray="65.97 157.08"
              strokeDashoffset="-51.84"
              className="hover:opacity-90 transition-opacity cursor-pointer"
            />
            {/* Slice 3: Amber/Gold (25%) -> Next 25% */}
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="50"
              strokeDasharray="39.27 157.08"
              strokeDashoffset="-117.81"
              className="hover:opacity-90 transition-opacity cursor-pointer"
            />
          </svg>

          {/* Direct Percentage Labels placed over the slices matching Annex screenshot */}
          <div className="absolute inset-0 pointer-events-none">
            {/* 33% label over navy top-left */}
            <span className="absolute top-[28%] left-[26%] text-white text-xs font-black drop-shadow">
              33%
            </span>
            {/* 42% label over indigo right */}
            <span className="absolute top-[38%] right-[24%] text-white text-xs font-black drop-shadow">
              42%
            </span>
            {/* 25% label over amber bottom */}
            <span className="absolute bottom-[20%] left-[42%] text-slate-900 text-xs font-black drop-shadow">
              25%
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-3 border-t border-slate-100 w-full mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0f172a]" />
            <span>রিটার্নিং কাস্টমার (৩৩%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5064df]" />
            <span>ক্যাশ অন ডেলিভারি (৪২%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <span>নতুন ভিজিটর (২৫%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
