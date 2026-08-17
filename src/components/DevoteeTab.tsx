/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  UserPlus,
  BookOpen,
  Users,
  Phone,
  MapPin,
  Info,
  Check,
  X,
  History,
  Mail,
  Download,
} from "lucide-react";
import { Devotee, Bill, SystemUser } from "../types";
import { useLanguage } from "../context/LanguageContext";
import TranslitInput from "./TranslitInput";

interface DevoteeTabProps {
  devotees: Devotee[];
  bills: Bill[];
  currentUser?: SystemUser | null;
  onAddDevotee: (devotee: Omit<Devotee, "id" | "createdAt">) => void;
  onUpdateDevotee: (devotee: Devotee) => void;
  onDeleteDevotee: (id: string) => void;
}

const GOTHRA_LIST = [
  "Vashishta",
  "Kashyapa",
  "Bharadwaj",
  "Shrivatsa",
  "Vishwamitra",
  "Gautama",
  "Atreya",
  "Haritasa",
  "Kaushika",
  "Jamadagni",
  "Angirasa",
  "Shandilya",
  "Nithyandana",
  "Shiva Gothra",
  "Sree Sai Gothra / Shiva Gothra",
  "Sankalpa Gothra",
];
const NAKSHATRA_LIST = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Poorva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Poorva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Poorva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];
const RASHI_LIST = [
  "Mesha (Aries)",
  "Vrishabha (Taurus)",
  "Mithuna (Gemini)",
  "Karka (Cancer)",
  "Simha (Leo)",
  "Kanya (Virgo)",
  "Tula (Libra)",
  "Vrischika (Scorpio)",
  "Dhanus (Sagittarius)",
  "Makara (Capricorn)",
  "Kumbha (Aquarius)",
  "Meena (Pisces)",
];

