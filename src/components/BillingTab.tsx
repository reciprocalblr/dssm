/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  Search,
  User,
  Trash2,
  Edit2,
  Plus,
  Minus,
  FileSpreadsheet,
  CreditCard,
  Receipt,
  HelpCircle,
  Sparkles,
  UserPlus,
  ArrowRight,
  Check,
  CheckCircle,
  X,
  IndianRupee,
  Barcode,
  Printer,
} from "lucide-react";
import {
  Devotee,
  Seva,
  Bill,
  BillItem,
  TempleSettings,
  SystemUser,
} from "../types";
import { useLanguage } from "../context/LanguageContext";
import TranslitInput from "./TranslitInput";

interface BillingTabProps {
  bills: Bill[];
  devotees: Devotee[];
  sevas: Seva[];
  settings: TempleSettings;
  currentUser: SystemUser;
  onAddBill: (bill: Omit<Bill, "id" | "createdAt">) => void;
  onUpdateBill?: (bill: Bill) => void;
  onDeleteBill?: (id: string) => void;
  setCurrentTab: (tab: string) => void;
  onQuickAddDevotee: () => void;
  activeBillForReceiptModal: Bill | null;
  setActiveBillForReceiptModal: (bill: Bill | null) => void;
  cartItems: {
    seva: Seva;
    count: number;
    customPrice?: number; // for general donations (Kanike)
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

const MONTHS_LIST = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];

const YEARS_LIST = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

const CATEGORIES = [
  "All",
  "Daily Pooja",
  "Abhishekha",
  "Special Seva",
  "Homa",
  "Prasada",
  "Donation",
];

export default function BillingTab({
  bills,
  devotees,
  sevas,
  settings,
  currentUser,
  onAddBill,
  onUpdateBill,
  onDeleteBill,
  setCurrentTab,
  onQuickAddDevotee,
  activeBillForReceiptModal,
  setActiveBillForReceiptModal,
  cartItems,
  setCartItems,
}: BillingTabProps) {
  const { t, language } = useLanguage();

  // 1. DEVOTEE SELECTOR STATE
  const [isGuestMode, setIsGuestMode] = useState(true);
  const [searchDevoteeQuery, setSearchDevoteeQuery] = useState("");
  const [selectedDevotee, setSelectedDevotee] = useState<Devotee | null>(null);

  // Guest inputs
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestGothra, setGuestGothra] = useState("");
  const [guestNakshatra, setGuestNakshatra] = useState("");
  const [guestRashi, setGuestRashi] = useState("");
  const [guestAddress, setGuestAddress] = useState("");
  const [justPropagated, setJustPropagated] = useState(false);

