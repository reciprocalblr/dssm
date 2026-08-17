/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  IndianRupee,
  Users,
  Receipt,
  TrendingDown,
  ArrowUpRight,
  Calendar,
  Clock,
  AlertCircle,
  Plus,
  ArrowDownCircle,
  TrendingUp,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Printer,
} from "lucide-react";
import {
  Devotee,
  Seva,
  Bill,
  Expense,
  AccountLedger,
  SystemUser,
} from "../types";
import { useLanguage } from "../context/LanguageContext";
import { getWelcomeGreeting, transliterateOperatorName } from "../utils/kannadaTranslit";

interface DashboardTabProps {
  devotees: Devotee[];
  sevas: Seva[];
  bills: Bill[];
  expenses: Expense[];
  ledger: AccountLedger;
  setCurrentTab: (tab: string) => void;
  currentUser: SystemUser | null;
  onQuickAddDevotee: () => void;
  onQuickAddExpense: () => void;
  onQuickBill: () => void;
  setActiveBillForReceiptModal: (bill: Bill) => void;
  cartItems: {
    seva: Seva;
    count: number;
    customPrice?: number;
    pujariDakshina: number;
    overrideDevoteeName?: string;
    overrideGothra?: string;
    overrideNakshatra?: string;
  }[];
  setCartItems: (
    items: {
      seva: Seva;
      count: number;
      customPrice?: number;
      pujariDakshina: number;
      overrideDevoteeName?: string;
      overrideGothra?: string;
      overrideNakshatra?: string;
    }[],
  ) => void;
}

