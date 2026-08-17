/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  IndianRupee,
  TrendingUp,
  Filter,
  X,
  CreditCard,
  FileSpreadsheet,
  RefreshCw,
  Flower2,
  Banknote,
  Flame,
} from "lucide-react";
import { RotateCcw, AlertCircle } from "lucide-react";
import { Bill, Expense, SystemUser } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface ReportsTabProps {
  bills: Bill[];
  expenses: Expense[];
  currentUser?: SystemUser | null;
  onResetBillingSystem?: () => Promise<boolean>;
}

export default function ReportsTab({
  bills,
  expenses,
  currentUser,
  onResetBillingSystem,
}: ReportsTabProps) {
  const { t } = useLanguage();
  const isAdmin = currentUser?.role === "Administrator";
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Date selection filter default is 'today' derived dynamically matching actual date.
  const SYSTEM_TODAY = new Date().toISOString().split("T")[0];
  const SYSTEM_YESTERDAY = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  })();
  const [dateFilter, setDateFilter] = useState<
    "today" | "yesterday" | "month" | "custom" | "year"
  >("today");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    bills.forEach((b) => years.add(b.createdAt.substring(0, 4)));
    expenses.forEach((e) => years.add(e.date.substring(0, 4)));
    let yArr = Array.from(years).sort().reverse();
    if (yArr.length === 0) yArr.push(new Date().getFullYear().toString());
    return yArr;
  }, [bills, expenses]);

  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );

  const selectedBills = useMemo(() => {
    return bills.filter((b) => {
      if (b.isCancelled) return false;
      if (dateFilter === "today") return b.createdAt.startsWith(SYSTEM_TODAY);
      if (dateFilter === "yesterday")
        return b.createdAt.startsWith(SYSTEM_YESTERDAY);
      if (dateFilter === "custom") {
        const bDate = b.createdAt.split("T")[0];
        let inRange = true;
        if (customStartDate && bDate < customStartDate) inRange = false;
        if (customEndDate && bDate > customEndDate) inRange = false;
        return inRange;
      }
      if (dateFilter === "month") {
        return b.createdAt.startsWith(SYSTEM_TODAY.substring(0, 7));
      }
      if (dateFilter === "year") {
        return b.createdAt.startsWith(selectedYear);
      }
      return false; // unmatched filter
    });
  }, [bills, dateFilter, customStartDate, customEndDate, selectedYear]);

  const selectedExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (dateFilter === "today") return e.date.startsWith(SYSTEM_TODAY);
      if (dateFilter === "yesterday")
        return e.date.startsWith(SYSTEM_YESTERDAY);
      if (dateFilter === "custom") {
        const eDate = e.date.split("T")[0];
        let inRange = true;
        if (customStartDate && eDate < customStartDate) inRange = false;
        if (customEndDate && eDate > customEndDate) inRange = false;
        return inRange;
      }
      if (dateFilter === "month") {
        return e.date.startsWith(SYSTEM_TODAY.substring(0, 7));
      }
      if (dateFilter === "year") {
        return e.date.startsWith(selectedYear);
      }
      return false; // unmatched filter
    });
  }, [expenses, dateFilter, customStartDate, customEndDate, selectedYear]);

  // Calculations for KPI blocks
  const metrics = useMemo(() => {
    const totalCount = selectedBills.length;
    let grossTotal = 0;
    let cashTotal = 0;
    let upiTotal = 0;
    let dakshinaTotal = 0;

    selectedBills.forEach((b) => {
      grossTotal += b.grandTotal;
      dakshinaTotal += b.pujariDakshinaTotal;
      if (b.paymentMode === "Cash") cashTotal += b.grandTotal;
      if (b.paymentMode === "UPI") upiTotal += b.grandTotal;
    });

    const expensesTotal = selectedExpenses.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );

    return {
      totalCount,
      grossTotal,
      cashTotal,
      upiTotal,
      dakshinaTotal,
      expensesTotal,
      netOperating: grossTotal - expensesTotal,
    };
  }, [selectedBills, selectedExpenses]);

  // Seva volumes summary calculations
  const sevaPerformance = useMemo(() => {
    const performances: {
      [name: string]: { code: string; count: number; total: number };
    } = {};

    selectedBills.forEach((b) => {
      b.items.forEach((item) => {
        if (!performances[item.sevaName]) {
          performances[item.sevaName] = {
            code: item.sevaId,
            count: 0,
            total: 0,
          };
        }
        performances[item.sevaName].count += item.count;
        performances[item.sevaName].total += item.price * item.count;
      });
    });

    return Object.entries(performances)
      .map(([name, stat]) => ({
        name,
        code: stat.code,
        count: stat.count,
        total: stat.total,
      }))
      .sort((a, b) => b.total - a.total);
  }, [selectedBills]);

  // Day Close Print simulation modal
  const [isReportOpen, setIsReportOpen] = useState(false);

  const exportToCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [
        headers.join(","),
        ...rows.map((e) =>
          e
            .map((item) =>
              typeof item === "string" ? `"${item.replace(/"/g, '""')}"` : item,
            )
            .join(","),
        ),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExpenses = () => {
    const headers = ["ID", "Date", "Category", "Description", "Amount"];
    const rows = selectedExpenses.map((e) => [
      e.id,
      e.date.split("T")[0],
      e.category,
      e.description || "",
      e.amount,
    ]);
    exportToCSV(`expenses_${dateFilter}.csv`, headers, rows);
  };

  const exportInward = () => {
    const headers = [
      "Invoice No",
      "Date",
      "Time",
      "Devotee Name",
      "Payment Mode",
      "Operator",
      "Dakshina",
      "Grand Total",
    ];
    const rows = selectedBills.map((b) => {
      const d = new Date(b.createdAt);
      return [
        b.id,
        d.toISOString().split("T")[0],
        d.toLocaleTimeString("en-IN", { hour12: false }),
        b.devoteeName,
        b.paymentMode,
        b.createdByUser,
        b.pujariDakshinaTotal,
        b.grandTotal,
      ];
    });
    exportToCSV(`inward_${dateFilter}.csv`, headers, rows);
  };

  const exportBalanceSheet = () => {
    const headers = ["Metric", "Amount (INR)"];
    const rows = [
      ["Gross Collections", metrics.grossTotal],
      ["Cash Portion", metrics.cashTotal],
      ["UPI Portion", metrics.upiTotal],
      ["Operational Expenses", metrics.expensesTotal],
      ["Net Operating Balance", metrics.netOperating],
    ];
    exportToCSV(`balance_sheet_${dateFilter}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6" id="reports-tab">
      {/* Tally Prime Style Top Header & Control Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-amber-400 rounded-xl shadow-xs">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">
                  {t("rep.title")}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300 rounded uppercase">
                  Tally Day-Book
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{t("rep.subtitle")}</p>
            </div>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="py-2 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-2xs shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset Billing Values to 0 (Admin)</span>
            </button>
          )}
        </div>

        {/* Tally Prime Accounting Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          {/* Period Filter Segmented Control */}
          <div className="flex flex-wrap items-center bg-slate-100/90 border border-slate-200/90 p-1 rounded-xl gap-1">
            <button
              onClick={() => setDateFilter("today")}
              className={`px-3.5 py-1.5 text-xs font-extrabold rounded-lg cursor-pointer transition-all uppercase tracking-wide ${
                dateFilter === "today"
                  ? "bg-slate-900 text-amber-400 shadow-xs border border-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter("yesterday")}
              className={`px-3.5 py-1.5 text-xs font-extrabold rounded-lg cursor-pointer transition-all uppercase tracking-wide ${
                dateFilter === "yesterday"
                  ? "bg-slate-900 text-amber-400 shadow-xs border border-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => setDateFilter("month")}
              className={`px-3.5 py-1.5 text-xs font-extrabold rounded-lg cursor-pointer transition-all uppercase tracking-wide ${
                dateFilter === "month"
                  ? "bg-slate-900 text-amber-400 shadow-xs border border-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              This Month
            </button>

            <div
              className={`px-3 py-1.5 flex items-center gap-1.5 rounded-lg transition-all cursor-pointer ${
                dateFilter === "year"
                  ? "bg-slate-900 text-amber-400 shadow-xs border border-slate-800"
                  : "hover:bg-white/60 text-slate-600"
              }`}
              onClick={() => {
                if (dateFilter !== "year") setDateFilter("year");
              }}
            >
              <span className={`text-xs font-extrabold uppercase tracking-wide ${dateFilter === "year" ? "text-amber-400" : "text-slate-600"}`}>
                Yearly
              </span>
              {availableYears.length > 0 && (
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setDateFilter("year");
                  }}
                  className="text-xs font-extrabold border border-slate-300 outline-none cursor-pointer rounded bg-white text-slate-900 px-1.5 py-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div
              className={`flex items-center rounded-lg transition-all cursor-pointer ${
                dateFilter === "custom"
                  ? "bg-slate-900 text-amber-400 shadow-xs border border-slate-800 px-3 py-1.5"
                  : "hover:bg-white/60 text-slate-600 px-3 py-1.5"
              }`}
              onClick={() => {
                if (dateFilter !== "custom") setDateFilter("custom");
              }}
            >
              <span className={`text-xs font-extrabold uppercase tracking-wide ${dateFilter === "custom" ? "mr-2 text-amber-400" : "text-slate-600"}`}>
                Custom Date
              </span>
              {dateFilter === "custom" && (
                <div
                  className="flex items-center gap-1.5 bg-white border border-slate-300 rounded p-0.5 px-1.5 shadow-2xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="p-0.5 max-w-[115px] text-[11px] font-bold rounded cursor-pointer border-none outline-none bg-transparent text-slate-900"
                    style={{ colorScheme: "light" }}
                    title="Start Date"
                  />
                  <span className="text-xs font-bold text-slate-400">to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="p-0.5 max-w-[115px] text-[11px] font-bold rounded cursor-pointer border-none outline-none bg-transparent text-slate-900"
                    style={{ colorScheme: "light" }}
                    title="End Date"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons & Reports Dispatch */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsReportOpen(true)}
              className="py-2 px-4 bg-gradient-to-r from-[#ea580c] to-[#ff7a00] hover:from-[#d97706] hover:to-[#ea580c] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-md border border-amber-600/30"
            >
              <Printer className="w-4 h-4" />
              <span>Day-Close Audit Report</span>
            </button>

            <button
              onClick={exportExpenses}
              className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Export Expenses CSV"
            >
              <Download className="w-3.5 h-3.5 text-rose-600" />
              <span>Expenses</span>
            </button>
            <button
              onClick={exportInward}
              className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Export Inward Receipts CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>In-Ward</span>
            </button>
            <button
              onClick={exportBalanceSheet}
              className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Export Balance Sheet CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
              <span>Balance Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tally Prime Style Financial KPIs & Ledger Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gross Collections */}
        <div className="bg-amber-50/70 border border-amber-300/80 rounded-2xl p-4 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-amber-800 text-[11px] font-black uppercase tracking-wider font-mono">
                Gross Collections
              </span>
              <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                <Flower2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-amber-950 mt-2 font-mono tracking-tight">
              ₹ {metrics.grossTotal.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
            <span className="text-amber-800 font-bold">Closed Receipts:</span>
            <span className="font-mono font-black bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full text-[10px]">
              {metrics.totalCount} Receipts
            </span>
          </div>
        </div>

        {/* KPI 2: Counter Cash Portion */}
        <div className="bg-emerald-50/70 border border-emerald-300/80 rounded-2xl p-4 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-800 text-[11px] font-black uppercase tracking-wider font-mono">
                Counter Cash
              </span>
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Banknote className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-950 mt-2 font-mono tracking-tight">
              ₹ {metrics.cashTotal.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px]">
            <span className="text-emerald-800 font-bold">Vault Status:</span>
            <span className="font-mono font-bold text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-full text-[10px]">
              Locker Sorting
            </span>
          </div>
        </div>

        {/* KPI 3: UPI / Bank Portion */}
        <div className="bg-sky-50/70 border border-sky-300/80 rounded-2xl p-4 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sky-800 text-[11px] font-black uppercase tracking-wider font-mono">
                UPI / Credit Portion
              </span>
              <span className="p-1.5 bg-sky-100 text-sky-800 rounded-lg">
                <CreditCard className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-sky-950 mt-2 font-mono tracking-tight">
              ₹ {metrics.upiTotal.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-sky-200/60 flex items-center justify-between text-[11px]">
            <span className="text-sky-800 font-bold">Deposit Channel:</span>
            <span className="font-mono font-bold text-sky-900 bg-sky-200/80 px-2 py-0.5 rounded-full text-[10px]">
              Direct Bank
            </span>
          </div>
        </div>

        {/* KPI 4: Operational Expenses */}
        <div className="bg-rose-50/70 border border-rose-300/80 rounded-2xl p-4 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-rose-800 text-[11px] font-black uppercase tracking-wider font-mono">
                Operational Expenses
              </span>
              <span className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
                <Flame className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-rose-950 mt-2 font-mono tracking-tight">
              ₹ {metrics.expensesTotal.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center justify-between text-[11px]">
            <span className="text-rose-800 font-bold">Category:</span>
            <span className="font-mono font-bold text-rose-900 bg-rose-200/80 px-2 py-0.5 rounded-full text-[10px]">
              Samagri & Co-Op
            </span>
          </div>
        </div>
      </div>

      {/* Net Balance Quick Reconciliation Ribbon (Tally Prime Feature) */}
      <div className="bg-slate-900 text-white rounded-xl p-3 px-5 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold text-[10px] rounded uppercase">
            Net Reconciliation
          </div>
          <span className="text-xs font-medium text-slate-300">
            Net Operating Cash Balance (Gross Collections Less Operational Expenses)
          </span>
        </div>
        <div className="font-mono font-black text-lg text-emerald-400 tracking-wide flex items-center gap-1.5">
          <span>Net Balance:</span>
          <span className="text-xl text-white underline decoration-emerald-500 decoration-2 underline-offset-4">
            ₹ {metrics.netOperating.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Tally Ledger Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Seva Performance Audit */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-amber-600" />
                <span>Seva Performance Audit</span>
              </h3>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
                {sevaPerformance.length} Items
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Sum of sevas booked and revenue splits for elected period.
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-800">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Pooja Description</th>
                    <th className="py-2.5 text-center px-2">Bookings</th>
                    <th className="py-2.5 text-right px-3">Sum (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {sevaPerformance.map((stat, idx) => (
                    <tr
                      key={stat.name}
                      className={idx % 2 === 0 ? "bg-white hover:bg-amber-50/40 transition-colors" : "bg-slate-50/60 hover:bg-amber-50/40 transition-colors"}
                    >
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                        {stat.name}
                      </td>
                      <td className="py-2.5 text-center text-amber-700 font-bold px-2">
                        {stat.count}
                      </td>
                      <td className="py-2.5 text-right font-bold text-slate-900 px-3">
                        ₹ {stat.total.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}

                  {sevaPerformance.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-8 text-center text-slate-500 italic font-sans"
                      >
                        No bookings tallied in selected period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column: Sequential Audit Trail */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
            <h3 className="text-base font-bold text-slate-900 font-display">
              Sequential Audit Trail
            </h3>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
              {selectedBills.length} Invoices
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Official record of invoices compiled, excluding cancelled runs.
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[420px] overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="sticky top-0 bg-slate-100 z-10">
                <tr className="border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Invoice-No</th>
                  <th className="py-2.5">Devotee Name</th>
                  <th className="py-2.5">Method</th>
                  <th className="py-2.5 text-right">Operator</th>
                  <th className="py-2.5 text-right px-3">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedBills
                  .slice()
                  .reverse()
                  .map((bill, idx) => (
                    <tr
                      key={bill.id}
                      className={idx % 2 === 0 ? "bg-white hover:bg-amber-50/40 transition-colors" : "bg-slate-50/60 hover:bg-amber-50/40 transition-colors"}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-700 whitespace-nowrap">
                        {bill.id}
                      </td>
                      <td className="py-2.5">
                        <div className="font-bold text-slate-900">
                          {bill.devoteeName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {new Date(bill.createdAt).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                          bill.paymentMode === "Cash" 
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-sky-50 text-sky-800 border-sky-200"
                        }`}>
                          {bill.paymentMode}
                        </span>
                      </td>
                      <td className="text-right uppercase font-mono text-slate-600 text-[10px] whitespace-nowrap">
                        {bill.createdByUser}
                      </td>
                      <td className="text-right font-mono font-extrabold text-slate-900 px-3 whitespace-nowrap">
                        ₹ {bill.grandTotal.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}

                {selectedBills.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-slate-500 italic"
                    >
                      No invoices logged under this date configuration.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DAY CLOSE AUDIT REPORT MODAL */}
      {isReportOpen && (
        <>
          {/* SCREEN INTERACTIVE PREVIEW PANEL (HIDDEN ON PRINT MODE) */}
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in no-print">
            <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
              <div className="bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
                <h3 className="font-bold text-slate-800 text-sm font-display flex items-center gap-1.5">
                  <BarChart3 className="w-4.5 h-4.5 text-[#ff7a00]" />
                  <span>Day-Close Audit Closed Report</span>
                </h3>
                <button
                  onClick={() => setIsReportOpen(false)}
                  className="p-1.5 bg-white/90 backdrop-blur-md border border-slate-200 hover:bg-white hover:text-slate-800 rounded-lg text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Day Close Sheet */}
              <div className="p-6 bg-[#150a09] overflow-y-auto max-h-[70vh] border-b border-slate-200">
                <div
                  className="bg-white text-slate-800 p-8 w-[210mm] max-w-full shadow-md font-mono text-sm border border-slate-200 flex flex-col rounded-sm mx-auto h-fit"
                  style={{ fontFamily: "monospace" }}
                >
                  <h3 className="text-base font-black text-center uppercase border-b border-black pb-4 mt-1 leading-normal text-slate-800">
                    {t("brand.full")}
                  </h3>
                  <p className="text-sm text-center font-bold uppercase mt-3 text-stone-905">
                    DAY-CLOSE OPERATIONAL AUDIT SHEET
                  </p>
                  <p className="text-xs text-center border-b border-black pb-4 mb-6 leading-normal text-stone-500">
                    {t("brand.address")}
                  </p>

                  {/* Audit Properties */}
                  <div className="space-y-2 text-xs border-b border-black border-dashed pb-5 mb-5 text-stone-800">
                    <div className="flex justify-between">
                      <span>REPORT PERIOD:</span>
                      <span className="font-bold uppercase">
                        {dateFilter === "custom" &&
                        (customStartDate || customEndDate)
                          ? `CUSTOM (${customStartDate || "..."} to ${customEndDate || "..."})`
                          : dateFilter === "year"
                            ? `YEARLY (${selectedYear})`
                            : dateFilter === "month"
                              ? "THIS MONTH"
                              : dateFilter.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>PRINTED TIMESTAMP:</span>
                      <span>
                        {new Date().toLocaleString("en-IN", {
                          hour12: true,
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>INVOICES GENERATED:</span>
                      <span>{metrics.totalCount} COUNTERS</span>
                    </div>
                  </div>

                  {/* Performance split by categories */}
                  <span className="font-black text-xs uppercase tracking-wider mb-2 block text-stone-800">
                    I. REVENUE SPLIT LEDGER
                  </span>
                  <div className="space-y-2 text-sm border-b border-black border-dashed pb-5 mb-5 text-stone-800">
                    <div className="flex justify-between">
                      <span>1. CASH COLLECTIONS:</span>
                      <span>₹{metrics.cashTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2. UPI BANK DEPOSITS:</span>
                      <span>₹{metrics.upiTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-black border-dotted pt-2 mt-2 text-slate-800">
                      <span>GROSS POOJA EARNINGS:</span>
                      <span>₹{metrics.grossTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Expenses Logged */}
                  <span className="font-black text-xs uppercase tracking-wider mb-2 block text-stone-800">
                    II. CO-OP EXPENDITURES
                  </span>
                  <div className="space-y-2 text-sm border-b border-black border-dashed pb-5 mb-5 text-stone-800">
                    <div className="flex justify-between">
                      <span>TOTAL VOUCHERS FILED:</span>
                      <span>
                        - ₹{metrics.expensesTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-black border-dotted pt-2 mt-2 text-slate-800">
                      <span>NET REMAINING CASH:</span>
                      <span>
                        ₹{metrics.netOperating.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Seva Popularity Summary table */}
                  <span className="font-black text-xs uppercase tracking-wider mb-2 block text-stone-800">
                    III. SEVA DISPATCH INDEX
                  </span>
                  <div className="border-b border-black border-dotted pb-4 mb-6 text-stone-800">
                    <div className="grid grid-cols-12 text-xs font-bold border-b border-black pb-1 mb-2 text-stone-700">
                      <span className="col-span-8">DESCRIPTION</span>
                      <span className="col-span-2 text-center">QTY</span>
                      <span className="col-span-2 text-right">SUM</span>
                    </div>

                    {sevaPerformance.map((stat, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 text-sm py-1"
                      >
                        <span className="col-span-8 truncate uppercase text-slate-800">
                          {stat.name}
                        </span>
                        <span className="col-span-2 text-center text-slate-800">
                          {stat.count}
                        </span>
                        <span className="col-span-2 text-right text-slate-800">
                          ₹{stat.total}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Authorized seals signature spaces */}
                  <div className="mt-8 pt-16 border-t border-black border-dotted flex justify-between text-xs text-stone-800">
                    <div className="flex flex-col items-center">
                      <span className="border-t border-black inline-block pt-1 uppercase font-bold text-stone-600 px-6">
                        CHIEF CASHIER
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="border-t border-black inline-block pt-1 uppercase font-bold text-stone-600 px-6">
                        CHIEF TRUSTEE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Print and complete controls */}
              <div className="border-slate-200 p-4 bg-white flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    const printContent = document.getElementById(
                      "printable-audit-report-content",
                    )?.innerHTML;
                    const win = window.open(
                      "",
                      "Print Audit Summary",
                      "width=800,height=800",
                    );
                    if (win) {
                      win.document.write(`
                        <html>
                          <head>
                            <title>Day Close Report</title>
                            <style>
                              @page { size: A4 portrait; margin: 0mm !important; }
                              body { font-family: monospace; display: flex; justify-content: center; padding: 12mm 15mm; margin: 0; background-color: #fff; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                              .print-container { width: 100%; max-width: 190mm; box-sizing: border-box; }
                              
                              /* Copy needed utility classes for layout from Tailwind */
                              h3 { margin-top: 0; margin-bottom: 1rem; }
                              p { margin-top: 0.5rem; margin-bottom: 0.5rem; }
                              .font-black { font-weight: 900; }
                              .font-bold { font-weight: 700; }
                              .text-center { text-align: center; }
                              .uppercase { text-transform: uppercase; }
                              .border-b { border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #000; }
                              .border-t { border-top-width: 1px; border-top-style: solid; border-top-color: #000; }
                              .border-dashed { border-style: dashed; border-width: 0 0 1px 0; }
                              .border-dotted { border-style: dotted; border-width: 1px 0 0 0; }
                              .pb-4 { padding-bottom: 1rem; }
                              .pt-2 { padding-top: 0.5rem; }
                              .mt-1 { margin-top: 0.25rem; }
                              .mt-2 { margin-top: 0.5rem; }
                              .mt-3 { margin-top: 0.75rem; }
                              .mb-2 { margin-bottom: 0.5rem; }
                              .mb-5 { margin-bottom: 1.25rem; }
                              .mb-6 { margin-bottom: 1.5rem; }
                              .leading-normal { line-height: 1.5; }
                              .text-base { font-size: 1rem; line-height: 1.5rem; }
                              .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
                              .text-xs { font-size: 0.75rem; line-height: 1rem; }
                              .space-y-2 > min-height { margin-top: 0.5rem; }
                              .flex { display: flex; }
                              .justify-between { justify-content: space-between; }
                              .flex-col { flex-direction: column; }
                              .items-center { align-items: center; }
                              .grid { display: grid; }
                              .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
                              .col-span-8 { grid-column: span 8 / span 8; }
                              .col-span-2 { grid-column: span 2 / span 2; }
                              .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                              .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
                              .pb-1 { padding-bottom: 0.25rem; }
                              .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
                              .mt-8 { margin-top: 2rem; }
                              .pt-16 { padding-top: 4rem; }
                            </style>
                          </head>
                          <body onload="setTimeout(function(){ window.print(); window.close(); }, 500);">
                            <div class="print-container">${printContent}</div>
                          </body>
                        </html>
                      `);
                      win.document.close();
                    }
                  }}
                  className="flex-1 bg-[#ff7a00] hover:bg-[#ea580c] text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md border-none"
                >
                  <span>Print Audit Summary</span>
                </button>

                <button
                  onClick={() => setIsReportOpen(false)}
                  className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-500 hover:text-slate-800 text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>

          {/* HIDDEN PRINT-ONLY CONTENT FOR POPUP SCRIPT TO CLONE */}
          <div className="hidden">
            <div
              id="printable-audit-report-content"
              className="w-full font-mono text-sm flex flex-col"
              style={{ fontFamily: "monospace" }}
            >
              <h3 className="text-base font-black text-center uppercase border-b border-black pb-4 mt-1 leading-normal text-black">
                {t("brand.full")}
              </h3>
              <p className="text-sm text-center font-bold uppercase mt-3 text-black">
                DAY-CLOSE OPERATIONAL AUDIT SHEET
              </p>
              <p className="text-xs text-center border-b border-black pb-4 mb-6 leading-normal text-black">
                {t("brand.address")}
              </p>

              {/* Audit Properties */}
              <div className="space-y-2 text-xs border-b border-black border-dashed pb-5 mb-5 text-black">
                <div className="flex justify-between">
                  <span>REPORT PERIOD:</span>
                  <span className="font-bold uppercase">
                    {dateFilter === "custom" &&
                    (customStartDate || customEndDate)
                      ? `CUSTOM (${customStartDate || "..."} to ${customEndDate || "..."})`
                      : dateFilter === "year"
                        ? `YEARLY (${selectedYear})`
                        : dateFilter === "month"
                          ? "THIS MONTH"
                          : dateFilter.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>PRINTED TIMESTAMP:</span>
                  <span>
                    {new Date().toLocaleString("en-IN", {
                      hour12: true,
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>INVOICES GENERATED:</span>
                  <span>{metrics.totalCount} COUNTERS</span>
                </div>
              </div>

              {/* Performance split by categories */}
              <span className="font-black text-xs uppercase tracking-wider mb-2 block text-black">
                I. REVENUE SPLIT LEDGER
              </span>
              <div className="space-y-2 text-sm border-b border-black border-dashed pb-5 mb-5 text-black">
                <div className="flex justify-between">
                  <span>1. CASH COLLECTIONS:</span>
                  <span>₹{metrics.cashTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>2. UPI BANK DEPOSITS:</span>
                  <span>₹{metrics.upiTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-black border-dotted pt-2 mt-2 text-black">
                  <span>GROSS POOJA EARNINGS:</span>
                  <span>₹{metrics.grossTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Expenses Logged */}
              <span className="font-black text-xs uppercase tracking-wider mb-2 block text-black">
                II. CO-OP EXPENDITURES
              </span>
              <div className="space-y-2 text-sm border-b border-black border-dashed pb-5 mb-5 text-black">
                <div className="flex justify-between">
                  <span>TOTAL VOUCHERS FILED:</span>
                  <span>
                    - ₹{metrics.expensesTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t border-black border-dotted pt-2 mt-2 text-black">
                  <span>NET REMAINING CASH:</span>
                  <span>₹{metrics.netOperating.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Seva Popularity Summary table */}
              <span className="font-black text-xs uppercase tracking-wider mb-2 block text-black">
                III. SEVA DISPATCH INDEX
              </span>
              <div className="border-b border-black border-dotted pb-4 mb-6 text-black">
                <div className="grid grid-cols-12 text-xs font-bold border-b border-black pb-1 mb-2 text-black">
                  <span className="col-span-8">DESCRIPTION</span>
                  <span className="col-span-2 text-center">QTY</span>
                  <span className="col-span-2 text-right">SUM</span>
                </div>

                {sevaPerformance.map((stat, index) => (
                  <div key={index} className="grid grid-cols-12 text-sm py-1">
                    <span className="col-span-8 truncate uppercase text-black">
                      {stat.name}
                    </span>
                    <span className="col-span-2 text-center text-black">
                      {stat.count}
                    </span>
                    <span className="col-span-2 text-right text-black">
                      ₹{stat.total}
                    </span>
                  </div>
                ))}
              </div>

              {/* Authorized seals signature spaces */}
              <div className="mt-8 pt-16 border-t border-black border-dotted flex justify-between text-xs text-black">
                <div className="flex flex-col items-center">
                  <span className="border-t border-black inline-block pt-1 uppercase font-bold text-black px-6">
                    CHIEF CASHIER
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="border-t border-black inline-block pt-1 uppercase font-bold text-black px-6">
                    CHIEF TRUSTEE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Reset Billing System to "0"?
                </h3>
                <p className="text-xs text-red-600 font-medium">
                  Administrator Authorization Required
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <p>
                <strong>What will happen:</strong>
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>A complete JSON backup of current system state will be downloaded automatically.</li>
                <li>All billing receipts, invoices, expenses, and ledger totals will be deleted & reset to <strong>₹0</strong>.</li>
                <li><strong className="text-emerald-700">Retained:</strong> All Seva names, prices, categories, and Devotee directory entries will stay intact in JSON.</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={async () => {
                  setIsResetting(true);
                  await onResetBillingSystem?.();
                  setIsResetting(false);
                  setShowResetModal(false);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isResetting ? "Resetting..." : "Yes, Backup & Reset to 0"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
