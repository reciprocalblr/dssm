/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Upload,
  FileText,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Wallet,
  Filter,
  Check,
  X,
  CreditCard,
} from "lucide-react";
import { Expense, SystemUser } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface ExpensesTabProps {
  expenses: Expense[];
  currentUser: SystemUser;
  onAddExpense: (expense: Omit<Expense, "id" | "date">) => void;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  cashInHand: number;
  grandTotalBills: number;
}

const EXPENSE_CATEGORIES = [
  "Pooja Samagri",
  "Annadana Provision",
  "Salaries",
  "Utility",
  "Maintenance",
  "Charity",
  "Other",
];

export default function ExpensesTab({
  expenses,
  currentUser,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  cashInHand,
  grandTotalBills,
}: ExpensesTabProps) {
  const { t } = useLanguage();
  const isAdmin = currentUser?.role === "Administrator";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  // Modal toggle
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [category, setCategory] =
    useState<Expense["category"]>("Pooja Samagri");
  const [otherDetails, setOtherDetails] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] =
    useState<Expense["paymentMode"]>("Cash");
  const [recordedBy, setRecordedBy] = useState("admin");

  // Edit fields and states
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [editCategory, setEditCategory] =
    useState<Expense["category"]>("Pooja Samagri");
  const [editOtherDetails, setEditOtherDetails] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editPaymentMode, setEditPaymentMode] =
    useState<Expense["paymentMode"]>("Cash");

  const handleOpenEditExpense = (exp: Expense) => {
    setEditingExpense(exp);
    setEditCategory(exp.category);
    setEditOtherDetails(exp.otherDetails || "");
    setEditDescription(exp.description);
    setEditAmount(exp.amount);
    setEditPaymentMode(exp.paymentMode);
  };

  const handleSaveEditExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;
    if (!editDescription.trim() || editAmount <= 0) {
      alert("Provide description and valid amount");
      return;
    }
    if (editCategory === "Other" && !editOtherDetails.trim()) {
      alert("Please specify details for Other category");
      return;
    }

    // Safety check for cash payment mode
    const adjustedCashInHand =
      cashInHand +
      (editingExpense.paymentMode === "Cash" ? editingExpense.amount : 0);
    if (editPaymentMode === "Cash" && editAmount > adjustedCashInHand) {
      // Amount exceeds cash in hand, but proceed with update
    }

    onUpdateExpense({
      ...editingExpense,
      category: editCategory,
      otherDetails: editCategory === "Other" ? editOtherDetails : undefined,
      description: editDescription,
      amount: editAmount,
      paymentMode: editPaymentMode,
    });

    setEditingExpense(null);
  };

  // Simulated file state
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedFileName, setAttachedFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  // Compute stats
  const totalExpenseAmount = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchText =
        exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory ? exp.category === activeCategory : true;
      return matchText && matchCat;
    });
  }, [expenses, searchQuery, activeCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) {
      alert("Provide description and valid amount");
      return;
    }
    if (category === "Other" && !otherDetails.trim()) {
      alert("Please specify details for Other category");
      return;
    }

    // Safety check for cash payment mode
    if (paymentMode === "Cash" && amount > cashInHand) {
      // Amount exceeds cash in hand, proceed with logging expense
    }

    onAddExpense({
      category,
      otherDetails: category === "Other" ? otherDetails : undefined,
      description,
      amount,
      paymentMode,
      recordedBy,
    });

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategory("Pooja Samagri");
    setOtherDetails("");
    setDescription("");
    setAmount(0);
    setPaymentMode("Cash");
    setAttachedFile(null);
    setAttachedFileName("");
  };

  // Drag and drop mechanics
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setAttachedFileName(files[0].name);
      alert(`Voucher Attachment loaded successfully: ${files[0].name}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachedFileName(files[0].name);
    }
  };

  return (
    <div className="space-y-6" id="expenses-tab">
      {/* Title & Stats block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
            <TrendingDown className="w-5.5 h-5.5 text-amber-600" />
            <span>{t("exp.title")}</span>
          </h2>
          <p className="text-xs text-slate-500">{t("exp.subtitle")}</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ff7a00] hover:bg-[#ea580c] text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-950/20 transition-all border-none"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>{t("exp.addBtn")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Summary Card */}
        <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-6">
            {/* Total Ledger Expenditures block */}
            <div className="bg-white border border-rose-500/20 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-rose-500 mb-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider">
                  Total Expenditures (Year)
                </h3>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 font-display flex items-center gap-0.5">
                <span className="text-lg font-medium text-rose-600">₹</span>
                <span>{totalExpenseAmount.toLocaleString("en-IN")}</span>
              </h2>
              <p className="text-[10px] text-slate-500 mt-1">
                Sum of all vouchers filed on this terminal in 2026
              </p>
            </div>

            {/* Total Income for the year block */}
            <div className="bg-white border border-emerald-500/20 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-emerald-500 mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider">
                  Total Income (Year)
                </h3>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 font-display flex items-center gap-0.5">
                <span className="text-lg font-medium text-emerald-600">₹</span>
                <span>{grandTotalBills.toLocaleString("en-IN")}</span>
              </h2>
              <p className="text-[10px] text-slate-500 mt-1">
                Sum of all non-cancelled seva billing counter receipts
              </p>
            </div>

            {/* Total Revenue for the year (net balance) block */}
            <div className="bg-white border border-[#ff7a00]/20 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-[#ff7a00] mb-1">
                <Wallet className="w-3.5 h-3.5" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider">
                  Net Balance / Revenue
                </h3>
              </div>
              {(() => {
                const netRevenue = grandTotalBills - totalExpenseAmount;
                return (
                  <>
                    <h2
                      className={`text-2xl font-extrabold font-display flex items-center gap-0.5 ${netRevenue >= 0 ? "text-[#ff7a00]" : "text-rose-500"}`}
                    >
                      <span className="text-lg font-medium">₹</span>
                      <span>{netRevenue.toLocaleString("en-IN")}</span>
                    </h2>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Operating surplus after deducting expenses
                    </p>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 mt-6">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Ledger Balance Safeguards
            </h4>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Counter Safe cash:</span>
              <span className="font-mono font-bold text-amber-600">
                ₹ {cashInHand.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Middle/Right Side: Grid Filters & Table log */}
        <div className="md:col-span-2 bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl shadow-sm flex flex-col">
          {/* Internal Filters Bar */}
          <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search outgoings description..."
                className="w-full bg-white/90 backdrop-blur-md text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
              />
            </div>

            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#ff7a00]"
            >
              <option value="">Any Category</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Outgoing listing */}
          {filteredExpenses.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              <TrendingDown className="w-12 h-12 text-slate-500/50 mx-auto" />
              <p className="text-slate-500 font-medium text-sm mt-3">
                No expenses logged under this category
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Record a new payment to update ledger balances.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-slate-800">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Date & Voucher No</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Particulars / Description</th>
                    <th className="py-3 px-4">Paid via</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpenses
                    .slice()
                    .reverse()
                    .map((exp) => (
                      <tr
                        key={exp.id}
                        className="hover:bg-white/50 transition-all"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-800">
                            {exp.id}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {new Date(exp.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-[#ff7a00]/30 text-amber-700 text-[10px] font-semibold">
                            {exp.category === "Other" && exp.otherDetails
                              ? `Other (${exp.otherDetails})`
                              : exp.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-800 font-bold max-w-sm">
                          {exp.description}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-500">
                          {exp.paymentMode}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-red-500">
                          - ₹ {exp.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditExpense(exp)}
                              className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-transparent rounded-lg transition-all cursor-pointer flex items-center justify-center"
                              title="Edit Voucher"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => setDeletingExpense(exp)}
                                className="p-1.5 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-500/30 hover:border-transparent rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                title="Delete Voucher"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* RECORD EXPENSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 font-display">
                Create Outgoing Payment Voucher
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1.5 bg-white/90 backdrop-blur-md border border-slate-200 hover:bg-slate-50 hover:text-slate-800 rounded-lg text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Expense Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as Expense["category"])
                    }
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {category === "Other" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 label mb-1">
                      Other Details *
                    </label>
                    <input
                      type="text"
                      value={otherDetails}
                      onChange={(e) => setOtherDetails(e.target.value)}
                      placeholder="Specify other category details"
                      className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) =>
                      setPaymentMode(e.target.value as Expense["paymentMode"])
                    }
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  >
                    <option value="Cash">Counter Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Direct Bank Transfer</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Amount to pay (₹) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={amount === 0 ? "" : amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    placeholder="₹ Amount paid"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Voucher Particulars / Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Purchases details... e.g. Flowers, Puja rice"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                {/* Voucher File Drag Zone */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Upload Receipt Attachment (Simulated)
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                      dragOver
                        ? "border-[#ff7a00] bg-[#ff7a00]/10"
                        : attachedFileName
                          ? "border-emerald-650 bg-emerald-500/5"
                          : "border-slate-200 bg-white hover:border-[#ff7a00]/40"
                    }`}
                  >
                    <input
                      type="file"
                      id="expense-file-picker"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="expense-file-picker"
                      className="cursor-pointer"
                    >
                      <Upload
                        className={`w-6 h-6 mx-auto ${attachedFileName ? "text-emerald-600" : "text-slate-500"}`}
                      />
                      <p className="text-xs font-bold text-slate-800 mt-2">
                        {attachedFileName
                          ? `Loaded: ${attachedFileName}`
                          : "Drag receipt invoice here, or click to upload"}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        PDF, JPG, PNG voucher bills support up to 5MB
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ff7a00] hover:bg-[#ea580c] text-white font-bold text-sm px-5 py-2 rounded-xl cursor-pointer shadow-md transition-colors border-none"
                >
                  File Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EXPENSE MODAL */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 font-display flex items-center gap-1.5">
                <Edit2 className="w-4 h-4 text-blue-600" />
                <span>Modify Voucher ({editingExpense.id})</span>
              </h3>
              <button
                onClick={() => setEditingExpense(null)}
                className="p-1.5 bg-white/90 backdrop-blur-md border border-slate-200 hover:bg-slate-50 hover:text-slate-800 rounded-lg text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditExpense} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 label mb-1.5 uppercase">
                    Expense Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) =>
                      setEditCategory(e.target.value as Expense["category"])
                    }
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {editCategory === "Other" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 label mb-1.5 uppercase">
                      Other Details *
                    </label>
                    <input
                      type="text"
                      value={editOtherDetails}
                      onChange={(e) => setEditOtherDetails(e.target.value)}
                      placeholder="Specify other category details"
                      className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 label mb-1.5 uppercase">
                    Payment Method *
                  </label>
                  <select
                    value={editPaymentMode}
                    onChange={(e) =>
                      setEditPaymentMode(
                        e.target.value as Expense["paymentMode"],
                      )
                    }
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  >
                    <option value="Cash">Counter Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Direct Bank Transfer</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 label mb-1.5 uppercase">
                    Amount to pay (₹) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editAmount === 0 ? "" : editAmount}
                    onChange={(e) =>
                      setEditAmount(parseInt(e.target.value) || 0)
                    }
                    placeholder="₹ Amount paid"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 label mb-1.5 uppercase">
                    Voucher Particulars / Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Purchases details... e.g. Flowers, Puja rice"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2 rounded-xl cursor-pointer shadow-md transition-colors border-none"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* DELETE VOUCHER CONFIRMATION MODAL */}
      {deletingExpense && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-150">
            <div className="bg-rose-50 border-b border-rose-100 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-700 font-bold font-display text-base">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <span>Confirm Voucher Cancellation</span>
              </div>
              <button
                type="button"
                onClick={() => setDeletingExpense(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-700 leading-relaxed">
                Are you sure you want to permanently delete expense voucher{" "}
                <strong className="font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {deletingExpense.id}
                </strong>
                ?
              </p>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Category:</span>
                  <span className="font-bold text-slate-800">
                    {deletingExpense.category}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-slate-500 font-medium shrink-0">
                    Particulars:
                  </span>
                  <span className="font-semibold text-slate-800 text-right text-[11px] line-clamp-2">
                    {deletingExpense.description}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-2 mt-1">
                  <span className="text-slate-500 font-medium">Voucher Amount:</span>
                  <span className="font-mono font-extrabold text-rose-600 text-sm">
                    - ₹ {deletingExpense.amount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Payment Mode:</span>
                  <span className="font-semibold text-slate-700">
                    {deletingExpense.paymentMode}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-800 space-y-1">
                <span className="font-bold block">Account Reversal Notice:</span>
                <p>
                  Deleting this voucher will automatically reverse the deduction of{" "}
                  <strong>₹ {deletingExpense.amount.toLocaleString("en-IN")}</strong>{" "}
                  back to the{" "}
                  {deletingExpense.paymentMode === "Cash"
                    ? "Counter Safe Cash"
                    : "Bank Account"}{" "}
                  ledger.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeletingExpense(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isAdmin) {
                      alert("Access Denied: Only Administrators can delete expense vouchers.");
                      setDeletingExpense(null);
                      return;
                    }
                    onDeleteExpense(deletingExpense.id);
                    setDeletingExpense(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5 border-none"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Voucher</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