export default function DevoteeTab({
  devotees,
  bills,
  currentUser,
  onAddDevotee,
  onUpdateDevotee,
  onDeleteDevotee,
}: DevoteeTabProps) {
  const { t } = useLanguage();
  const isAdmin = currentUser?.role === "Administrator";
  const [searchQuery, setSearchQuery] = useState("");
  const [gothraFilter, setGothraFilter] = useState("");
  const [nakshatraFilter, setNakshatraFilter] = useState("");
  const [selectedDevotee, setSelectedDevotee] = useState<Devotee | null>(null);
  const [deletingDevotee, setDeletingDevotee] = useState<Devotee | null>(null);

  // Registration Modals
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gothra, setGothra] = useState(GOTHRA_LIST[0]);
  const [nakshatra, setNakshatra] = useState(NAKSHATRA_LIST[0]);
  const [rashi, setRashi] = useState(RASHI_LIST[0]);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [remarks, setRemarks] = useState("");

  // Family Members Sub-Form
  const [familyMembers, setFamilyMembers] = useState<
    { name: string; relation: string }[]
  >([]);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [newFamilyRelation, setNewFamilyRelation] = useState("Spouse");

  // Filter devotees
  const filteredDevotees = useMemo(() => {
    return devotees.filter((dev) => {
      const dbMatch =
        dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.phone.includes(searchQuery) ||
        dev.id.toLowerCase().includes(searchQuery.toLowerCase());

      const gothraMatch = gothraFilter ? dev.gothra === gothraFilter : true;
      const nakshatraMatch = nakshatraFilter
        ? dev.nakshatra === nakshatraFilter
        : true;

      return dbMatch && gothraMatch && nakshatraMatch;
    });
  }, [devotees, searchQuery, gothraFilter, nakshatraFilter]);

  // Devotee Bookings history
  const getDevoteeHistory = (dev: Devotee) => {
    return bills.filter(
      (b) =>
        (b.devoteeId === dev.id ||
          (b.devoteeId === undefined &&
            b.phone === dev.phone &&
            b.devoteeName === dev.name)) &&
        !b.isCancelled,
    );
  };

  const handleDownloadExcel = () => {
    if (!isAdmin) {
      alert("Access Denied: Only Administrator accounts can export and download devotee directories.");
      return;
    }
    const headers = [
      "ID",
      "Full Name",
      "Mobile No.",
      "Gothra",
      "Nakshatra",
      "Rashi",
      "Address",
      "Email",
      "Remarks",
      "Registered On",
    ];

    const rows = devotees.map((dev) => [
      dev.id,
      `"${dev.name.replace(/"/g, '""')}"`,
      `"${dev.phone}"`,
      `"${dev.gothra}"`,
      `"${dev.nakshatra}"`,
      `"${dev.rashi}"`,
      `"${(dev.address || "").replace(/"/g, '""')}"`,
      `"${(dev.email || "").replace(/"/g, '""')}"`,
      `"${(dev.remarks || "").replace(/"/g, '""')}"`,
      new Date(dev.createdAt).toLocaleDateString(),
    ]);

    const csvString =
      "\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Devotee_Directory_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Open register / Edit models
  const openRegisterModal = () => {
    setIsEditMode(false);
    setName("");
    setPhone("");
    setGothra("Sankalpa Gothra");
    setNakshatra("Rohini");
    setRashi("Vrishabha (Taurus)");
    setAddress("");
    setEmail("");
    setRemarks("");
    setFamilyMembers([]);
    setIsRegModalOpen(true);
  };

  const openEditModal = (dev: Devotee) => {
    setIsEditMode(true);
    setSelectedDevotee(dev);
    setName(dev.name);
    setPhone(dev.phone);
    setGothra(dev.gothra);
    setNakshatra(dev.nakshatra);
    setRashi(dev.rashi);
    setAddress(dev.address || "");
    setEmail(dev.email || "");
    setRemarks(dev.remarks || "");
    setFamilyMembers(dev.familyMembers || []);
    setIsRegModalOpen(true);
  };

  const addFamilyMember = () => {
    if (!newFamilyName.trim()) return;
    setFamilyMembers([
      ...familyMembers,
      { name: newFamilyName, relation: newFamilyRelation },
    ]);
    setNewFamilyName("");
  };

  const removeFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Please provide devotee name and phone number");
      return;
    }

    const devoteeData = {
      name,
      phone,
      gothra,
      nakshatra,
      rashi,
      address: address.trim() || undefined,
      email: email.trim() || undefined,
      remarks: remarks.trim() || undefined,
      familyMembers: familyMembers.length > 0 ? familyMembers : undefined,
    };

    if (isEditMode && selectedDevotee) {
      onUpdateDevotee({
        ...selectedDevotee,
        ...devoteeData,
      });
      // Update local quick view too
      setSelectedDevotee({
        ...selectedDevotee,
        ...devoteeData,
      });
    } else {
      onAddDevotee(devoteeData);
    }

    setIsRegModalOpen(false);
  };

  return (
    <div className="space-y-6" id="devotee-tab">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
            <Users className="w-5.5 h-5.5 text-amber-600" />
            <span>{t("dev.title")}</span>
          </h2>
          <p className="text-xs text-slate-500">{t("dev.subtitle")}</p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={handleDownloadExcel}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <Download className="w-4.5 h-4.5" />
              <span>Download Excel</span>
            </button>
          )}
          <button
            onClick={openRegisterModal}
            className="bg-[#ff7a00] hover:bg-[#ea580c] text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-950/20 transition-all border-none"
          >
            <UserPlus className="w-4.5 h-4.5" />
            <span>{t("dev.addBtn")}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left List Card with Search Filters */}
        <div className="lg:col-span-3 bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Filters Bar */}
          <div className="p-4 bg-white border-b border-slate-200 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("dev.search")}
                className="w-full bg-white/90 backdrop-blur-md text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={gothraFilter}
                onChange={(e) => setGothraFilter(e.target.value)}
                className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#ff7a00]"
              >
                <option value="">Any Gothra</option>
                {GOTHRA_LIST.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              <select
                value={nakshatraFilter}
                onChange={(e) => setNakshatraFilter(e.target.value)}
                className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#ff7a00]"
              >
                <option value="">Any Nakshatra</option>
                {NAKSHATRA_LIST.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Devotees Grid List */}
          {filteredDevotees.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-500/50 mx-auto" />
              <p className="text-slate-500 font-semibold text-sm mt-3">
                No devotees found matching filters
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Try relaxing filters or register a new family devotee profile.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 flex-1 min-h-[500px] max-h-[700px] overflow-y-auto light-scrollbar">
              {filteredDevotees.map((dev) => (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDevotee(dev)}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer hover:bg-white/50 transition-colors ${
                    selectedDevotee?.id === dev.id
                      ? "bg-[#ff7a00]/5 border-l-4 border-[#ff7a00] pl-3.5"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-[#ff7a00]/30/60 text-amber-700 shrink-0 select-none">
                      <span className="font-mono text-xs font-bold">
                        {dev.id}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <span>{dev.name}</span>
                        {dev.familyMembers && dev.familyMembers.length > 0 && (
                          <span className="bg-amber-100 border border-[#ff7a00]/30 text-[10px] text-amber-750 px-1.5 py-0.5 rounded-full font-mono font-medium">
                            +{dev.familyMembers.length} Family
                          </span>
                        )}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-amber-600" />
                          {dev.phone}
                        </span>
                        <span>|</span>
                        <span>
                          Gothra: <strong>{dev.gothra}</strong>
                        </span>
                        <span>|</span>
                        <span>
                          Nakshatra: <strong>{dev.nakshatra}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(dev);
                      }}
                      className="p-1.5 px-3 bg-white hover:bg-[#ff7a00] text-slate-800 hover:text-white text-xs font-bold rounded-lg border border-slate-200 hover:border-transparent cursor-pointer transition-colors"
                    >
                      Edit
                    </button>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingDevotee(dev);
                        }}
                        className="p-1 px-1.5 bg-white/90 backdrop-blur-md hover:bg-red-50 border border-slate-200 text-slate-500 hover:text-red-500 rounded-lg cursor-pointer"
                        title="Delete profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Detail Card for Selected Devotee */}
        <div className="lg:col-span-1">
          {selectedDevotee ? (
            <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 sticky top-4">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[10px] font-bold font-mono tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md uppercase border border-[#ff7a00]/30/60">
                  {selectedDevotee.id}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-3.5 font-display">
                  {selectedDevotee.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  {selectedDevotee.phone}
                </p>
              </div>

              {/* Spiritual Profiles */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block text-[9px] font-bold uppercase tracking-wider">
                    Gothra
                  </span>
                  <span className="font-bold text-slate-800 mt-1 block truncate">
                    {selectedDevotee.gothra}
                  </span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block text-[9px] font-bold uppercase tracking-wider">
                    Nakshatra
                  </span>
                  <span className="font-bold text-slate-800 mt-1 block truncate">
                    {selectedDevotee.nakshatra}
                  </span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block text-[9px] font-bold uppercase tracking-wider">
                    Rashi
                  </span>
                  <span className="font-bold text-slate-800 mt-1 block truncate">
                    {selectedDevotee.rashi}
                  </span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl col-span-2">
                  <span className="text-slate-500 block text-[9px] font-bold uppercase tracking-wider">
                    Devotee Address
                  </span>
                  <span className="font-bold text-slate-800 mt-1 block break-words whitespace-normal">
                    {selectedDevotee.address || "No address provided."}
                  </span>
                </div>
              </div>

              {/* Family Directory */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Registered Family Members
                </h4>
                {!selectedDevotee.familyMembers ||
                selectedDevotee.familyMembers.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    No family members listed.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 light-scrollbar">
                    {selectedDevotee.familyMembers.map((fam, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs p-2 bg-white rounded-lg border border-slate-200"
                      >
                        <span className="font-semibold text-slate-800">
                          {fam.name}
                        </span>
                        <span className="text-[9px] bg-amber-50 font-bold px-1.5 py-0.5 rounded text-amber-700 border border-[#ff7a00]/30/50">
                          {fam.relation}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remarks info if exists */}
              {selectedDevotee.remarks && (
                <div className="p-3 bg-amber-50 rounded-xl border border-[#ff7a00]/30">
                  <span className="text-[9px] uppercase font-bold text-amber-700 flex items-center gap-1 mb-1 tracking-wider">
                    <Info className="w-3.5 h-3.5 shrink-0" /> Note from Counter
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    {selectedDevotee.remarks}
                  </p>
                </div>
              )}

              {/* Devotee bookings history */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <History className="w-3.5 h-3.5 text-amber-600" />
                  <span>Recent Pujas Booked</span>
                </h4>

                {getDevoteeHistory(selectedDevotee).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    No past bookings on file.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1 light-scrollbar">
                    {getDevoteeHistory(selectedDevotee)
                      .slice()
                      .reverse()
                      .map((bill) => (
                        <div
                          key={bill.id}
                          className="text-xs p-2 bg-white border border-slate-200 rounded-xl flex justify-between items-center"
                        >
                          <div>
                            <span className="font-mono font-bold text-slate-800 block">
                              {bill.id}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                              {bill.createdAt.split("T")[0]}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-amber-600">
                            ₹{bill.grandTotal}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-8 text-center text-slate-500 h-64 flex flex-col items-center justify-center sticky top-4 shadow-sm">
              <BookOpen className="w-8 h-8 text-slate-500/50 stroke-[1.5] mb-2" />
              <p className="text-xs font-bold text-slate-500 font-display uppercase tracking-wider">
                No devotee selected
              </p>
              <p className="text-[10px] text-slate-500 mt-1.5 max-w-[150px] mx-auto leading-relaxed">
                Click any devotee in the directory to inspect profiling
              </p>
            </div>
          )}
        </div>
      </div>

      {/* REGISTRATION & EDIT MODAL */}
      {isRegModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 font-display">
                {isEditMode
                  ? `Modify Profile: ${selectedDevotee?.id}`
                  : "Register Devotee Profile"}
              </h3>
              <button
                onClick={() => setIsRegModalOpen(false)}
                className="p-1.5 bg-white/90 backdrop-blur-md border border-slate-200 hover:bg-white hover:text-slate-800 rounded-lg text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Full Name *
                  </label>
                  <TranslitInput
                    value={name}
                    onChange={(val) => setName(val)}
                    placeholder="Sri/Smt Devotee Name"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Phone Number (10 digit) *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Gothra
                  </label>
                  <TranslitInput
                    value={gothra}
                    onChange={(val) => setGothra(val)}
                    placeholder="e.g. Kashyapa"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Nakshatra
                  </label>
                  <TranslitInput
                    value={nakshatra}
                    onChange={(val) => setNakshatra(val)}
                    placeholder="e.g. Rohini"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Rashi (Zodiac)
                  </label>
                  <TranslitInput
                    value={rashi}
                    onChange={(val) => setRashi(val)}
                    placeholder="e.g. Vrishabha"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Residential Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Bangalore Address"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Email ID (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="temple.devotee@example.com"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 label mb-1">
                    Counter Notes / Remarks (e.g., Alankara Sponsor)
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Notes regarding devotee poojas"
                    className="w-full h-16 bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00] resize-none"
                  />
                </div>
              </div>

              {/* Family Members Sub Form */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 font-display">
                  Configure Family Tree (Puja Sankalpa)
                </h4>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    placeholder="Relation name"
                    className="flex-1 bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-hidden focus:border-[#ff7a00]"
                  />
                  <select
                    value={newFamilyRelation}
                    onChange={(e) => setNewFamilyRelation(e.target.value)}
                    className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 text-xs rounded-lg px-2"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                  </select>
                  <button
                    type="button"
                    onClick={addFamilyMember}
                    className="bg-white hover:bg-[#ff7a00] border border-slate-200 text-slate-800 hover:text-white font-bold px-3 py-1.5 text-xs rounded-lg shrink-0 cursor-pointer transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {familyMembers.map((fam, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-xs bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg"
                    >
                      <span>
                        {fam.name} ({fam.relation})
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFamilyMember(idx)}
                        className="p-0.5 hover:bg-slate-50 rounded text-slate-500 hover:text-red-500 cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRegModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ff7a00] hover:bg-[#ea580c] text-white font-bold text-sm px-5 py-2 rounded-xl cursor-pointer shadow-md transition-colors border-none"
                >
                  {isEditMode ? "Update Profile" : "Save Devotee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* DELETE DEVOTEE CONFIRMATION MODAL */}
      {deletingDevotee && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-rose-50 border-b border-rose-100 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-700 font-bold font-display text-base">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <span>Confirm Devotee Profile Deletion</span>
              </div>
              <button
                type="button"
                onClick={() => setDeletingDevotee(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-700 leading-relaxed">
                Are you sure you want to permanently delete profile for <strong>{deletingDevotee.name}</strong> ({deletingDevotee.id})?
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-semibold text-slate-800">{deletingDevotee.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gothra:</span>
                  <span className="font-semibold text-slate-800">{deletingDevotee.gothra}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nakshatra / Rashi:</span>
                  <span className="font-semibold text-slate-800">{deletingDevotee.nakshatra} ({deletingDevotee.rashi})</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeletingDevotee(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isAdmin) {
                      alert("Access Denied: Only Administrators can delete devotee records.");
                      setDeletingDevotee(null);
                      return;
                    }
                    onDeleteDevotee(deletingDevotee.id);
                    if (selectedDevotee?.id === deletingDevotee.id) {
                      setSelectedDevotee(null);
                    }
                    setDeletingDevotee(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer border-none"
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
