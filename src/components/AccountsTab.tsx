/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Scale,
  Wallet,
  ArrowUpRight,
  BookOpen,
  TrendingUp,
  ArrowDownCircle,
  CheckCircle,
  X,
  Clock,
  HelpCircle,
  Building,
} from "lucide-react";
import { AccountLedger } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface AccountsTabProps {
  ledger: AccountLedger;
  onRemitToBank: (amount: number, description: string) => void;
  grandTotalBills: number;
  totalExpenses: number;
}

export default function AccountsTab({
  ledger,
  onRemitToBank,
  grandTotalBills,
  totalExpenses,
}: AccountsTabProps) {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remitAmount, setRemitAmount] = useState<number>(0);
  const [remitDesc, setRemitDesc] = useState("");

  const handleSubmitRemit = (e: React.FormEvent) => {
    e.preventDefault();
    if (remitAmount <= 0) {
      alert("Provide valid remittance amount");
      return;
    }

    if (remitAmount > ledger.cashInHand) {
      alert(
        `Insufficient funds. Your cash in hand is ₹ ${ledger.cashInHand}, cannot remit ₹ ${remitAmount}.`,
      );
      return;
    }

    onRemitToBank(
      remitAmount,
      remitDesc.trim() || "Locker Cash remitted to Vijaya Bank account",
    );
    setIsModalOpen(false);
    setRemitAmount(0);
    setRemitDesc("");
  };

  return (
    <div className="space-y-6" id="accounts-tab">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
            <Scale className="w-5.5 h-5.5 text-[#ff7a00]" />
            <span>{t("acc.title")}</span>
          </h2>
          <p className="text-xs text-slate-500">{t("acc.subtitle")}</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ff7a00] hover:bg-[#ea580c] text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-950/20 transition-all border-none"
        >
          <ArrowUpRight className="w-4.5 h-4.5" />
          <span>{t("acc.remitTitle")}</span>
        </button>
      </div>

      {/* Primary Fund Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Cash in Counter safe */}
        <div className="bg-white/90 backdrop-blur-md border-2 border-[#ff7a00]/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-500 font-medium text-xs">
            <span>Counter Cash Drawer</span>
            <Wallet className="w-4.5 h-4.5 text-[#ff7a00]" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mt-3 font-mono">
            ₹ {ledger.cashInHand.toLocaleString("en-IN")}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium leading-relaxed">
            Actual paper currency held on-premise at counter drawers.
          </p>
        </div>

        {/* Pillar 2: Bank current deposits */}
        <div className="bg-white/90 backdrop-blur-md border-2 border-sky-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-500 font-medium text-xs">
            <span>Vijaya Bank Temple A/C</span>
            <Building className="w-4.5 h-4.5 text-[#ff7a00]" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mt-3 font-mono">
            ₹ {ledger.bankBalance.toLocaleString("en-IN")}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium leading-relaxed">
            Direct UPI & Bank transfer balances + logged remittances.
          </p>
        </div>

        {/* Pillar 3: Specialized charity capital */}
        <div className="bg-white/90 backdrop-blur-md border-2 border-emerald-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-500 font-medium text-xs">
            <span>Annadana Trust Endowments</span>
            <Scale className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-emerald-600 mt-3 font-mono">
            ₹ {ledger.annadanaFund.toLocaleString("en-IN")}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium leading-relaxed">
            Earmarked public funds feeding poor devotees.
          </p>
        </div>

        {/* Pillar 4: Temple Base Reserves */}
        <div className="bg-white/90 backdrop-blur-md border-2 border-rose-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-500 font-medium text-xs">
            <span>Capital Reserve Assets</span>
            <TrendingUp className="w-4.5 h-4.5 text-rose-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mt-3 font-mono">
            ₹ {ledger.capitalFund.toLocaleString("en-IN")}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium leading-relaxed">
            Long-term temple improvements and festival trust reserves.
          </p>
        </div>
      </div>

      {/* MID PANEL: AUDITED CASH RECONCILIATION & TRANSACTIONS LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reconciliation balance sheet */}
        <div className="lg:col-span-4 bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 font-display mb-4 flex items-center gap-1.5 border-b border-slate-200 pb-3">
              <BookOpen className="w-4.5 h-4.5 text-[#ff7a00]" />
              <span>Reconciled Trial Balance</span>
            </h3>

            <div className="space-y-4">
              <div className="bg-white/50 rounded-xl p-3.5 space-y-2.5 border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">
                    Accumulated Seva Sales:
                  </span>
                  <span className="font-mono font-bold text-emerald-600">
                    + ₹{grandTotalBills.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">
                    Accumulated Expenses Voucher:
                  </span>
                  <span className="font-mono font-bold text-red-600">
                    - ₹{totalExpenses.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-2.5 mt-2 flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>Computed Net Operating Cash:</span>
                  <span className="font-mono text-[#ff7a00]">
                    ₹{" "}
                    {(grandTotalBills - totalExpenses).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* General Advice */}
              <div className="text-xs text-slate-500 leading-relaxed space-y-2">
                <p>
                  * To ensure accounting security, cashiers must remit excessive
                  cash in counter drawers daily to Vijaya Bank accounts.
                </p>
                <p>
                  * Remittance creates an audit log that instantly offsets cash
                  inventories.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bank remittance transactions ledger logs */}
        <div className="lg:col-span-8 bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 font-display border-b border-slate-200 pb-3 mb-1.5 flex items-center gap-2">
              <Building className="w-4.5 h-4.5 text-[#ff7a00]" />
              <span>Remittance Dispatch Logs</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Official list of safe cash contents sent to bank lockers.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-slate-800">
                <thead>
                  <tr className="border-b border-slate-200 bg-white text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-2">Particulars / Description</th>
                    <th className="py-2.5 px-2 text-right">
                      Transfer Code / Ledger
                    </th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {ledger.remittances
                    .slice()
                    .reverse()
                    .map((rem, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-white/50 transition-all"
                      >
                        <td className="py-3 px-3 font-mono text-slate-500">
                          {new Date(rem.date).toLocaleString("en-IN", {
                            hour12: true,
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="py-3 px-2 text-slate-800 font-bold max-w-sm">
                          {rem.description}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 bg-[#ff7a00]/10 border border-[#ff7a00]/20 px-2 py-0.5 rounded">
                            CASH_TO_BANK
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-amber-500">
                          ₹ {rem.amount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}

                  {ledger.remittances.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-[#7a625f] italic"
                      >
                        No cash-to-bank dispatch sheets printed on this terminal
                        node.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* DISPATCH BANK TRANSFER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 font-display flex items-center gap-1">
                <span>Dispatch Cash to Bank</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 bg-white/90 backdrop-blur-md border border-slate-200 hover:bg-white hover:text-slate-800 rounded-lg text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRemit} className="p-5 space-y-4">
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-xl border border-[#ff7a00]/20 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">
                    Counter safe liquidity:
                  </span>
                  <span className="font-mono font-bold text-[#ff7a00]">
                    ₹ {ledger.cashInHand.toLocaleString("en-IN")}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Amount to Remit (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={ledger.cashInHand}
                    value={remitAmount === 0 ? "" : remitAmount}
                    onChange={(e) =>
                      setRemitAmount(parseInt(e.target.value) || 0)
                    }
                    placeholder="Enter dispatch cash value"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Transfer Particulars / Dispatch Note *
                  </label>
                  <input
                    type="text"
                    required
                    value={remitDesc}
                    onChange={(e) => setRemitDesc(e.target.value)}
                    placeholder="e.g. Sent with Chief Trustee to Vijaya Bank main branch"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={remitAmount <= 0 || remitAmount > ledger.cashInHand}
                  className="bg-[#ff7a00] hover:bg-[#ea580c] disabled:bg-white text-white disabled:text-slate-500 disabled:border-slate-200 border-none font-bold px-5 py-2 rounded-xl cursor-pointer disabled:cursor-not-allowed shadow-md transition-colors"
                >
                  Authorize Remittance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
