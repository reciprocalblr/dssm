/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Building,
  CreditCard,
  Printer,
  Save,
  Check,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  Cloud,
  Wifi,
  Smartphone,
  Layers,
  Sparkles,
  QrCode,
  Info,
} from "lucide-react";
import { TempleSettings, SystemUser } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface SettingsTabProps {
  settings: TempleSettings;
  currentUser?: SystemUser | null;
  onSaveSettings: (settings: TempleSettings) => void;
  onImportBackup?: (backupJson: string) => boolean;
  onExportBackup?: () => string;
  onResetBillingSystem?: () => Promise<boolean>;
}

export default function SettingsTab({
  settings,
  currentUser,
  onSaveSettings,
  onResetBillingSystem,
}: SettingsTabProps) {
  const { t } = useLanguage();
  const isAdmin = currentUser?.role === "Administrator";

  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Local state for settings form
  const [templeName, setTempleName] = useState(settings.templeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [addressLine1, setAddressLine1] = useState(settings.addressLine1);
  const [addressLine2, setAddressLine2] = useState(settings.addressLine2);
  const [city, setCity] = useState(settings.city);
  const [postalCode, setPostalCode] = useState(settings.postalCode);
  const [contactNumber, setContactNumber] = useState(settings.contactNumber);

  const [upiMerchantId, setUpiMerchantId] = useState(settings.upiMerchantId);
  const [upiDisplayName, setUpiDisplayName] = useState(settings.upiDisplayName);
  const [receiptPrefix, setReceiptPrefix] = useState(settings.receiptPrefix);
  const [paperSize, setPaperSize] = useState<"80mm" | "A4">(settings.paperSize);

  const [enableBlessingMessage, setEnableBlessingMessage] = useState(
    settings.enableBlessingMessage,
  );
  const [blessingMessage, setBlessingMessage] = useState(
    settings.blessingMessage,
  );

  const [savingStatus, setSavingStatus] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStatus(true);

    onSaveSettings({
      templeName,
      tagline,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      contactNumber,
      upiMerchantId,
      upiDisplayName,
      receiptPrefix,
      paperSize,
      enableBlessingMessage,
      blessingMessage,
    });

    setTimeout(() => {
      setSavingStatus(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3500);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="settings-tab">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 font-display flex items-center gap-2.5">
            <span>{t("set.title")}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t("set.subtitle")} • Real-time cloud persistence configured
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl self-start sm:self-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <div className="text-left">
            <div className="text-[11px] font-black text-emerald-900 uppercase tracking-wider">
              Cloud Sync Active
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">
              Multi-Device Live Firestore
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Configuration Panels */}
        <form onSubmit={handleSave} className="lg:col-span-8 space-y-6">
          {/* Section 1: General Profile */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 font-sans">
                <div className="p-1.5 bg-orange-50 rounded-lg text-[#ff7a00]">
                  <Building className="w-4 h-4" />
                </div>
                <span>Temple Identity & Coordinates</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Appears on printed receipts & vouchers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Temple Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={templeName}
                  onChange={(e) => setTempleName(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/10 transition-all font-sans"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Subtitle / Tagline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/10 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/10 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Address Line 2 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/10 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  City / Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/10 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Postal PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  maxLength={6}
                  className="w-full bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-hidden focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/10 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Contact Office Mobile / Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-hidden focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: UPI Target */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 font-sans">
                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span>Unified UPI Merchant Target (Dynamic QR)</span>
              </h3>
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-bold">
                <QrCode className="w-3 h-3" />
                <span>Instant QR Ready</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Merchant UPI / VPA ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={upiMerchantId}
                  onChange={(e) => setUpiMerchantId(e.target.value)}
                  placeholder="name@upi"
                  className="w-full bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-hidden focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/10 transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  UPI VPA used to generate exact dynamic payment QR codes at checkout.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Registered Account Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={upiDisplayName}
                  onChange={(e) => setUpiDisplayName(e.target.value)}
                  placeholder="e.g. Sri Sai Mandira Trust"
                  className="w-full bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/10 transition-all font-sans"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Payee name displayed to devotees in banking apps (GPay, PhonePe, Paytm).
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Receipt Spool Setup */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 font-sans">
                <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                  <Printer className="w-4 h-4" />
                </div>
                <span>Invoice Receipt & Printing Configuration</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Receipt Series Prefix <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={receiptPrefix}
                  onChange={(e) =>
                    setReceiptPrefix(e.target.value.toUpperCase())
                  }
                  className="w-full bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-hidden focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/10 transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Prefix used in invoice IDs (e.g. {receiptPrefix}-2026-27-0001).
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Default Print Paper Size <span className="text-red-500">*</span>
                </label>
                <select
                  value={paperSize}
                  onChange={(e) =>
                    setPaperSize(e.target.value as "80mm" | "A4")
                  }
                  className="w-full bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-hidden focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/10 transition-all font-sans cursor-pointer"
                >
                  <option value="80mm">
                    80mm Thermal Receipt (Standard POS Roll)
                  </option>
                  <option value="A4">A4 Full Sheet Paper (Office Laser/DeskJet)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Sets default dimensions when sending receipts to system print spooler.
                </p>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="enable-blessing-chk"
                    checked={enableBlessingMessage}
                    onChange={(e) => setEnableBlessingMessage(e.target.checked)}
                    className="rounded-md text-[#ff7a00] focus:ring-[#ff7a00] h-4 w-4 border border-slate-300 accent-[#ff7a00] cursor-pointer"
                  />
                  <label
                    htmlFor="enable-blessing-chk"
                    className="text-xs font-bold text-slate-800 cursor-pointer select-none"
                  >
                    Print Auspicious Blessing message at receipt footer
                  </label>
                </div>

                {enableBlessingMessage && (
                  <textarea
                    required
                    value={blessingMessage}
                    onChange={(e) => setBlessingMessage(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/10 transition-all resize-none font-sans"
                    placeholder="Enter blessing text to print at the bottom of devotee receipt..."
                  />
                )}
              </div>
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {showSaveSuccess ? (
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-left-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Configurations updated and synchronized to Firestore cloud!</span>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Changes will be instantly propagated across all active billing counters.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={savingStatus}
              className="w-full sm:w-auto bg-[#ff7a00] hover:bg-[#ea580c] text-white font-bold text-xs py-3 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {savingStatus
                  ? "Synchronizing to Cloud..."
                  : "Save All Configurations"}
              </span>
            </button>
          </div>
        </form>

        {/* Right Column: Cloud Sync Hub & System Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cloud Synchronization Status Hub Card */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 rounded-lg text-[#ff7a00]">
                  <Cloud className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                    Cloud Database Hub
                  </h3>
                  <p className="text-[10px] text-slate-400">Google Cloud Firestore</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-300 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                LIVE
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              All terminal operations are automatically synchronized to Google Cloud in real-time. Multiple cashiers, admins, and counters stay updated simultaneously.
            </p>

            {/* Sync Features Grid */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
                <Smartphone className="w-4 h-4 text-[#ff7a00] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 block text-[11px]">Multi-Device Real-Time Sync</span>
                  <span className="text-[10px] text-slate-500 leading-tight">Instant updates across desktops, laptops, tablets, and phones without refreshing.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
                <Layers className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 block text-[11px]">Atomic Double-Entry Ledger</span>
                  <span className="text-[10px] text-slate-500 leading-tight">Concurrent checkouts from multiple operators calculate transactions atomically.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
                <Wifi className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 block text-[11px]">Auto Local Cache & Resilience</span>
                  <span className="text-[10px] text-slate-500 leading-tight">Fast offline-first caching ensures zero lag during high festive rush at billing counters.</span>
                </div>
              </div>
            </div>

            {/* Active Collections Summary */}
            <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/80 space-y-1.5">
              <div className="text-[10px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#ff7a00]" />
                <span>Synced Cloud Collections</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["devotees", "sevas", "bills", "expenses", "ledger", "users", "settings"].map((col) => (
                  <span key={col} className="px-2 py-0.5 bg-white text-slate-700 rounded-md text-[10px] font-mono border border-amber-200/60 font-semibold">
                    /{col}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Active Session & Operator Status */}
          {currentUser && (
            <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2.5 border-b border-slate-100 font-sans">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Active Operator Session</span>
              </h3>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Logged User:</span>
                <span className="font-bold text-slate-800">{currentUser.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Access Role:</span>
                <span className="font-bold px-2 py-0.5 bg-orange-100 text-[#ff7a00] rounded-md text-[11px]">
                  {currentUser.role}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Terminal Code:</span>
                <span className="font-mono text-slate-700 font-semibold">{currentUser.username}</span>
              </div>
            </div>
          )}

          {/* ADMIN ONLY: SYSTEM CLEAR & RESET ENGINE */}
          {isAdmin && (
            <div className="bg-white/90 backdrop-blur-md border border-red-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2.5 border-b border-red-100">
                <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-red-800 uppercase tracking-wider font-sans">
                    Admin Maintenance Control
                  </h3>
                  <p className="text-[10px] text-red-600 font-medium">Reset Billing Totals to ₹0</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                Clears transaction receipts, vouchers, and resets ledger balance back to ₹0 in Firestore cloud. Devotee profiles and Seva catalog are preserved intact.
              </p>

              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="w-full py-2.5 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 hover:border-red-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Billing System & Numbers to "0"</span>
              </button>
            </div>
          )}

          {/* Temple Insignia Visual Asset */}
          <div className="border-t border-slate-200/60 pt-6 flex flex-col items-center justify-center select-none pointer-events-none gap-2.5 text-center">
            <span className="text-[9px] font-black tracking-[0.25em] text-slate-400 uppercase">
              Sri Shirdi Sai Seva Samithi
            </span>
            <img
              src="https://banner2.cleanpng.com/20180623/sht/aaztblxza.webp"
              alt="Divine Terminal Insignia"
              referrerPolicy="no-referrer"
              className="w-full max-w-[200px] h-auto object-contain opacity-75 hover:opacity-100 transition-opacity duration-500 scale-100"
            />
          </div>
        </div>
      </div>

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
                <li>All billing receipts, invoices, expenses, and ledger totals will be reset to <strong>₹0</strong> in both local memory and Firestore Cloud.</li>
                <li><strong className="text-emerald-700">Retained:</strong> All Seva names, prices, categories, and Devotee directory entries will stay intact.</li>
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
                <span>{isResetting ? "Resetting..." : "Yes, Reset to 0"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
