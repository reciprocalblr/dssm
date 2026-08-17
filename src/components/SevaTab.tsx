/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Check,
  Trash2,
  X,
  ToggleLeft,
  ToggleRight,
  Hash,
  Layers,
  IndianRupee,
} from "lucide-react";
import { Seva, SystemUser } from "../types";
import { useLanguage } from "../context/LanguageContext";
import TranslitInput from "./TranslitInput";

interface SevaTabProps {
  sevas: Seva[];
  currentUser?: SystemUser | null;
  onAddSeva: (seva: Omit<Seva, "id">) => void;
  onUpdateSeva: (seva: Seva) => void;
  onDeleteSeva: (id: string) => void;
}

const CATEGORIES = [
  "Daily Pooja",
  "Abhishekha",
  "Special Seva",
  "Homa",
  "Prasada",
  "Donation",
];

export default function SevaTab({
  sevas,
  currentUser,
  onAddSeva,
  onUpdateSeva,
  onDeleteSeva,
}: SevaTabProps) {
  const { t } = useLanguage();
  const isAdmin = currentUser?.role === "Administrator";
  const [searchSeva, setSearchSeva] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Modal configurations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSeva, setEditingSeva] = useState<Seva | null>(null);
  const [deletingSeva, setDeletingSeva] = useState<Seva | null>(null);

  // Form parameters
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState<Seva["category"]>("Daily Pooja");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Filters calculation
  const filteredSevas = useMemo(() => {
    return sevas.filter((seva) => {
      const textMatch =
        seva.name.toLowerCase().includes(searchSeva.toLowerCase()) ||
        seva.code.toLowerCase().includes(searchSeva.toLowerCase());

      const catMatch = categoryFilter ? seva.category === categoryFilter : true;
      return textMatch && catMatch;
    });
  }, [sevas, searchSeva, categoryFilter]);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setName("");
    setCode("");
    setPrice(100);
    setCategory("Daily Pooja");
    setDescription("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (seva: Seva) => {
    setIsEditMode(true);
    setEditingSeva(seva);
    setName(seva.name);
    setCode(seva.code);
    setPrice(seva.price);
    setCategory(seva.category);
    setDescription(seva.description);
    setIsActive(seva.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      alert("Name and Short code are required fields");
      return;
    }

    const sevaPayload = {
      name,
      code: code.trim().toUpperCase(),
      price,
      category,
      description,
      isActive,
    };

    if (isEditMode && editingSeva) {
      onUpdateSeva({
        ...editingSeva,
        ...sevaPayload,
      });
    } else {
      onAddSeva(sevaPayload);
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = (seva: Seva) => {
    onUpdateSeva({
      ...seva,
      isActive: !seva.isActive,
    });
  };

  const totalSevasCount = sevas.length;
  const activeSevasCount = sevas.filter((s) => s.isActive).length;
  const averagePrice =
    sevas.length > 0
      ? Math.round(sevas.reduce((acc, s) => acc + s.price, 0) / sevas.length)
      : 0;
  const specialSevasCount = sevas.filter(
    (s) =>
      s.category === "Special Seva" ||
      s.category === "Abhishekha" ||
      s.category === "Homa",
  ).length;

  return (
    <div className="space-y-6" id="seva-tab">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
            <Layers className="w-5.5 h-5.5 text-amber-600" />
            <span>{t("seva.title")}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {t("seva.subtitle")}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-[#ff7a00] hover:bg-[#ea580c] text-white font-black text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-950/20 transition-all border-none"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>{t("seva.addBtn")}</span>
        </button>
      </div>

      {/* LIGHT METRIC CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3.5 bg-amber-50/70 border-2 border-[#ff7a00]/30 rounded-2xl shadow-xs">
          <span className="text-amber-800 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider block">
            Total Cataloged
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h4 className="text-2xl font-black text-amber-900 font-display">
              {totalSevasCount}
            </h4>
            <span className="text-[10px] font-bold text-amber-655">
              Mandira Rituals
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50/70 border-2 border-emerald-500/30 rounded-2xl shadow-xs">
          <span className="text-emerald-800 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider block">
            Currently Active
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h4 className="text-2xl font-black text-emerald-900 font-display">
              {activeSevasCount}
            </h4>
            <span className="text-[10px] font-bold text-emerald-655">
              Ready to Book
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-sky-50/70 border-2 border-sky-500/30 rounded-2xl shadow-xs">
          <span className="text-sky-800 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider block">
            Average Seva Fee
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h4 className="text-2xl font-black text-sky-900 font-display">
              ₹ {averagePrice}
            </h4>
            <span className="text-[10px] font-bold text-sky-655">
              per booking
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-rose-50/70 border-2 border-rose-500/30 rounded-2xl shadow-xs">
          <span className="text-rose-800 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider block">
            Special Poojas
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h4 className="text-2xl font-black text-rose-900 font-display">
              {specialSevasCount}
            </h4>
            <span className="text-[10px] font-bold text-rose-655">
              Homa &amp; Spls
            </span>
          </div>
        </div>
      </div>

      {/* Grid of config search filters */}
      <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-3.5 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchSeva}
            onChange={(e) => setSearchSeva(e.target.value)}
            placeholder="Search by ritual name, abbreviation..."
            className="w-full bg-white text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-hidden focus:border-[#ff7a00]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-[#ff7a00]"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Sevas Listing layout */}
      <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-800">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-500 font-black uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-32">Seva Code</th>
                <th className="py-3 px-4 font-display">Ritual Name</th>
                <th className="py-3 px-4 w-40">Category</th>
                <th className="py-3 px-4 w-32 text-right">Price (₹)</th>
                <th className="py-3 px-4 w-32 text-center">Status</th>
                <th className="py-3 px-4 w-44 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {filteredSevas.map((seva) => (
                <tr key={seva.id} className="hover:bg-white/50 transition-all">
                  <td className="py-3 px-4 font-mono font-black text-amber-600 text-sm md:text-base uppercase">
                    {seva.code}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-extrabold text-[#ea580c] text-sm sm:text-base">
                      {seva.name}
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-relaxed max-w-xl">
                      {seva.description}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-extrabold text-[10px] border border-[#ff7a00]/30/55">
                      {seva.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-black text-slate-900 text-sm sm:text-base">
                    {seva.price === 0 ? (
                      <span className="text-[#ff7a00] font-sans font-bold text-xs">
                        Custom
                      </span>
                    ) : (
                      `₹ ${seva.price.toLocaleString("en-IN")}`
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(seva)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border transition-all cursor-pointer ${
                        seva.isActive
                          ? "bg-emerald-50 text-emerald-800 border-emerald-500/30"
                          : "bg-red-50 text-red-800 border-red-250"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${seva.isActive ? "bg-emerald-600" : "bg-red-600"}`}
                      />
                      <span>{seva.isActive ? "Active" : "Suspended"}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(seva)}
                        className="p-1.5 px-3 bg-white hover:bg-[#ff7a00] border border-slate-200 font-black text-slate-800 hover:text-white rounded-lg text-xs cursor-pointer transition-colors"
                      >
                        Edit Price
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => setDeletingSeva(seva)}
                          className="p-1.5 px-2 bg-white/90 backdrop-blur-md hover:bg-red-50 border border-slate-200 text-slate-500 hover:text-red-600 rounded-lg cursor-pointer transition-all"
                          title="Delete seva config"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSevas.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-slate-500 text-base font-bold"
                  >
                    No temple poojas configured on this terminal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE & EDIT SEVA CONFIGURATION DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-black text-slate-800 font-display">
                {isEditMode
                  ? `Edit Seva Catalog: ${editingSeva?.code}`
                  : "Add Ritual / Seva directly into Catalog"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-white/90 backdrop-blur-md border border-slate-200 hover:bg-white hover:text-slate-800 rounded-lg text-slate-500 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-black text-slate-800 label mb-1.5">
                    Ritual Seva Name *
                  </label>
                  <TranslitInput
                    required={true}
                    value={name}
                    onChange={(val) => setName(val)}
                    placeholder="e.g. Sahasranama Trishathi Poojarthi Seva"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-800 label mb-1.5">
                    Codename prefix *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. SNK"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-base font-mono focus:outline-hidden focus:border-[#ff7a00] uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-800 label mb-1.5">
                    Price (₹) (0 for custom)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    placeholder="101"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-base font-mono focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-black text-slate-800 label mb-1.5">
                    Account Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as Seva["category"])
                    }
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-hidden focus:border-[#ff7a00]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-black text-slate-800 label mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details regarding Prasada and perform-timing"
                    className="w-full h-24 bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-hidden focus:border-[#ff7a00] resize-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl mt-1">
                  <div>
                    <span className="block text-base font-black text-slate-800">
                      Seva Availability Status
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      Suspended sevas can't be booked on counters
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className="text-stone-600 cursor-pointer"
                  >
                    {isActive ? (
                      <ToggleRight className="w-12 h-12 text-[#ff7a00]" />
                    ) : (
                      <ToggleLeft className="w-12 h-12 text-slate-500/70" />
                    )}
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-500 hover:text-slate-800 text-base font-black rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ff7a00] hover:bg-[#ea580c] text-white font-black text-base px-6 py-2.5 rounded-xl cursor-pointer shadow-md transition-colors border-none"
                >
                  {isEditMode ? "Save Modifications" : "Create Seva"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* DELETE SEVA CONFIRMATION MODAL */}
      {deletingSeva && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-rose-50 border-b border-rose-100 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-700 font-bold font-display text-base">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <span>Confirm Seva Removal</span>
              </div>
              <button
                type="button"
                onClick={() => setDeletingSeva(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-700 leading-relaxed">
                Are you sure you want to remove <strong>{deletingSeva.name}</strong> ({deletingSeva.code}) from the active seva register?
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800">{deletingSeva.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fixed Rate:</span>
                  <span className="font-mono font-bold text-slate-800">₹ {deletingSeva.price.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeletingSeva(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isAdmin) {
                      alert("Access Denied: Only Administrators can delete seva items.");
                      setDeletingSeva(null);
                      return;
                    }
                    onDeleteSeva(deletingSeva.id);
                    setDeletingSeva(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer border-none"
                >
                  Remove Seva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