  // Find matching registered devotee profiles based on guestPhone characters typed
  const phoneMatches = useMemo(() => {
    const sanitized = guestPhone.trim();
    if (sanitized.length < 3) return [];

    return devotees.filter((dev) => {
      if (!dev.phone) return false;
      const matchPhone = dev.phone.trim();

      // Is it a match?
      const isMatch = matchPhone.includes(sanitized);

      // If it matches but is already fully filled, omit it
      const isAlreadyFilled =
        dev.phone === guestPhone && dev.name === guestName;

      return isMatch && !isAlreadyFilled;
    });
  }, [devotees, guestPhone, guestName]);

  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "");
    setGuestPhone(digitsOnly);

    const trimmedVal = digitsOnly;
    if (trimmedVal.length >= 4) {
      // Find direct exact match if fully entered
      const exactMatch = devotees.find(
        (dev) => dev.phone && dev.phone.trim() === trimmedVal,
      );
      if (exactMatch) {
        setGuestName(exactMatch.name);
        setGuestGothra(exactMatch.gothra);
        setGuestNakshatra(exactMatch.nakshatra);
        setGuestRashi(exactMatch.rashi);
        setGuestAddress(exactMatch.address || "");
      }
    }
  };

  // 2. SEVA GRID FILTERS
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchSevaQuery, setSearchSevaQuery] = useState("");

  // 4. CHECKOUT CONTROLS
  const [paymentMode, setPaymentMode] = useState<
    "Cash" | "UPI" | "Card" | "Bank Transfer"
  >("Cash");
  const [upiRef, setUpiRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 5. RECENT SPOOLED BILLS FILTER
  const [billFilter, setBillFilter] = useState<
    "today" | "custom" | "month" | "year" | "range"
  >("today");
  const [customDate, setCustomDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [selectedFilterMonth, setSelectedFilterMonth] = useState<number>(() =>
    new Date().getMonth(),
  );
  const [selectedFilterMonthYear, setSelectedFilterMonthYear] =
    useState<number>(() => new Date().getFullYear());
  const [selectedFilterYear, setSelectedFilterYear] = useState<number>(() =>
    new Date().getFullYear(),
  );
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });

  // 6. INVOICE EDIT / DELETE ACTIONS STATE
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [editDevoteeName, setEditDevoteeName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editGothra, setEditGothra] = useState("");
  const [editNakshatra, setEditNakshatra] = useState("");
  const [editRashi, setEditRashi] = useState("");
  const [editPaymentMode, setEditPaymentMode] = useState<
    "Cash" | "UPI" | "Card" | "Bank Transfer"
  >("Cash");
  const [deleteConfirmBillId, setDeleteConfirmBillId] = useState<string | null>(
    null,
  );

  const handleOpenEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setEditDevoteeName(bill.devoteeName || "");
    setEditPhone(bill.phone || "");
    setEditGothra(bill.gothra || GOTHRA_LIST[0]);
    setEditNakshatra(bill.nakshatra || NAKSHATRA_LIST[0]);
    setEditRashi(bill.rashi || RASHI_LIST[0]);
    setEditPaymentMode(bill.paymentMode || "Cash");
  };

  const handleSaveEditBill = () => {
    if (!editingBill) return;
    if (!editDevoteeName.trim()) {
      alert("Devotee Name is required.");
      return;
    }
    const updatedBill: Bill = {
      ...editingBill,
      devoteeName: editDevoteeName.trim(),
      phone: editPhone.trim(),
      gothra: editGothra,
      nakshatra: editNakshatra,
      rashi: editRashi,
      paymentMode: editPaymentMode,
    };
    if (onUpdateBill) {
      onUpdateBill(updatedBill);
    }
    setEditingBill(null);
  };

  const handleConfirmDeleteBill = (id: string) => {
    if (currentUser?.role !== "Administrator") {
      alert("Access Denied: Only Administrator accounts can delete invoice records.");
      setDeleteConfirmBillId(null);
      return;
    }
    if (onDeleteBill) {
      onDeleteBill(id);
    }
    setDeleteConfirmBillId(null);
  };

  const filteredRecentBills = useMemo(() => {
    if (!bills) return [];
    return bills.filter((bill) => {
      // bill.createdAt represents ISO timestamp
      const billDate = new Date(bill.createdAt);
      const billDateStr = bill.createdAt.split("T")[0]; // Format: YYYY-MM-DD

      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];

      if (billFilter === "today") {
        return billDateStr === todayStr;
      } else if (billFilter === "custom") {
        return billDateStr === customDate;
      } else if (billFilter === "month") {
        return (
          billDate.getFullYear() === selectedFilterMonthYear &&
          billDate.getMonth() === selectedFilterMonth
        );
      } else if (billFilter === "year") {
        return billDate.getFullYear() === selectedFilterYear;
      } else if (billFilter === "range") {
        return billDateStr >= startDate && billDateStr <= endDate;
      }
      return true;
    });
  }, [
    bills,
    billFilter,
    customDate,
    selectedFilterMonth,
    selectedFilterMonthYear,
    selectedFilterYear,
    startDate,
    endDate,
  ]);

  // Filter devotees list for selector dropdown
  const filteredDevoteesDropdown = useMemo(() => {
    if (!searchDevoteeQuery.trim() || selectedDevotee) return [];
    return devotees
      .filter(
        (dev) =>
          dev.name.toLowerCase().includes(searchDevoteeQuery.toLowerCase()) ||
          dev.phone.includes(searchDevoteeQuery),
      )
      .slice(0, 5);
  }, [devotees, searchDevoteeQuery, selectedDevotee]);

  // Filter Sevas according to search and category tabs
  const filteredSevas = useMemo(() => {
    return sevas.filter((seva) => {
      if (!seva.isActive) return false;
      const categoryMatch =
        activeCategory === "All" ? true : seva.category === activeCategory;
      const textMatch =
        seva.name.toLowerCase().includes(searchSevaQuery.toLowerCase()) ||
        seva.code.toLowerCase().includes(searchSevaQuery.toLowerCase());
      return categoryMatch && textMatch;
    });
  }, [sevas, activeCategory, searchSevaQuery]);

  // Add Seva item into booking cart queue
  const handleAddSevaToCart = (seva: Seva) => {
    // Check if donation or standard
    const isDonation = seva.category === "Donation" || seva.price === 0;
    const defaultDakshina = 0;

    // Check if custom override needed
    const existing = cartItems.find((item) => item.seva.id === seva.id);
    if (existing && !isDonation) {
      setCartItems(
        cartItems.map((item) =>
          item.seva.id === seva.id ? { ...item, count: item.count + 1 } : item,
        ),
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          seva,
          count: 1,
          customPrice: isDonation ? 500 : undefined, // default custom donation value
          pujariDakshina: defaultDakshina,
          overrideDevoteeName: undefined,
          overrideGothra: undefined,
          overrideNakshatra: undefined,
        },
      ]);
    }
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, idx) => idx !== index));
  };

  const handleUpdateCount = (index: number, newCount: number) => {
    if (newCount < 1) return;
    setCartItems(
      cartItems.map((item, idx) =>
        idx === index ? { ...item, count: newCount } : item,
      ),
    );
  };

  const handleUpdateDakshina = (index: number, val: number) => {
    if (val < 0) return;
    setCartItems(
      cartItems.map((item, idx) =>
        idx === index ? { ...item, pujariDakshina: val } : item,
      ),
    );
  };

  const handleUpdateCustomPrice = (index: number, val: number) => {
    if (val < 0) return;
    setCartItems(
      cartItems.map((item, idx) =>
        idx === index ? { ...item, customPrice: val } : item,
      ),
    );
  };

  // Calculations
  const calculatedSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const p =
        item.customPrice !== undefined ? item.customPrice : item.seva.price;
      return acc + p * item.count;
    }, 0);
  }, [cartItems]);

  const calculatedDakshinaTotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + item.pujariDakshina * item.count,
      0,
    );
  }, [cartItems]);

  const calculatedGrandTotal = calculatedSubtotal + calculatedDakshinaTotal;

  // Clear Billing Desk State
  const handleClearBillingDesk = () => {
    setSelectedDevotee(null);
    setSearchDevoteeQuery("");
    setGuestName("");
    setGuestPhone("");
    setGuestAddress("");
    setCartItems([]);
    setUpiRef("");
    setPaymentMode("Cash");
  };

  // Submit Seva billing checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("No Seva items in the ticket queue.");
      return;
    }

    // Devotee info preparation
    let clientName = "";
    let clientPhone = "";
    let clientGothra = "";
    let clientNakshatra = "";
    let clientRashi = "";
    let clientAddress = "";

    if (isGuestMode) {
      if (!guestName.trim()) {
        alert("Please enter devotee name.");
        return;
      }
      if (guestPhone.trim().length !== 10) {
        alert("Please enter exactly 10 digits for mobile no.");
        return;
      }
      clientName = guestName;
      clientPhone = guestPhone;
      clientGothra = guestGothra;
      clientNakshatra = guestNakshatra;
      clientRashi = guestRashi;
      clientAddress = guestAddress;
    } else {
      if (!selectedDevotee) {
        alert(
          "Please select a registered devotee or switch to Walk-in Guest mode",
        );
        return;
      }
      clientName = selectedDevotee.name;
      clientPhone = selectedDevotee.phone;
      clientGothra = selectedDevotee.gothra;
      clientNakshatra = selectedDevotee.nakshatra;
      clientRashi = selectedDevotee.rashi;
      clientAddress = selectedDevotee.address || "";
    }

    setIsSubmitting(true);

    const billItems: BillItem[] = cartItems.map((item, idx) => {
      const unitPrice =
        item.customPrice !== undefined ? item.customPrice : item.seva.price;
      return {
        id: `BI-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        sevaId: item.seva.id,
        sevaName: item.seva.name,
        price: unitPrice,
        count: item.count,
        pujariDakshina: item.pujariDakshina,
        bookingDate: new Date().toISOString().split("T")[0], // Booked for today
        devoteeName: clientName,
        gothra: clientGothra,
        nakshatra: clientNakshatra,
        rashi: clientRashi,
        address: clientAddress,
      };
    });

    const newBill: Omit<Bill, "id" | "createdAt"> = {
      devoteeId: isGuestMode ? undefined : selectedDevotee?.id,
      devoteeName: clientName,
      phone: clientPhone || undefined,
      gothra: clientGothra,
      nakshatra: clientNakshatra,
      rashi: clientRashi,
      address: clientAddress,
      isRegistered: !isGuestMode,
      items: billItems,
      subtotal: calculatedSubtotal,
      pujariDakshinaTotal: calculatedDakshinaTotal,
      grandTotal: calculatedGrandTotal,
      paymentMode,
      paymentReference: paymentMode === "UPI" ? upiRef : undefined,
      createdByUser: currentUser.username,
    };

    // Callback triggers state save, which populates the new bill
    onAddBill(newBill);
    setIsSubmitting(false);
    handleClearBillingDesk();
  };

  return (
    <div className="space-y-6" id="billing-tab">
      {/* Upper desk row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
            <Receipt className="w-5.5 h-5.5 text-amber-600" />
            <span>{t("bill.title")}</span>
          </h2>
          <p className="text-xs text-slate-500">{t("bill.subtitle")}</p>
        </div>

        <div className="flex gap-2 bg-white p-1.5 border border-slate-200 rounded-xl">
          <button
            onClick={(openGuestConfig) => {
              setIsGuestMode(true);
              setSelectedDevotee(null);
            }}
            className={`px-3.5 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-colors ${
              isGuestMode
                ? "bg-[#ff7a00] text-white shadow-md"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("bill.walkin")}
          </button>

          <button
            onClick={(openSearchConfig) => {
              setIsGuestMode(false);
            }}
            className={`px-3.5 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-colors ${
              !isGuestMode
                ? "bg-[#ff7a00] text-white shadow-md"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("bill.registered")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: DEVOTEE CONTEXT & SEVA DIAL */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Devotee Select Card */}
          <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#ea580c] uppercase tracking-wider mb-4 font-display">
              {isGuestMode
                ? `1. ${t("bill.walkinLabel")}`
                : `1. ${t("bill.registered")}`}
            </h3>

            {isGuestMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Devotee Name *
                  </label>
                  <TranslitInput
                    value={guestName}
                    onChange={(val) => setGuestName(val)}
                    placeholder=""
                    className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Mobile No *
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder=""
                    maxLength={10}
                    className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-hidden focus:border-[#ff7a00]"
                  />
                  {phoneMatches.length > 0 && (
                    <div className="absolute z-25 left-0 right-0 mt-1 bg-white/90 backdrop-blur-md border border-[#ff7a00]/30 rounded-xl shadow-lg p-1.5 max-h-48 overflow-y-auto divide-y divide-slate-100 font-sans">
                      <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest px-2 py-1 flex items-center gap-1 bg-white/50 rounded-t-lg">
                        <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                        <span>Preserved Matches</span>
                      </p>
                      {phoneMatches.map((dev) => (
                        <button
                          key={dev.id}
                          type="button"
                          onClick={() => {
                            setGuestName(dev.name);
                            setGuestGothra(dev.gothra);
                            setGuestNakshatra(dev.nakshatra);
                            setGuestRashi(dev.rashi);
                            setGuestAddress(dev.address || "");
                            setGuestPhone(dev.phone);
                          }}
                          className="w-full text-left p-2 hover:bg-white transition-all flex flex-col gap-0.5 cursor-pointer focus:outline-hidden group"
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="font-bold text-xs text-slate-800 group-hover:text-amber-700">
                              {dev.name}
                            </span>
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-white text-slate-500 rounded-md">
                              {dev.id}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            Gothra:{" "}
                            <strong className="text-slate-800">
                              {dev.gothra}
                            </strong>{" "}
                            | Nak:{" "}
                            <strong className="text-slate-800">
                              {dev.nakshatra}
                            </strong>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Gothra
                  </label>
                  <TranslitInput
                    value={guestGothra}
                    onChange={(val) => setGuestGothra(val)}
                    placeholder=""
                    className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Nakshatra
                  </label>
                  <TranslitInput
                    value={guestNakshatra}
                    onChange={(val) => setGuestNakshatra(val)}
                    placeholder=""
                    className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Rashi (Zodiac)
                  </label>
                  <TranslitInput
                    value={guestRashi}
                    onChange={(val) => setGuestRashi(val)}
                    placeholder=""
                    className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Devotee Address
                  </label>
                  <input
                    type="text"
                    value={guestAddress}
                    onChange={(e) => setGuestAddress(e.target.value)}
                    placeholder=""
                    className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDevotee ? (
                  <div className="p-4 rounded-xl border border-[#ff7a00]/30 bg-white/50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-100 rounded-xl text-amber-750">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-sm">
                            {selectedDevotee.name}
                          </h4>
                          <span className="text-[10px] bg-amber-100 font-bold px-2 py-0.5 rounded text-amber-700 border border-[#ff7a00]/30">
                            {selectedDevotee.id}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-slate-500 mt-1">
                          <span>
                            Phone: <strong>{selectedDevotee.phone}</strong>
                          </span>
                          <span>|</span>
                          <span>
                            Gothra: <strong>{selectedDevotee.gothra}</strong>
                          </span>
                          <span>|</span>
                          <span>
                            Nakshatra:{" "}
                            <strong>{selectedDevotee.nakshatra}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDevotee(null);
                        setSearchDevoteeQuery("");
                      }}
                      className="text-amber-600 hover:text-amber-700 text-xs font-bold cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        value={searchDevoteeQuery}
                        onChange={(e) => setSearchDevoteeQuery(e.target.value)}
                        placeholder="Search devotee by ID, Name, Contact mobile..."
                        className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:border-[#ff7a00]"
                      />
                    </div>

                    {filteredDevoteesDropdown.length > 0 && (
                      <div className="mt-2 border border-slate-200 rounded-lg divide-y divide-slate-200 bg-white/90 backdrop-blur-md shadow-lg">
                        {filteredDevoteesDropdown.map((dev) => (
                          <div
                            key={dev.id}
                            onClick={() => {
                              setSelectedDevotee(dev);
                              setSearchDevoteeQuery("");
                            }}
                            className="p-3 hover:bg-white cursor-pointer flex justify-between items-center"
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-800">
                                {dev.name} ({dev.id})
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Phone: {dev.phone} | Gothra: {dev.gothra}
                              </div>
                            </div>
                            <button className="text-[10px] font-bold text-[#ff7a00] hover:underline">
                              Select Devotee
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchDevoteeQuery.trim() &&
                      filteredDevoteesDropdown.length === 0 && (
                        <div className="mt-2.5 bg-white border border-slate-200 rounded-lg p-4 text-center">
                          <p className="text-xs text-slate-500">
                            No profile found in database with those descriptors
                          </p>
                          <button
                            onClick={onQuickAddDevotee}
                            className="mt-2 inline-flex items-center gap-1 bg-white hover:bg-[#ff7a00] hover:text-white rounded-lg border border-slate-200 text-[11px] px-3 py-1.5 font-bold cursor-pointer transition-colors text-slate-800"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Register Devotee Profile</span>
                          </button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Seva Selector Card */}
          <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-3 gap-3 mb-4">
              <h3 className="text-[15px] font-bold text-[#ea580c] uppercase tracking-wider font-display">
                2. Select Mandira Ritual / Seva
              </h3>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchSevaQuery}
                  onChange={(e) => setSearchSevaQuery(e.target.value)}
                  placeholder="Quick lookup by code or name..."
                  className="w-full bg-white border border-slate-200 rounded-md pl-8 pr-2 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#ff7a00]"
                />
              </div>
            </div>

            {/* Category selection bar */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors border ${
                    activeCategory === cat
                      ? "bg-amber-100 border-[#ff7a00]/30 text-amber-750 font-black"
                      : "bg-white hover:bg-slate-50 text-slate-500 border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sevas list table/grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredSevas.map((seva) => {
                const isGeneralKanike = seva.price === 0;
                return (
                  <div
                    key={seva.id}
                    className="p-3.5 bg-white/70 rounded-xl hover:bg-white/90 backdrop-blur-md border border-slate-200/90 hover:border-amber-400/40 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono font-bold text-[#ff7a00] bg-[#ff7a00]/10 px-1.5 py-0.5 rounded uppercase border border-[#ff7a00]/20">
                          {seva.code}
                        </span>
                        <span className="text-[16px] font-bold text-[#ff7a00] group-hover:text-amber-500 font-mono transition-all">
                          {isGeneralKanike ? "Donation" : `₹ ${seva.price}`}
                        </span>
                      </div>
                      <h4 className="font-medium font-sans text-[13px] sm:text-[14.5px] text-slate-800 mt-3 truncate-2-lines min-h-[2.5rem] sm:min-h-[3rem] leading-snug tracking-normal">
                        {seva.name}
                      </h4>
                      <p
                        className="text-[10px] text-slate-500 mt-1 truncate limit-lines"
                        title={seva.description}
                      >
                        {seva.description}
                      </p>
                    </div>

                    <div className="border-t border-slate-200/50 mt-3 pt-2.5 flex justify-end">
                      <button
                        onClick={() => handleAddSevaToCart(seva)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 hover:text-white bg-white hover:bg-[#ff7a00] px-3 py-1.5 rounded-lg border border-slate-200 hover:border-transparent transition-all shadow-xs shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Bill</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredSevas.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-500 text-xs">
                  No active sevas configured under this category.
                </div>
              )}
            </div>
          </div>

          {/* Recent Seva Invoices Section */}
          <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#ea580c] uppercase tracking-wider font-display flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#ea580c]" />
                  <span>
                    {language === "kn"
                      ? "ಇತ್ತೀಚಿನ ರಸೀದಿಗಳು / ಇನ್ವಾಯ್ಸ್‌ಗಳು"
                      : "Recent Seva Invoices"}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {language === "kn"
                    ? "ನೈಜ ಸಮಯದಲ್ಲಿ ರಸೀದಿ ಇತಿಹಾಸವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ"
                    : "Track and manage real-time receipt and invoice records"}
                </p>
              </div>

              {/* Filters (Today, Date, Month, Year Selection) */}
              <div className="flex flex-wrap items-center gap-1 bg-white p-1 border border-slate-200 rounded-xl self-start">
                <button
                  type="button"
                  onClick={() => setBillFilter("today")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-all ${
                    billFilter === "today"
                      ? "bg-[#ff7a00] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {language === "kn" ? "ಇಂದು" : "Today"}
                </button>
                <button
                  type="button"
                  onClick={() => setBillFilter("custom")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-all ${
                    billFilter === "custom"
                      ? "bg-[#ff7a00] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {language === "kn" ? "ದಿನಾಂಕ" : "Date"}
                </button>
                <button
                  type="button"
                  onClick={() => setBillFilter("month")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-all ${
                    billFilter === "month"
                      ? "bg-[#ff7a00] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {language === "kn" ? "ತಿಂಗಳು" : "Month"}
                </button>
                <button
                  type="button"
                  onClick={() => setBillFilter("year")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-all ${
                    billFilter === "year"
                      ? "bg-[#ff7a00] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {language === "kn" ? "ವರ್ಷ" : "Year"}
                </button>
                <button
                  type="button"
                  onClick={() => setBillFilter("range")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-all ${
                    billFilter === "range"
                      ? "bg-[#ff7a00] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {language === "kn" ? "ಕಸ್ಟಮ್ ದಿನಾಂಕಗಳು" : "Custom dates"}
                </button>
              </div>
            </div>

            {/* Custom Date Picker shown when custom filter selected */}
            {billFilter === "custom" && (
              <div className="mb-4 flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-xl max-w-xs">
                <label className="text-[11px] font-bold text-slate-500 shrink-0">
                  {language === "kn" ? "ದಿನಾಂಕ ಆಯ್ಕೆ:" : "Select Date:"}
                </label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="bg-white/90 backdrop-blur-md text-slate-800 text-xs border border-slate-200 rounded px-2 py-1 focus:outline-hidden focus:border-[#ff7a00] font-sans"
                />
              </div>
            )}

            {/* Month & Year Selectors shown when month filter selected */}
            {billFilter === "month" && (
              <div className="mb-4 flex flex-wrap items-center gap-3 bg-white p-2.5 border border-slate-200 rounded-xl max-w-md">
                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 shrink-0">
                    {language === "kn" ? "ತಿಂಗಳು:" : "Select Month:"}
                  </label>
                  <select
                    value={selectedFilterMonth}
                    onChange={(e) =>
                      setSelectedFilterMonth(Number(e.target.value))
                    }
                    className="bg-white/90 backdrop-blur-md text-slate-800 text-xs border border-slate-200 rounded px-2 py-1 focus:outline-hidden focus:border-[#ff7a00] font-sans"
                  >
                    {MONTHS_LIST.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 shrink-0">
                    {language === "kn" ? "ವರ್ಷ:" : "Year:"}
                  </label>
                  <select
                    value={selectedFilterMonthYear}
                    onChange={(e) =>
                      setSelectedFilterMonthYear(Number(e.target.value))
                    }
                    className="bg-white/90 backdrop-blur-md text-slate-800 text-xs border border-slate-200 rounded px-2 py-1 focus:outline-hidden focus:border-[#ff7a00] font-sans"
                  >
                    {YEARS_LIST.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Year Selector shown when year filter selected */}
            {billFilter === "year" && (
              <div className="mb-4 flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-xl max-w-xs">
                <label className="text-[11px] font-bold text-slate-500 shrink-0">
                  {language === "kn" ? "ವರ್ಷ ಆಯ್ಕೆ:" : "Select Year:"}
                </label>
                <select
                  value={selectedFilterYear}
                  onChange={(e) =>
                    setSelectedFilterYear(Number(e.target.value))
                  }
                  className="bg-white/90 backdrop-blur-md text-slate-800 text-xs border border-slate-200 rounded px-2 py-1 focus:outline-hidden focus:border-[#ff7a00] font-sans"
                >
                  {YEARS_LIST.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Custom Range (Custom dates) date pickers shown when range filter selected */}
            {billFilter === "range" && (
              <div className="mb-4 flex flex-wrap items-center gap-3 bg-white p-2.5 border border-slate-200 rounded-xl max-w-lg animate-in fade-in duration-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 shrink-0">
                    {language === "kn" ? "ಪ್ರಾರಂಭ ದಿನಾಂಕ:" : "From:"}
                  </span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white/90 backdrop-blur-md text-slate-800 text-xs border border-slate-200 rounded px-2 py-1 focus:outline-hidden focus:border-[#ff7a00] font-sans"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 shrink-0">
                    {language === "kn" ? "ಅಂತಿಮ ದಿನಾಂಕ:" : "To:"}
                  </span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white/90 backdrop-blur-md text-slate-800 text-xs border border-slate-200 rounded px-2 py-1 focus:outline-hidden focus:border-[#ff7a00] font-sans"
                  />
                </div>
              </div>
            )}

            {/* Table of Receipts */}
            {filteredRecentBills.length === 0 ? (
              <div className="py-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                {language === "kn"
                  ? "ಆಯ್ಕೆ ಮಾಡಿದ ಸಮಯದಲ್ಲಿ ಯಾವುದೇ ರಸೀದಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ."
                  : "No receipts found for the selected timeframe."}
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white/90 backdrop-blur-md shadow-xs">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-white">
                      <th className="py-2.5 px-3">Receipt ID</th>
                      <th className="py-2.5 px-2">Devotee Name</th>
                      <th className="py-2.5 px-2 text-right">Amount (₹)</th>
                      <th className="py-2.5 px-2">Payment Mode</th>
                      <th className="py-2.5 px-2">Operator</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecentBills
                      .slice()
                      .reverse()
                      .map((bill) => (
                        <tr
                          key={bill.id}
                          className="hover:bg-white/50 transition-colors"
                        >
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">
                            {bill.id}
                          </td>
                          <td className="py-3 px-2">
                            <div className="font-semibold text-slate-800">
                              {bill.devoteeName}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {bill.phone || "No Contact"}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right font-mono font-bold text-amber-600">
                            ₹ {bill.grandTotal}
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                                bill.paymentMode === "Cash"
                                  ? "bg-amber-100 border border-[#ff7a00]/30 text-amber-700"
                                  : bill.paymentMode === "UPI"
                                    ? "bg-emerald-100 border border-emerald-500/30 text-emerald-700"
                                    : "bg-white border border-slate-200 text-slate-500"
                              }`}
                            >
                              {bill.paymentMode}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-slate-500">
                            {bill.createdByUser || "System"}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveBillForReceiptModal(bill)
                                }
                                className="px-2.5 py-1.5 bg-white hover:bg-[#ff7a00] hover:text-white text-slate-800 font-bold rounded-lg transition-all border border-slate-200 hover:border-transparent text-[10px] cursor-pointer flex items-center gap-1"
                              >
                                <Printer className="w-3 h-3" />
                                <span>
                                  {language === "kn"
                                    ? "ಮುದ್ರಿಸಿ"
                                    : "Print"}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditBill(bill)}
                                className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-transparent rounded-lg transition-all cursor-pointer"
                                title={
                                  language === "kn" ? "ತಿದ್ದು" : "Edit Invoice"
                                }
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {currentUser?.role === "Administrator" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteConfirmBillId(bill.id)
                                  }
                                  className="p-1.5 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-500/30 hover:border-transparent rounded-lg transition-all cursor-pointer"
                                  title={
                                    language === "kn"
                                      ? "ಅಳಿಸು"
                                      : "Delete Invoice"
                                  }
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

        {/* RIGHT COLUMN: QUEUING CART & CHECKOUT TERMINAL */}
        <div
          className={`lg:col-span-4 border-2 rounded-2xl p-5 shadow-sm flex flex-col justify-between self-start transition-all duration-300 ${
            cartItems.length > 0
              ? "bg-white/90 backdrop-blur-md border-amber-400/50 ring-1 ring-amber-400/20"
              : "bg-white/90 backdrop-blur-md border-slate-200"
          }`}
        >
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-4">
              <h3 className="text-[15px] font-bold font-display uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-[#ea580c]">Active Seva Cart</span>
                <span
                  className={`font-mono text-xs px-2.5 py-0.5 rounded-full font-bold scale-90 transition-colors ${
                    cartItems.length > 0
                      ? "bg-amber-600 text-white border border-amber-700"
                      : "bg-[#ff7a00]/10 border border-[#ff7a00]/25 text-[#ff7a00]"
                  }`}
                >
                  {cartItems.length}
                </span>
              </h3>

              {cartItems.length > 0 && (
                <button
                  onClick={handleClearBillingDesk}
                  className="text-amber-700 hover:text-amber-900 text-xs font-black cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Devotee Target Indicator Badge */}
            <div className="mb-4 bg-white/70 border border-slate-200 rounded-xl p-3 text-xs">
              <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1.5 flex items-center justify-between">
                <span>Assigned Devotee</span>
                {isGuestMode ? (
                  <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-md font-bold uppercase">
                    Guest mode
                  </span>
                ) : (
                  <span className="text-[9px] bg-sky-500/10 border border-sky-500/20 text-sky-500 px-1.5 py-0.5 rounded-md font-bold uppercase">
                    Registered
                  </span>
                )}
              </div>

              {isGuestMode ? (
                guestName.trim() ? (
                  <div className="flex justify-between items-center bg-white/90 backdrop-blur-md p-2 border border-slate-200 rounded-lg shadow-2xs">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{guestName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                        Gothra: {guestGothra} | Nak: {guestNakshatra}{" "}
                        {guestPhone.trim() ? `| Mob: ${guestPhone.trim()}` : ""}
                        {guestAddress.trim()
                          ? ` | Addr: ${guestAddress.trim()}`
                          : ""}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setGuestName("");
                        setGuestPhone("");
                        setGuestGothra("");
                        setGuestNakshatra("");
                        setGuestRashi("");
                        setGuestAddress("");
                      }}
                      className="text-[10px] font-black text-rose-600 hover:text-rose-700 cursor-pointer pl-2"
                    >
                      Reset
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                      <span>⚠️ No Walk-In Guest set yet</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsGuestMode(true);
                        setSelectedDevotee(null);
                        setGuestName(language === "kn" ? "ಪ್ರವಾಸಿ ಭಕ್ತ" : "Walk-In Devotee");
                        setGuestPhone("");
                        setGuestGothra("");
                        setGuestNakshatra("");
                        setGuestRashi("");
                        setGuestAddress("");
                      }}
                      className="w-full py-2 px-3 bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 border border-[#ff7a00]/30 text-[#ff7a00] rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                    >
                      <UserPlus className="w-4 h-4 text-[#ff7a00]" />
                      <span>Assign Quick Walk-In (Sankalpa)</span>
                    </button>
                  </div>
                )
              ) : selectedDevotee ? (
                <div className="flex justify-between items-center bg-white/90 backdrop-blur-md p-2 border border-slate-200 rounded-lg shadow-2xs">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00]"></span>
                      <span>{selectedDevotee.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                      ID: {selectedDevotee.id} | Gothra:{" "}
                      {selectedDevotee.gothra}
                      {selectedDevotee.address
                        ? ` | Addr: ${selectedDevotee.address}`
                        : ""}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDevotee(null)}
                    className="text-[10px] font-black text-rose-605 hover:text-rose-700 cursor-pointer pl-2"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-amber-650 font-semibold">
                    <span>⚠️ Please select a registered devotee</span>
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsGuestMode(true);
                        setGuestName("");
                        setGuestGothra("");
                        setGuestNakshatra("");
                        setGuestRashi("");
                        setGuestAddress("");
                      }}
                      className="py-1.5 px-2 bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 border border-[#ff7a00]/30 text-[#ff7a00] rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer"
                    >
                      ⚡ Use Guest Walk-In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector(
                          'input[placeholder*="Search devotee"]',
                        ) as HTMLInputElement;
                        if (input) input.focus();
                      }}
                      className="py-1.5 px-2 bg-white/90 backdrop-blur-md hover:bg-white border border-slate-200 text-slate-800 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer"
                    >
                      🔍 Focus Search
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Seva dropdown search right inside the cart column */}
            <div className="mb-4">
              <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1.5">
                Fast-Add Seva / Ritual
              </label>
              <div className="relative">
                <select
                  onChange={(e) => {
                    const sid = e.target.value;
                    if (sid) {
                      const match = sevas.find((s) => s.id === sid);
                      if (match) {
                        handleAddSevaToCart(match);
                      }
                      e.target.value = ""; // Reset select
                    }
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 focus:outline-hidden focus:border-[#ff7a00] cursor-pointer font-bold"
                >
                  <option value="">
                    ➕ Click to Search & Add Seva instantly...
                  </option>
                  {sevas
                    .filter((s) => s.isActive)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        [{s.code}] {s.name} -{" "}
                        {s.price === 0 ? "Donation" : `₹${s.price}`}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Cart list queue */}
            {cartItems.length === 0 ? (
              <div className="space-y-4">
                <div className="py-10 bg-white/50 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                  <Receipt className="w-8 h-8 text-slate-500/50 mx-auto stroke-[1.5]" />
                  <p className="text-xs font-semibold text-slate-500">
                    Ticket queue is empty
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-[190px] mx-auto leading-relaxed">
                    Add rituals from the left panel, or select from the
                    quick-billing presets below:
                  </p>
                </div>

                {/* Popular Presets Quick Keys Grid */}
                <div className="bg-white p-4 border border-[#ff7a00]/30/65 rounded-2xl space-y-3">
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-[#ff7a00] flex items-center gap-1.5 font-display">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>⚡ Quick Ticket Bundles (1-Tap)</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    {sevas
                      .filter(
                        (s) =>
                          s.isActive &&
                          ["ARC", "KSB", "KNK", "ADS"].includes(s.code),
                      )
                      .map((s) => {
                        const isDonation = s.price === 0;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              // If no devotee is assigned, assign guest mode
                              if (!selectedDevotee && !guestName.trim()) {
                                setIsGuestMode(true);
                                setGuestName("");
                                setGuestGothra("");
                                setGuestNakshatra("");
                                setGuestRashi("");
                                setGuestAddress("");
                              }
                              handleAddSevaToCart(s);
                            }}
                            className="p-2.5 bg-white/90 backdrop-blur-md hover:bg-white border border-slate-200 hover:border-amber-400/50 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] group shadow-3xs"
                          >
                            <span className="text-[11px] font-medium font-sans tracking-normal text-slate-800 group-hover:text-amber-500 line-clamp-2 leading-tight">
                              {s.name.replace(" Seva", "")}
                            </span>
                            <div className="flex justify-between items-center mt-1.5 pt-1 border-t border-slate-200 w-full">
                              <span className="text-[8px] font-mono bg-white text-slate-500 px-1 rounded uppercase font-bold">
                                {s.code}
                              </span>
                              <span className="text-[11px] font-bold text-[#ff7a00] font-mono">
                                {isDonation ? "Donation" : `₹${s.price}`}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
                {cartItems.map((item, index) => {
                  const isCustomPrice = item.customPrice !== undefined;
                  const itemPrice = isCustomPrice
                    ? item.customPrice!
                    : item.seva.price;
                  return (
                    <div
                      key={`${item.seva.id}-${index}`}
                      className="py-3 space-y-2"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 font-display">
                          <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                            {item.seva.name}
                          </h4>
                          <span className="text-[10px] text-amber-605 font-mono">
                            {item.seva.code}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(index)}
                          className="text-slate-500 hover:text-red-500 p-0.5 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Adjuster controls */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                        {/* Custom Price edit (Donations) */}
                        {isCustomPrice ? (
                          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1.5 py-0.5 max-w-[120px]">
                            <span className="font-bold text-amber-500">₹</span>
                            <input
                              type="number"
                              value={item.customPrice}
                              onChange={(e) =>
                                handleUpdateCustomPrice(
                                  index,
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="w-16 bg-transparent text-slate-800 font-mono text-xs font-bold border-none !p-0 focus:ring-0 focus:outline-hidden"
                            />
                          </div>
                        ) : (
                          <span className="font-mono text-amber-600 font-semibold">
                            ₹ {item.seva.price} each
                          </span>
                        )}

                        {/* Counts modifier */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                          <button
                            onClick={() =>
                              handleUpdateCount(index, item.count - 1)
                            }
                            className="p-1 hover:bg-slate-50 text-slate-500 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-mono text-xs font-bold text-slate-800">
                            {item.count}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateCount(index, item.count + 1)
                            }
                            className="p-1 hover:bg-slate-50 text-slate-500 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Checkout & summary section */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-200 pt-4 mt-4 space-y-4">
              {/* Checkout Math */}
              <div className="space-y-1.5 text-xs border-b border-dashed border-slate-200 pb-3">
                <div className="flex justify-between text-base font-bold text-slate-800">
                  <span>Bill Total:</span>
                  <span className="font-mono text-amber-605 text-lg font-black">
                    ₹ {calculatedGrandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Pay mode choice */}
              <div>
                <label className="block text-[11px] font-black text-amber-650 uppercase tracking-widest mb-2 font-display">
                  3. Payment Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMode("Cash")}
                    className={`p-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors border text-left flex flex-col justify-between ${
                      paymentMode === "Cash"
                        ? "bg-[#ff7a00] text-white border-[#ff7a00] shadow-md"
                        : "bg-white hover:bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    <span>Cash Counter</span>
                    <span className="text-[10px] opacity-70 font-normal">
                      Physical Cash
                    </span>
                  </button>

                  <button
                    onClick={() => setPaymentMode("UPI")}
                    className={`p-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors border text-left flex flex-col justify-between ${
                      paymentMode === "UPI"
                        ? "bg-[#ff7a00] text-white border-[#ff7a00] shadow-md"
                        : "bg-white hover:bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    <span>UPI (Scan QR)</span>
                    <span className="text-[10px] opacity-70 font-normal font-mono">
                      GPay/PhonePe
                    </span>
                  </button>
                </div>
              </div>

              {paymentMode === "UPI" && (
                <div className="animate-in slide-in-from-top-2 duration-150">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Transaction Ref Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={upiRef}
                    onChange={(e) => setUpiRef(e.target.value)}
                    placeholder="Enter 12 digit UPI transaction ID (Optional)"
                    className="w-full bg-white text-slate-800 font-mono border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-hidden focus:border-[#ff7a00]"
                  />
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-amber-705 bg-white p-2 border border-[#ff7a00]/30 rounded-lg">
                    <span>
                      UPI QR target: <strong>{settings.upiMerchantId}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Checkout final submit trigger */}
              <button
                id="btn-bill-checkout"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#ff7a00] hover:bg-[#ea580c] text-white shadow-lg shadow-orange-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-white disabled:text-slate-500/60 disabled:cursor-not-allowed"
              >
                <span>Finalize & Print Seva Receipt</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 7. BILL/INVOICE EDIT MODEL SCREEN */}
      {editingBill && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md border-2 border-amber-600/25 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 font-display flex items-center gap-1.5">
                  <Edit2 className="w-4 h-4 text-amber-600" />
                  <span>Edit Invoice ({editingBill.id})</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Modify devotee profile or parameters on this invoice
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBill(null)}
                className="text-slate-500 hover:text-slate-500 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-800">
              <div>
                <label className="block text-slate-500 font-bold uppercase mb-1.5">
                  Devotee Name *
                </label>
                <input
                  type="text"
                  value={editDevoteeName}
                  onChange={(e) => setEditDevoteeName(e.target.value)}
                  className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#ff7a00] font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase mb-1.5">
                  Phone Contact
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#ff7a00] font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold uppercase mb-1.5">
                    Gothra
                  </label>
                  <select
                    value={editGothra}
                    onChange={(e) => setEditGothra(e.target.value)}
                    className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#ff7a00] font-sans"
                  >
                    {GOTHRA_LIST.map((g, idx) => (
                      <option key={idx} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase mb-1.5">
                    Nakshatra
                  </label>
                  <select
                    value={editNakshatra}
                    onChange={(e) => setEditNakshatra(e.target.value)}
                    className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#ff7a00] font-sans"
                  >
                    {NAKSHATRA_LIST.map((n, idx) => (
                      <option key={idx} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold uppercase mb-1.5">
                    Rashi
                  </label>
                  <select
                    value={editRashi}
                    onChange={(e) => setEditRashi(e.target.value)}
                    className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#ff7a00] font-sans"
                  >
                    {RASHI_LIST.map((r, idx) => (
                      <option key={idx} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase mb-1.5">
                    Payment Mode
                  </label>
                  <select
                    value={editPaymentMode}
                    onChange={(e) => setEditPaymentMode(e.target.value as any)}
                    className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#ff7a00] font-sans"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              {/* Itemized reading only */}
              <div className="bg-white p-3.5 border border-slate-200 rounded-xl mt-2.5">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Itemized items locked on invoice
                </span>
                <div className="space-y-1">
                  {editingBill.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex justify-between text-xs text-slate-800"
                    >
                      <span>
                        {it.sevaName} x {it.count}
                      </span>
                      <span className="font-semibold">
                        ₹{it.price * it.count + it.pujariDakshina * it.count}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-1.5 mt-2 flex justify-between font-bold text-slate-800 text-[13px]">
                    <span>Total Amount</span>
                    <span>₹{editingBill.grandTotal}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingBill(null)}
                className="px-4 py-2 border border-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditBill}
                className="px-5 py-2 bg-[#ff7a00] hover:bg-[#ea580c] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. BILL/INVOICE DELETE SYSTEM MODAL SCREEN */}
      {deleteConfirmBillId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md border-2 border-rose-500/25 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-50 rounded-full border-2 border-rose-500/30 flex items-center justify-center mx-auto text-rose-600 animate-bounce">
                <Trash2 className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-base font-display">
                  Delete Invoice?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-2 font-semibold">
                  Are you absolutely sure you want to permanently delete receipt{" "}
                  <strong>#{deleteConfirmBillId}</strong>? This will remove the
                  transaction record completely and reverse dynamic ledger
                  balances associated with it. This action is irreversible.
                </p>
              </div>
            </div>

            <div className="bg-white border-t border-slate-200 px-5 py-3.5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmBillId(null)}
                className="px-4 py-2 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-xs"
              >
                No, Keep Invoice
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDeleteBill(deleteConfirmBillId)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-xs"
              >
                Yes, Delete Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