export default function DashboardTab({
  devotees,
  sevas,
  bills,
  expenses,
  ledger,
  setCurrentTab,
  currentUser,
  onQuickAddDevotee,
  onQuickAddExpense,
  onQuickBill,
  setActiveBillForReceiptModal,
  cartItems,
  setCartItems,
}: DashboardTabProps) {
  const { t, language, setLanguage } = useLanguage();
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    label: string;
    value: string;
  } | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic greeting helper based on time and selected language mode (with automatic bidirectional name transliteration)
  const getGreeting = () => {
    return getWelcomeGreeting(currentUser?.name, language, currentDateTime);
  };

  // Filter for today's transactions (we'll look at transactions dynamically based on the system date)
  const SYSTEM_TODAY = new Date().toISOString().split("T")[0];

  const todayBills = bills.filter(
    (b) => b.createdAt.startsWith(SYSTEM_TODAY) && !b.isCancelled,
  );
  const todayBillAmount = todayBills.reduce(
    (acc, curr) => acc + curr.grandTotal,
    0,
  );
  const todayBillCount = todayBills.length;

  const todaySevaCounts = todayBills.reduce(
    (acc: { [sevaName: string]: number }, b) => {
      b.items.forEach((item) => {
        acc[item.sevaName] = (acc[item.sevaName] || 0) + item.count;
      });
      return acc;
    },
    {},
  );

  const todayTotalSevasCount = Object.values(todaySevaCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  const todayCashAmount = todayBills
    .filter((b) => b.paymentMode === "Cash")
    .reduce((acc, curr) => acc + curr.grandTotal, 0);
  const todayCashCount = todayBills.filter(
    (b) => b.paymentMode === "Cash",
  ).length;

  const todayUpiAmount = todayBills
    .filter((b) => b.paymentMode === "UPI")
    .reduce((acc, curr) => acc + curr.grandTotal, 0);
  const todayUpiCount = todayBills.filter(
    (b) => b.paymentMode === "UPI",
  ).length;

  const todayExpenses = expenses.filter((e) => e.date.startsWith(SYSTEM_TODAY));
  const todayExpenseAmount = todayExpenses.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  // Week billing (last 7 days dynamically ending with today)
  const getWeeklyCollectionData = () => {
    const dateStrings: string[] = [];
    const days: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dateStrings.push(d.toISOString().split("T")[0]);
      days.push(
        d.toLocaleDateString(language === "kn" ? "kn-IN" : "en-US", {
          weekday: "short",
        }),
      );
    }

    return dateStrings.map((dateStr, idx) => {
      const dayBills = bills.filter(
        (b) => b.createdAt.startsWith(dateStr) && !b.isCancelled,
      );
      const amount = dayBills.reduce((acc, b) => acc + b.grandTotal, 0);
      return { day: days[idx], amount, date: dateStr };
    });
  };

  const weeklyData = getWeeklyCollectionData();
  const maxWeeklyAmount = Math.max(...weeklyData.map((d) => d.amount), 500);

  // Today Special Poojas queue
  const activeQueue = bills
    .filter((b) => !b.isCancelled)
    .flatMap((b) =>
      b.items.map((item) => ({
        billId: b.id,
        devoteeName: b.devoteeName,
        gothra: b.gothra || "N/A",
        nakshatra: b.nakshatra || "N/A",
        sevaName: item.sevaName,
        pujariDakshina: item.pujariDakshina,
        createdAt: b.createdAt,
        paymentMode: b.paymentMode,
      })),
    )
    .filter((item) => item.createdAt.startsWith(SYSTEM_TODAY))
    .slice(0, 5);

  // Seva breakdown chart calculations (top sevas)
  const getSevaBreakdownData = () => {
    const counts: { [name: string]: { count: number; total: number } } = {};
    bills
      .filter((b) => !b.isCancelled)
      .forEach((b) => {
        b.items.forEach((item) => {
          if (!counts[item.sevaName]) {
            counts[item.sevaName] = { count: 0, total: 0 };
          }
          counts[item.sevaName].count += item.count;
          counts[item.sevaName].total += item.price * item.count;
        });
      });
    return Object.entries(counts)
      .map(([name, stat]) => ({ name, count: stat.count, total: stat.total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  };

  const sevaStats = getSevaBreakdownData();

  // Booking counts trend helper for Chart 3
  const getWeeklyBookingCountData = () => {
    const dateStrings: string[] = [];
    const days: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dateStrings.push(d.toISOString().split("T")[0]);
      days.push(
        d.toLocaleDateString(language === "kn" ? "kn-IN" : "en-US", {
          weekday: "short",
        }),
      );
    }

    return dateStrings.map((dateStr, idx) => {
      const dayBills = bills.filter(
        (b) => b.createdAt.startsWith(dateStr) && !b.isCancelled,
      );
      const count = dayBills.length;
      return { day: days[idx], count, date: dateStr };
    });
  };

  const weeklyCountData = getWeeklyBookingCountData();
  const maxWeeklyCount = Math.max(...weeklyCountData.map((d) => d.count), 5);

  const isAdmin = currentUser?.role === "Administrator";

  return (
    <div className="space-y-6 relative z-0 pb-10" id="dashboard-tab">
      {/* Shirdi Sai Baba Watermark Background */}
      <div 
        className="absolute inset-x-0 top-12 bottom-12 pointer-events-none -z-20 flex items-center justify-center overflow-hidden opacity-[0.06] select-none"
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/e1/62/17/e162178c238776427b0467adaf78e1fc.jpg')",
          backgroundPosition: "center 35%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "min(380px, 80vw)",
          mixBlendMode: "multiply",
        }}
      />

      {/* 1. UPPER WELCOME CARD IN ORIGINAL FORMAT (INTACT) */}
      <div className="relative group overflow-hidden rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-md p-6 md:p-8 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-6 isolate">
        {/* Soft Colorful Multiple Saffron Wave Vector with Continuous Animations */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-full -z-10 opacity-70 group-hover:opacity-90 transition-all duration-500 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Wave 1: Radiant Flame (Vermilion Red, Saffron, Amber & Coral) */}
            <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff3d00" stopOpacity="0.45" />
              <stop offset="35%" stopColor="#ff7a00" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.4" />
            </linearGradient>
            {/* Wave 2: Sacred Kumkuma Ruby & Deep Saffron Coral */}
            <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e11d48" stopOpacity="0.35" />
              <stop offset="40%" stopColor="#ea580c" stopOpacity="0.45" />
              <stop offset="75%" stopColor="#f97316" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
            </linearGradient>
            {/* Wave 3: Golden Turmeric & Sunshine Marigold */}
            <linearGradient id="wave-grad-3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#facc15" stopOpacity="0.25" />
              <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="80%" stopColor="#fbbf24" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.2" />
            </linearGradient>
            {/* Wave 4: Sunset Lotus Rose & Warm Amber Coral */}
            <linearGradient id="wave-grad-4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.18" />
              <stop offset="35%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#ff7a00" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          {/* Wave 4 (Backmost Layer - Lotus Sunset Rose) */}
          <path
            fill="url(#wave-grad-4)"
            className="animate-wave-4"
            d="M-300,80 C-150,110 0,140 150,120 C300,100 450,160 600,150 C750,140 900,90 1050,130 C1200,170 1350,110 1500,100 C1650,90 1800,120 1950,100 L1950,340 L-300,340 Z"
          />
          {/* Wave 3 (Mid-Back Layer - Golden Turmeric) */}
          <path
            fill="url(#wave-grad-3)"
            className="animate-wave-3"
            d="M-300,140 C-150,170 0,190 150,160 C300,130 450,120 600,150 C750,180 900,210 1050,170 C1200,130 1350,170 1500,160 C1650,150 1800,175 1950,150 L1950,340 L-300,340 Z"
          />
          {/* Wave 2 (Mid-Front Layer - Kumkuma Ruby) */}
          <path
            fill="url(#wave-grad-2)"
            className="animate-wave-2"
            d="M-300,190 C-150,220 0,180 150,200 C300,220 450,250 600,220 C750,190 900,160 1050,200 C1200,240 1350,210 1500,190 C1650,170 1800,210 1950,200 L1950,340 L-300,340 Z"
          />
          {/* Wave 1 (Frontmost Layer - Radiant Saffron Flame) */}
          <path
            fill="url(#wave-grad-1)"
            className="animate-wave-1"
            d="M-300,230 C-150,200 0,150 150,170 C300,190 450,210 600,180 C750,150 900,120 1050,160 C1200,200 1350,140 1500,160 C1650,180 1800,150 1950,170 L1950,340 L-300,340 Z"
          />
        </svg>

        {/* Subtle glow and watermark pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#ff7a00]/5 via-transparent to-red-500/5 -z-10 opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ff7a001a_1.2px,transparent_1.2px)] [background-size:20px_20px] -z-10 pointer-events-none" />

        {/* Traditional Temple Entrance Saffron Side-Accent */}
        <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-b from-orange-600 via-[#ff7a00] to-amber-500 rounded-l-3xl shadow-sm" />

        <div className="relative z-10 pl-3 md:pl-5 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Animated Sacred AUM Emblem Logo with Language Conversion */}
            <div className="relative flex items-center justify-center shrink-0 my-0.5">
              {/* Soft Ambient Radial Aura */}
              <div className="absolute -inset-3 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,122,0,0.32)_0%,rgba(255,193,7,0.12)_65%,transparent_100%)] animate-pulse pointer-events-none" />

              {/* Precise Vector Spinning Dashed Ring Halo */}
              <svg
                className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] animate-halo-spin pointer-events-none text-[#ff7a00]/50"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </svg>

              {/* Counter-rotating Inner Dotted Ring */}
              <svg
                className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] animate-halo-spin-rev pointer-events-none text-amber-500/60"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="2 4"
                  strokeLinecap="round"
                />
              </svg>

              {/* Circular Medallion AUM Container with Interactive Language Flip */}
              <button
                type="button"
                onClick={() => setLanguage(language === "en" ? "kn" : "en")}
                title={language === "en" ? "Switch Language to Kannada (ಕನ್ನಡ)" : "Switch Language to English"}
                className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-[#ff7a00] to-orange-500 border border-amber-200/90 shadow-md shadow-orange-500/30 flex items-center justify-center text-white font-bold animate-aum-glow select-none cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 group"
              >
                {language === "kn" ? (
                  <span className="font-kannada-serif text-2xl sm:text-3xl font-black leading-none drop-shadow-sm transition-all duration-300">
                    ಓಂ
                  </span>
                ) : (
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold leading-none drop-shadow-sm transition-all duration-300">
                    ॐ
                  </span>
                )}
              </button>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#ff7a00] bg-white border border-slate-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#ff7a00] animate-ping" />
                <span>{t("dash.activeTerminal")}</span>
                <span className="text-slate-300 font-normal">|</span>
                <button
                  type="button"
                  onClick={() => setLanguage(language === "en" ? "kn" : "en")}
                  className="text-[10px] font-extrabold text-amber-700 hover:text-orange-600 cursor-pointer transition-colors"
                >
                  {language === "en" ? "ಕನ್ನಡ" : "ENGLISH"}
                </button>
              </div>
              <h1
                className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
                  language === "kn" ? "font-kannada-serif" : "font-display"
                } text-slate-800 pr-4 leading-tight`}
              >
                {getGreeting()}
              </h1>
            </div>
          </div>

          <div className="text-xs font-black text-slate-500 py-0.5 font-display flex items-start gap-1.5 leading-relaxed">
            <span className="text-[#ff7a00] mt-0.5">❖</span>
            <div>
              <span className="block">{t("brand.addressWelcomeLine1")}</span>
              <span className="block">{t("brand.addressWelcomeLine2")}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center bg-white border border-slate-200 py-2.5 px-4 rounded-2xl gap-3.5 text-xs shadow-sm relative z-10 select-none mr-2">
          {/* Calendar Day Block */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-50 rounded-xl flex items-center justify-center text-amber-600 scale-100 border border-slate-200">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-amber-600 font-extrabold text-[10px] uppercase tracking-wider leading-none mb-0.5">
                {currentDateTime.toLocaleDateString(
                  language === "kn" ? "kn-IN" : "en-US",
                  { weekday: "long" },
                )}
              </span>
              <span className="text-slate-700 font-bold text-xs leading-none">
                {currentDateTime.toLocaleDateString(
                  language === "kn" ? "kn-IN" : "en-US",
                  { month: "short", day: "numeric", year: "numeric" },
                )}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* Time Clock Block */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider leading-none mb-0.5">
                {language === "kn" ? "ಸಮಯ" : "TIME (IST)"}
              </span>
              <span className="tabular-nums text-amber-600 font-extrabold tracking-tight text-[13px] leading-none">
                {currentDateTime.toLocaleTimeString(
                  language === "kn" ? "kn-IN" : "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  },
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS CARDS (MATERIAL FLOATING STATS OVERLAY STYLE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
        {isAdmin ? (
          <>
            {/* Stat Card 1: Bookings / Registered Sevas */}
            <div className="relative bg-white rounded-xl shadow-md border border-slate-100 p-5 mt-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-5 left-4 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 shadow-orange-500/30">
                <Receipt className="w-5.5 h-5.5" />
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">
                  {t("dash.totalSevasBookedToday")}
                </p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                  {todayTotalSevasCount}
                </h3>
              </div>
              <div className="border-t border-slate-100 mt-4 pt-3 flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                <TrendingUp className="w-4 h-4 text-emerald-500 animate-bounce" />
                <span>
                  {todayBillCount} {t("dash.recentInvoices")}
                </span>
              </div>
            </div>

            {/* Stat Card 2: Today's Income */}
            <div className="relative bg-white rounded-xl shadow-md border border-slate-100 p-5 mt-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-5 left-4 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-blue-500/30">
                <IndianRupee className="w-5.5 h-5.5" />
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">
                  {t("dash.todaysIncome")}
                </p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                  ₹ {todayBillAmount.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="border-t border-slate-100 mt-4 pt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500 font-bold">
                <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md">
                  Cash: ₹{todayCashAmount.toLocaleString("en-IN")}
                </span>
                <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md">
                  UPI: ₹{todayUpiAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Stat Card 3: Expenses */}
            <div className="relative bg-white rounded-xl shadow-md border border-slate-100 p-5 mt-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-5 left-4 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-tr from-rose-500 to-rose-600 shadow-rose-500/30">
                <ArrowDownCircle className="w-5.5 h-5.5" />
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">
                  {t("dash.expenseTotal")}
                </p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                  ₹ {todayExpenseAmount.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="border-t border-slate-100 mt-4 pt-3 flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{todayExpenses.length} entries recorded today</span>
              </div>
            </div>

            {/* Stat Card 4: Counter Cash status */}
            <div className="relative bg-white rounded-xl shadow-md border border-slate-100 p-5 mt-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-5 left-4 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/30">
                <TrendingUp className="w-5.5 h-5.5" />
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">
                  {t("dash.cashInHand")}
                </p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                  ₹ {ledger.cashInHand.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                <span className="truncate">
                  Bank: ₹{ledger.bankBalance.toLocaleString("en-IN")}
                </span>
                <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase">
                  {t("dash.active")}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Stat Card 1: Registered Devotees */}
            <div className="relative bg-white rounded-xl shadow-md border border-slate-100 p-5 mt-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-5 left-4 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-blue-500/30">
                <Users className="w-5.5 h-5.5" />
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">
                  {language === "kn" ? "ನೋಂದಾಯಿತ ಭಕ್ತರು" : "Registered Devotees"}
                </p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                  {devotees.length}
                </h3>
              </div>
              <div className="border-t border-slate-100 mt-4 pt-3 flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>{language === "kn" ? "ಸಕ್ರಿಯ ಭಕ್ತರ ಡೈರೆಕ್ಟರಿ" : "Active devotee directory"}</span>
              </div>
            </div>

            {/* Stat Card 2: Offered Seva Rituals */}
            <div className="relative bg-white rounded-xl shadow-md border border-slate-100 p-5 mt-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-5 left-4 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 shadow-orange-500/30">
                <Bookmark className="w-5.5 h-5.5" />
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">
                  {language === "kn" ? "ಲಭ್ಯವಿರುವ ಸೇವೆಗಳು" : "Active Seva Offerings"}
                </p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                  {sevas.filter((s) => s.isActive).length}
                </h3>
              </div>
              <div className="border-t border-slate-100 mt-4 pt-3 flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{language === "kn" ? "ಸೇವೆಗಳು ಸಕ್ರಿಯವಾಗಿವೆ" : "Sevas open for booking"}</span>
              </div>
            </div>

            {/* Stat Card 3: Sankalpa Queue */}
            <div className="relative bg-white rounded-xl shadow-md border border-slate-100 p-5 mt-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-5 left-4 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 shadow-orange-500/30">
                <Clock className="w-5.5 h-5.5" />
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">
                  {language === "kn" ? "ಸಂಕಲ್ಪ ಸಾಲು" : "Active Sankalpa Queue"}
                </p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                  {activeQueue.length}
                </h3>
              </div>
              <div className="border-t border-slate-100 mt-4 pt-3 flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{language === "kn" ? "ಇಂದಿನ ಪೂಜೆಗಳು" : "Scheduled rituals for today"}</span>
              </div>
            </div>

            {/* Stat Card 4: Terminal Operator Status */}
            <div className="relative bg-white rounded-xl shadow-md border border-slate-100 p-5 mt-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-5 left-4 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/30">
                <CheckCircle2 className="w-5.5 h-5.5" />
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">
                  {language === "kn" ? "ಸಕ್ರಿಯ ಆಪರೇಟರ್" : "Terminal Operator"}
                </p>
                <h3 className="text-xl font-extrabold text-slate-800 truncate mt-1">
                  {transliterateOperatorName(currentUser?.name, language)}
                </h3>
              </div>
              <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                <span>{currentUser?.role || "Staff"}</span>
                <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase">
                  {t("dash.active")}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. QUICK OPERATIONS PANEL */}
      <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5 relative overflow-hidden">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5 select-none">
          <Bookmark className="w-4 h-4 text-[#ff7a00]" />
          <span>Quick Desk Operations</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: New Bill */}
          <button
            id="btn-quick-bill"
            onClick={onQuickBill}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#ff7a00]/40 bg-slate-50/50 hover:bg-white text-slate-800 shadow-3xs hover:shadow-sm transition-all duration-200 group cursor-pointer focus:outline-hidden"
          >
            <div>
              <p className="text-[9px] text-[#ff7a00] font-black uppercase tracking-widest">
                Seva Desk Step 1
              </p>
              <h4 className="font-display font-bold text-xs mt-1 text-slate-700 group-hover:text-[#ff7a00] transition-colors">
                {t("dash.newBooking")}
              </h4>
            </div>
            <div className="w-9 h-9 bg-orange-50 rounded-lg group-hover:bg-[#ff7a00] group-hover:text-white transition-all text-[#ff7a00] flex items-center justify-center shadow-3xs">
              <Receipt className="w-4.5 h-4.5" />
            </div>
          </button>

          {/* Card 2: Add Devotee */}
          <button
            id="btn-quick-devotee"
            onClick={onQuickAddDevotee}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-500/40 bg-slate-50/50 hover:bg-white text-slate-800 shadow-3xs hover:shadow-sm transition-all duration-200 group cursor-pointer focus:outline-hidden"
          >
            <div>
              <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">
                Devotee Directory
              </p>
              <h4 className="font-display font-bold text-xs mt-1 text-slate-700 group-hover:text-blue-500 transition-colors">
                {t("dash.addDevotee")}
              </h4>
            </div>
            <div className="w-9 h-9 bg-blue-50 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-all text-blue-500 flex items-center justify-center shadow-3xs">
              <Users className="w-4.5 h-4.5" />
            </div>
          </button>

          {/* Card 3: Record Outgoing */}
          <button
            id="btn-quick-expense"
            onClick={onQuickAddExpense}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-rose-500/40 bg-slate-50/50 hover:bg-white text-slate-800 shadow-3xs hover:shadow-sm transition-all duration-200 group cursor-pointer focus:outline-hidden"
          >
            <div>
              <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest">
                Expenditure log
              </p>
              <h4 className="font-display font-bold text-xs mt-1 text-slate-700 group-hover:text-rose-500 transition-colors">
                {t("dash.addExpense")}
              </h4>
            </div>
            <div className="w-9 h-9 bg-rose-50 rounded-lg group-hover:bg-rose-500 group-hover:text-white transition-all text-rose-500 flex items-center justify-center shadow-3xs">
              <ArrowDownCircle className="w-4.5 h-4.5" />
            </div>
          </button>
        </div>
      </div>

      {/* 4. CHARTS PANEL (3-CHART ROW REPLICATING WEBSITE VIEWS, DAILY SALES & COMPLETED TASKS) */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Chart 1: Website Views Style -> Weekly Collections Trend (Blue) */}
        <div className="relative bg-white rounded-xl shadow-md border border-slate-100 p-4 pt-0 mt-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
          <div className="relative -top-6 mx-2 rounded-xl shadow-lg h-44 p-4 flex flex-col justify-end bg-linear-to-tr from-blue-500 to-blue-600 shadow-blue-500/30">
            {/* SVG Bar Chart */}
            <svg className="w-full h-full" viewBox="0 0 400 130">
              {/* Dashed lines */}
              <line x1="30" y1="20" x2="370" y2="20" stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="4" />
              <line x1="30" y1="60" x2="370" y2="60" stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="4" />
              <line x1="30" y1="100" x2="370" y2="100" stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="4" />

              {/* Bars */}
              {weeklyData.map((d, idx) => {
                const barWidth = 14;
                const x = 43 + idx * 47;
                const h = maxWeeklyAmount > 0 ? (d.amount / maxWeeklyAmount) * 80 : 5;
                const y = 100 - h;
                return (
                  <g key={d.day} className="group/bar cursor-pointer">
                    {/* Hover hotspot */}
                    <rect
                      x={x - 6}
                      y="10"
                      width={barWidth + 12}
                      height="100"
                      fill="transparent"
                      onMouseEnter={(e) => {
                        const target = e.currentTarget.getBoundingClientRect();
                        setHoveredPoint({
                          x: target.left - 50,
                          y: target.top - 80,
                          label: `${d.day} (${d.date})`,
                          value: `₹ ${d.amount.toLocaleString("en-IN")}`,
                        });
                      }}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={h}
                      fill="rgba(255, 255, 255, 0.85)"
                      rx="3"
                      className="transition-all duration-300 group-hover/bar:fill-white"
                    />
                    <text x={x + barWidth / 2} y="118" fill="rgba(255, 255, 255, 0.7)" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="px-2 pb-2">
            <h4 className="text-sm font-bold text-slate-800 font-display">Weekly Collections</h4>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Active bookings
              </span>
              financial distribution
            </p>
            <div className="border-t border-slate-100 mt-4 pt-3 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Real-time counter transactions</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Daily Sales Style -> Daily Income Trend (Green) */}
        <div className="relative bg-white rounded-xl shadow-md border border-slate-100 p-4 pt-0 mt-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
          <div className="relative -top-6 mx-2 rounded-xl shadow-lg h-44 p-4 flex flex-col justify-end bg-linear-to-tr from-emerald-500 to-emerald-600 shadow-emerald-500/30">
            {/* SVG Line Chart */}
            <svg className="w-full h-full" viewBox="0 0 400 130">
              {/* Dashed lines */}
              <line x1="30" y1="20" x2="370" y2="20" stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="4" />
              <line x1="30" y1="60" x2="370" y2="60" stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="4" />
              <line x1="30" y1="100" x2="370" y2="100" stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="4" />

              {/* Path calculation */}
              {(() => {
                const points = weeklyData.map((d, idx) => {
                  const x = 47 + idx * 47;
                  const h = maxWeeklyAmount > 0 ? (d.amount / maxWeeklyAmount) * 80 : 0;
                  const y = 100 - h;
                  return { x, y, day: d.day, date: d.date, value: d.amount };
                });

                const dPath = points.reduce((acc, p, idx) => {
                  return idx === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
                }, "");

                return (
                  <>
                    <path
                      d={dPath}
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {points.map((p, idx) => (
                      <g key={idx} className="group/dot cursor-pointer">
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="12"
                          fill="transparent"
                          onMouseEnter={(e) => {
                            const target = e.currentTarget.getBoundingClientRect();
                            setHoveredPoint({
                              x: target.left - 50,
                              y: target.top - 80,
                              label: `${p.day} (${p.date})`,
                              value: `₹ ${p.value.toLocaleString("en-IN")}`,
                            });
                          }}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="3.5"
                          fill="white"
                          stroke="rgba(255, 255, 255, 0.4)"
                          strokeWidth="3"
                          className="transition-all duration-200 group-hover/dot:r-5"
                        />
                        <text x={p.x} y="118" fill="rgba(255, 255, 255, 0.7)" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                          {p.day}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
          <div className="px-2 pb-2">
            <h4 className="text-sm font-bold text-slate-800 font-display">Daily Sales Amount</h4>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-500 font-bold flex items-center gap-0.5 animate-pulse">
                <TrendingUp className="w-3.5 h-3.5" />
                ₹ {todayBillAmount.toLocaleString("en-IN")}
              </span>
              today accumulated income
            </p>
            <div className="border-t border-slate-100 mt-4 pt-3 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Last 7 days performance charts</span>
            </div>
          </div>
        </div>

        {/* Chart 3: Completed Tasks Style -> Daily Bookings Volume (Dark Slate) */}
        <div className="relative bg-white rounded-xl shadow-md border border-slate-100 p-4 pt-0 mt-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
          <div className="relative -top-6 mx-2 rounded-xl shadow-lg h-44 p-4 flex flex-col justify-end bg-gradient-to-tr from-amber-600 via-[#ff7a00] to-amber-700 shadow-orange-500/30">
            {/* SVG Line Chart */}
            <svg className="w-full h-full" viewBox="0 0 400 130">
              {/* Dashed lines */}
              <line x1="30" y1="20" x2="370" y2="20" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="4" />
              <line x1="30" y1="60" x2="370" y2="60" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="4" />
              <line x1="30" y1="100" x2="370" y2="100" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="4" />

              {/* Path calculation */}
              {(() => {
                const points = weeklyCountData.map((d, idx) => {
                  const x = 47 + idx * 47;
                  const h = maxWeeklyCount > 0 ? (d.count / maxWeeklyCount) * 80 : 0;
                  const y = 100 - h;
                  return { x, y, day: d.day, date: d.date, value: d.count };
                });

                const dPath = points.reduce((acc, p, idx) => {
                  return idx === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
                }, "");

                return (
                  <>
                    <path
                      d={dPath}
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {points.map((p, idx) => (
                      <g key={idx} className="group/dot cursor-pointer">
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="12"
                          fill="transparent"
                          onMouseEnter={(e) => {
                            const target = e.currentTarget.getBoundingClientRect();
                            setHoveredPoint({
                              x: target.left - 50,
                              y: target.top - 80,
                              label: `${p.day} (${p.date})`,
                              value: `${p.value} Bookings`,
                            });
                          }}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="3.5"
                          fill="white"
                          stroke="rgba(255, 255, 255, 0.4)"
                          strokeWidth="3"
                          className="transition-all duration-200 group-hover/dot:r-5"
                        />
                        <text x={p.x} y="118" fill="rgba(255, 255, 255, 0.7)" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                          {p.day}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
          <div className="px-2 pb-2">
            <h4 className="text-sm font-bold text-slate-800 font-display">Completed Bookings</h4>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {todayTotalSevasCount} total sevas
              </span>
              successfully executed
            </p>
            <div className="border-t border-slate-100 mt-4 pt-3 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Real-time desk performance sync</span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Custom Tooltip Overlay */}
      {hoveredPoint && (
        <div
          className="fixed z-50 bg-[#1e293b]/95 border border-slate-700 text-white backdrop-blur-md rounded-xl p-3 text-xs shadow-xl pointer-events-none transition-all duration-150 animate-fade-in"
          style={{
            left: `${hoveredPoint.x}px`,
            top: `${hoveredPoint.y}px`,
          }}
        >
          <p className="font-bold text-slate-300">{hoveredPoint.label}</p>
          <p className="text-[#ff7a00] font-black text-sm mt-0.5">
            {hoveredPoint.value}
          </p>
        </div>
      )}

      {/* 5. TWO COLUMN PANEL: PROJECTS STYLE TABLE & TIMELINE STYLE QUEUE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left column -> Popular Temple Sevas (Projects style) / Recently Registered Devotees */}
        {isAdmin ? (
          <div className="lg:col-span-7 bg-white rounded-xl shadow-md border border-slate-100 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-800 font-display">
                    {language === "kn" ? "ಜನಪ್ರಿಯ ಸೇವೆಗಳು" : "Popular Temple Sevas"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Top offerings ranked by total booking contributions</span>
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[450px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 pl-2">SEVA NAME</th>
                      <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">BOOKINGS</th>
                      <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">COLLECTION</th>
                      <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 pr-2">POPULARITY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sevaStats.map((stat, idx) => {
                      const maxTotal = sevaStats[0]?.total || 100;
                      const per = (stat.total / maxTotal) * 100;
                      const bulletColors = [
                        "bg-[#ff7a00]",
                        "bg-[#3b82f6]",
                        "bg-[#10b981]",
                        "bg-[#ec4899]"
                      ];
                      const bulletColor = bulletColors[idx % bulletColors.length];
                      return (
                        <tr key={stat.name} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 pl-2 flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full ${bulletColor} shrink-0`} />
                            <span className="text-xs font-bold text-slate-800 truncate max-w-[200px]" title={stat.name}>
                              {stat.name}
                            </span>
                          </td>
                          <td className="py-4 text-center text-xs font-extrabold text-slate-600">
                            {stat.count}
                          </td>
                          <td className="py-4 text-center text-xs font-black text-[#ff7a00]">
                            ₹ {stat.total.toLocaleString("en-IN")}
                          </td>
                          <td className="py-4 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 min-w-[28px] text-right">
                                {Math.round(per)}%
                              </span>
                              <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${bulletColor}`}
                                  style={{ width: `${per}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center text-xs text-slate-500">
              <span>Sorted by performance contributions</span>
              <button
                onClick={() => setCurrentTab("reports")}
                className="text-[#ff7a00] hover:text-[#ff9033] font-bold flex items-center gap-0.5 hover:underline"
              >
                <span>Detailed ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-xl shadow-md border border-slate-100 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-800 font-display">
                    {language === "kn" ? "ಇತ್ತೀಚಿನ ಭಕ್ತರು" : "Recently Registered Devotees"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>Latest devotees added to the system directory</span>
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[450px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 pl-2">DEVOTEE NAME</th>
                      <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">GOTHRA</th>
                      <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">NAKSHATRA</th>
                      <th className="py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 pr-2 text-right">DATE ADDED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {devotees.slice(-4).reverse().map((devotee, idx) => {
                      const bulletColors = [
                        "bg-[#3b82f6]",
                        "bg-[#ff7a00]",
                        "bg-[#10b981]",
                        "bg-[#ec4899]"
                      ];
                      const bulletColor = bulletColors[idx % bulletColors.length];
                      return (
                        <tr key={devotee.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 pl-2">
                            <div className="flex items-center gap-3">
                              <span className={`w-2.5 h-2.5 rounded-full ${bulletColor} shrink-0`} />
                              <div>
                                <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                                  {devotee.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                  {devotee.phone || "No phone"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 text-center text-xs font-bold text-slate-600">
                            {devotee.gothra || "N/A"}
                          </td>
                          <td className="py-3.5 text-center text-xs font-bold text-[#ff7a00]">
                            {devotee.nakshatra || "N/A"}
                          </td>
                          <td className="py-3.5 pr-2 text-right text-[11px] font-semibold text-slate-400">
                            {devotee.createdAt ? devotee.createdAt.split('T')[0] : "Recently"}
                          </td>
                        </tr>
                      );
                    })}
                    {devotees.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-xs font-bold text-slate-400">
                          No devotees registered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center text-xs text-slate-500">
              <span>Showing up to 4 recent entries</span>
              <button
                onClick={() => setCurrentTab("devotees")}
                className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-0.5 hover:underline"
              >
                <span>View Full Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Right column -> Daily Sankalpa Queue (Orders overview style) */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-md border border-slate-100 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-black text-slate-800 font-display">
                  Daily Sankalpa Queue
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active sevas booked for today</span>
                </p>
              </div>
            </div>

            {activeQueue.length === 0 ? (
              <div className="py-14 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-12 h-12 text-slate-300 stroke-[1.5]" />
                <p className="text-slate-500 text-sm mt-3 font-bold">
                  Sankalpa queue cleared
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Book a new ritual from the primary desk.
                </p>
              </div>
            ) : (
              <div className="relative border-l border-slate-200 ml-3.5 pl-6 space-y-6 py-2">
                {activeQueue.map((item, index) => {
                  const bulletColors = [
                    "border-[#ff7a00] bg-orange-50 text-[#ff7a00]",
                    "border-[#3b82f6] bg-blue-50 text-[#3b82f6]",
                    "border-[#10b981] bg-emerald-50 text-[#10b981]",
                    "border-[#ec4899] bg-pink-50 text-[#ec4899]",
                    "border-[#f59e0b] bg-amber-50 text-[#f59e0b]"
                  ];
                  const colorClass = bulletColors[index % bulletColors.length];
                  return (
                    <div key={`${item.billId}-${index}`} className="relative group flex items-start justify-between gap-3">
                      {/* Timeline node dot */}
                      <div className={`absolute -left-[31.5px] top-0.5 w-3 h-3 rounded-full border-2 border-white ${colorClass.split(' ')[0]} bg-white shadow-xs z-10 transition-transform duration-200 group-hover:scale-120`} />
                      
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                          {item.devoteeName} ({item.gothra})
                        </p>
                        <h4 className="text-xs font-bold text-slate-800 mt-0.5 line-clamp-1" title={item.sevaName}>
                          {item.sevaName}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">
                          via {item.paymentMode} • {item.createdAt.split('T')[1]?.substring(0, 5) || "Today"}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const bill = bills.find((b) => b.id === item.billId);
                          if (bill) setActiveBillForReceiptModal(bill);
                        }}
                        className="p-1.5 bg-slate-50 border border-slate-100 hover:bg-[#ff7a00]/10 hover:border-[#ff7a00]/30 hover:text-[#ff7a00] text-slate-400 rounded-lg shrink-0 cursor-pointer transition-all"
                        title="View & Re-print ticket"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 text-center">
            <button
              onClick={() => setCurrentTab("billing")}
              className="text-[#ff7a00] hover:text-orange-600 text-xs font-black flex items-center justify-center gap-1 w-full"
            >
              <span>Seva Desk queue terminal</span>
              <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
