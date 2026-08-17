/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Users,
  Receipt,
  Bookmark,
  BarChart3,
  UserCog,
  Settings as SettingsIcon,
  TrendingDown,
  Scale,
  AlertCircle,
  Power,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  UserCheck,
  Bell,
  Download,
  ShieldCheck,
  FileJson,
  Calendar,
  Cloud,
} from "lucide-react";

import {
  generateBackupBundle,
  downloadBackupFile,
  validateAndParseBackup,
  createSafetyBackup,
  createPreRestoreBackup,
} from "./utils/backupEngine";
import { transliterateOperatorName } from "./utils/kannadaTranslit";

import {
  Devotee,
  Seva,
  Bill,
  Expense,
  AccountLedger,
  SystemUser,
  TempleSettings,
} from "./types";
import {
  initialDevotees,
  initialSevas,
  initialBills,
  initialExpenses,
  initialLedger,
  initialUsers,
  defaultSettings,
} from "./data/initialData";

import {
  subscribeDevotees,
  subscribeSevas,
  subscribeBills,
  subscribeExpenses,
  subscribeLedger,
  subscribeUsers,
  subscribeSettings,
  saveDevoteeToFirestore,
  deleteDevoteeFromFirestore,
  saveSevaToFirestore,
  deleteSevaFromFirestore,
  saveBillToFirestore,
  deleteBillFromFirestore,
  saveExpenseToFirestore,
  deleteExpenseFromFirestore,
  saveLedgerToFirestore,
  atomicUpdateLedger,
  saveUserToFirestore,
  deleteUserFromFirestore,
  saveSettingsToFirestore,
  initializeFirestoreDatabase,
} from "./services/firestoreService";

// Modular child views
import DashboardTab from "./components/DashboardTab";
import DevoteeTab from "./components/DevoteeTab";
import BillingTab from "./components/BillingTab";
import SevaTab from "./components/SevaTab";
import ExpensesTab from "./components/ExpensesTab";
import AccountsTab from "./components/AccountsTab";
import ReportsTab from "./components/ReportsTab";
import UsersTab from "./components/UsersTab";
import SettingsTab from "./components/SettingsTab";
import { PanchangaTab } from "./components/PanchangaTab";

// Dynamic security gateways and logo insignia
import DssmLogo from "./components/DssmLogo";
import LoginPage from "./components/LoginPage";
import { useLanguage } from "./context/LanguageContext";
import ReceiptModal from "./components/ReceiptModal";

export default function App() {
  // ----------------------------------------------------
  // PERSISTED CENTRAL APPLICATION STATES
  // ----------------------------------------------------
  const { language, setLanguage, t } = useLanguage();

  const [devotees, setDevotees] = useState<Devotee[]>(() => {
    const saved = localStorage.getItem("dsssm_devotees");
    return saved ? JSON.parse(saved) : initialDevotees;
  });

  const [sevas, setSevas] = useState<Seva[]>(() => {
    const saved = localStorage.getItem("dsssm_sevas");
    return saved ? JSON.parse(saved) : initialSevas;
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem("dsssm_bills");
    const parsed: Bill[] = saved ? JSON.parse(saved) : initialBills;
    return parsed.map((b) => {
      if (b.id && b.id.startsWith("DSSSM-")) {
        return {
          ...b,
          id: b.id.replace("DSSSM-", "DSSM-"),
        };
      }
      return b;
    });
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("dsssm_expenses");
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [ledger, setLedger] = useState<AccountLedger>(() => {
    const saved = localStorage.getItem("dsssm_ledger");
    return saved ? JSON.parse(saved) : initialLedger;
  });

  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem("dsssm_users");
    if (saved) {
      try {
        const parsed: SystemUser[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const legacyDummyUsernames = ["admin", "rashmi", "bhat_pujari", "godmode"];
          const cleaned = parsed.filter(
            (u) => !legacyDummyUsernames.includes(u.username?.toLowerCase()),
          );
          return cleaned;
        }
      } catch (e) {
        console.error("Failed to parse saved users:", e);
      }
    }
    return initialUsers;
  });

  const [settings, setSettings] = useState<TempleSettings>(() => {
    const saved = localStorage.getItem("dsssm_settings");
    const parsed: TempleSettings = saved ? JSON.parse(saved) : defaultSettings;
    if (parsed && parsed.receiptPrefix === "DSSSM") {
      parsed.receiptPrefix = "DSSM";
    }
    return parsed;
  });

  const [cartItems, setCartItems] = useState<
    {
      seva: Seva;
      count: number;
      customPrice?: number;
      pujariDakshina: number;
      overrideDevoteeName?: string;
      overrideGothra?: string;
      overrideNakshatra?: string;
    }[]
  >(() => {
    try {
      const saved = localStorage.getItem("dsssm_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current session configurations - defaults to null to prompt Login screen unless authenticated
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);

  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeBillForReceiptModal, setActiveBillForReceiptModal] =
    useState<Bill | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [cloudSynced, setCloudSynced] = useState<boolean>(false);

  // ----------------------------------------------------
  // PERSISTENCE ENGINE - FIRESTORE REAL-TIME SYNCHRONIZERS
  // ----------------------------------------------------

  useEffect(() => {
    // Initial check & seed Firestore if database collections are empty
    initializeFirestoreDatabase({
      devotees,
      sevas,
      bills,
      expenses,
      ledger,
      users,
      settings,
    }).then(() => {
      setCloudSynced(true);
    });

    // Real-time Firestore subscriptions across all connected devices
    const unsubDevotees = subscribeDevotees((cloudDevotees) => {
      setDevotees(cloudDevotees || []);
    });

    const unsubSevas = subscribeSevas((cloudSevas) => {
      setSevas(cloudSevas || []);
    });

    const unsubBills = subscribeBills((cloudBills) => {
      setBills(cloudBills || []);
    });

    const unsubExpenses = subscribeExpenses((cloudExpenses) => {
      setExpenses(cloudExpenses || []);
    });

    const unsubLedger = subscribeLedger((cloudLedger) => {
      if (cloudLedger) {
        setLedger(cloudLedger);
      }
    });

    const unsubUsers = subscribeUsers((cloudUsers) => {
      setUsers(cloudUsers || []);
    });

    const unsubSettings = subscribeSettings((cloudSettings) => {
      if (cloudSettings) {
        setSettings(cloudSettings);
      }
    });

    return () => {
      unsubDevotees();
      unsubSevas();
      unsubBills();
      unsubExpenses();
      unsubLedger();
      unsubUsers();
      unsubSettings();
    };
  }, []);

  // ----------------------------------------------------
  // PERSISTENCE ENGINE - LOCALSTORAGE CACHE SYNCHRONIZERS
  // ----------------------------------------------------

  useEffect(() => {
    localStorage.setItem("dsssm_devotees", JSON.stringify(devotees));
  }, [devotees]);

  useEffect(() => {
    localStorage.setItem("dsssm_sevas", JSON.stringify(sevas));
  }, [sevas]);

  useEffect(() => {
    localStorage.setItem("dsssm_bills", JSON.stringify(bills));
  }, [bills]);

  // Tab protection guard - redirects non-admin users if they somehow land on restricted tabs
  useEffect(() => {
    if (currentUser && currentUser.role !== "Administrator") {
      const restrictedTabs = ["expenses", "accounts", "reports", "users", "settings"];
      if (restrictedTabs.includes(currentTab)) {
        setCurrentTab("dashboard");
      }
    }
  }, [currentUser, currentTab]);

  useEffect(() => {
    localStorage.setItem("dsssm_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("dsssm_ledger", JSON.stringify(ledger));
  }, [ledger]);

  useEffect(() => {
    localStorage.setItem("dsssm_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("dsssm_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("dsssm_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // AUTO SAFETY BACKUP ENGINE & TAB CLOSE CONFIRMATION FOR UNEXPECTED BROWSER CLOSURE
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 1. Immediately create a safety backup JSON snapshot in localStorage
      const bundle = generateBackupBundle(
        devotees,
        sevas,
        bills,
        expenses,
        ledger,
        users,
        settings,
        cartItems
      );
      createSafetyBackup(bundle);

      // 2. Trigger native browser confirmation popup if user is logged in
      if (currentUser) {
        e.preventDefault();
        e.returnValue = "You are closing the Terminal Billing System. Ensure your data is saved.";
        return e.returnValue;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const bundle = generateBackupBundle(
          devotees,
          sevas,
          bills,
          expenses,
          ledger,
          users,
          settings,
          cartItems
        );
        createSafetyBackup(bundle);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [devotees, sevas, bills, expenses, ledger, users, settings, cartItems, currentUser]);

  // Current logged in user is stored strictly in memory for security. No automatic persistence.

  // Ensure current logged-in user is updated if user list changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.username.toLowerCase() === "godmode") return;
      const freshSelf = users.find((u) => u.id === currentUser.id);
      if (freshSelf) {
        setCurrentUser(freshSelf);
      }
    }
  }, [users]);

  // ----------------------------------------------------
  // MUTATION DIRECTORIES (BUSINESS LOGIC DISPATCHERS)
  // ----------------------------------------------------

  // DEVOTEE LOGIC
  // DEVOTEE LOGIC
  const handleAddDevotee = (newDev: Omit<Devotee, "id" | "createdAt">) => {
    const devNumbers = devotees.map((d) => {
      const match = d.id.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const nextDevNum = Math.max(1000, ...devNumbers) + 1;
    const nextId = `DEV-${nextDevNum}`;
    const devotee: Devotee = {
      ...newDev,
      id: nextId,
      createdAt: new Date().toISOString(),
    };
    setDevotees((prev) => [devotee, ...prev]);
    saveDevoteeToFirestore(devotee).catch((err) =>
      console.error("Failed to save devotee to Firestore:", err),
    );
    alert(`Devotee registered successfully: Assigned ID ${nextId}`);
  };

  const handleUpdateDevotee = (updatedDev: Devotee) => {
    setDevotees((prev) =>
      prev.map((d) => (d.id === updatedDev.id ? updatedDev : d)),
    );
    saveDevoteeToFirestore(updatedDev).catch((err) =>
      console.error("Failed to update devotee in Firestore:", err),
    );
    alert(`Devotee profile for ${updatedDev.name} updated successfully.`);
  };

  const handleDeleteDevotee = (id: string) => {
    if (currentUser?.role !== "Administrator") {
      alert("Access Denied: Only Administrator accounts can delete devotee profiles.");
      return;
    }
    setDevotees((prev) => prev.filter((d) => d.id !== id));
    deleteDevoteeFromFirestore(id).catch((err) =>
      console.error("Failed to delete devotee from Firestore:", err),
    );
  };

  // BILLING OPERATIONS & DOUBLE ENTRY BOOKKEEPING (MULTI-DEVICE ATOMIC)
  const handleAddBill = (newBill: Omit<Bill, "id" | "createdAt">) => {
    // Determine highest sequential bill index across all devices
    const numbers = bills.map((b) => {
      const parts = b.id.split("-");
      const last = parseInt(parts[parts.length - 1], 10);
      return isNaN(last) ? 0 : last;
    });
    const nextBillSeq = Math.max(0, ...numbers) + 1;
    const receiptId = `${settings.receiptPrefix || "DSSM"}-2026-27-${String(nextBillSeq).padStart(4, "0")}`;

    let autoRegisteredMessage = "";
    const sanitizedPhone = newBill.phone ? newBill.phone.trim() : "";
    let finalDevoteeId = newBill.devoteeId;

    // Auto-populate or link to Devotee Directory if guest/walk-in mode
    if (!newBill.isRegistered && newBill.devoteeName) {
      if (sanitizedPhone !== "") {
        const existingDevotee = devotees.find(
          (d) => d.phone && d.phone.trim() === sanitizedPhone,
        );

        if (!existingDevotee) {
          const devNumbers = devotees.map((d) => {
            const match = d.id.match(/\d+/);
            return match ? parseInt(match[0], 10) : 0;
          });
          const nextDevId = `DEV-${Math.max(1000, ...devNumbers) + 1}`;
          finalDevoteeId = nextDevId;
          const autoDevotee = {
            id: nextDevId,
            name: newBill.devoteeName,
            phone: sanitizedPhone,
            gothra: newBill.gothra || "Sankalpa Gothra",
            nakshatra: newBill.nakshatra || "Rohini",
            rashi: newBill.rashi || "Vrishabha (Taurus)",
            address: newBill.address || "",
            createdAt: new Date().toISOString(),
          };
          setDevotees((prev) => [autoDevotee, ...prev]);
          saveDevoteeToFirestore(autoDevotee).catch((err) =>
            console.error("Failed to auto-save devotee to Firestore:", err),
          );
          autoRegisteredMessage = `\n🌟 Auspicious Walk-In Devotee "${newBill.devoteeName}" auto-populated to Directory (ID: ${nextDevId}).`;
        } else {
          finalDevoteeId = existingDevotee.id;
        }
      }
    }

    const finalizedBill: Bill = {
      ...newBill,
      id: receiptId,
      devoteeId: finalDevoteeId,
      createdAt: new Date().toISOString(),
    };

    // Atomic ledger offsets to prevent concurrent multi-device races
    const cashDelta = newBill.paymentMode === "Cash" ? newBill.grandTotal : 0;
    const bankDelta = newBill.paymentMode !== "Cash" ? newBill.grandTotal : 0;
    atomicUpdateLedger(cashDelta, bankDelta);

    setBills((prev) => [...prev, finalizedBill]);
    saveBillToFirestore(finalizedBill).catch((err) =>
      console.error("Failed to save bill to Firestore:", err),
    );

    // Automatically open the tickets printable drawer for final checkout verification
    setActiveBillForReceiptModal(finalizedBill);
    alert(
      `Bill finalized: Ticket #${receiptId} generated successfully.${autoRegisteredMessage}`,
    );
  };

  const handleUpdateBill = (updatedBill: Bill) => {
    const originalBill = bills.find((b) => b.id === updatedBill.id);
    if (originalBill) {
      const origCash = originalBill.paymentMode === "Cash" ? originalBill.grandTotal : 0;
      const origBank = originalBill.paymentMode !== "Cash" ? originalBill.grandTotal : 0;
      const newCash = updatedBill.paymentMode === "Cash" ? updatedBill.grandTotal : 0;
      const newBank = updatedBill.paymentMode !== "Cash" ? updatedBill.grandTotal : 0;
      atomicUpdateLedger(newCash - origCash, newBank - origBank);
    }
    setBills((prev) =>
      prev.map((b) => (b.id === updatedBill.id ? updatedBill : b)),
    );
    saveBillToFirestore(updatedBill).catch((err) =>
      console.error("Failed to update bill in Firestore:", err),
    );
    alert(`Receipt ${updatedBill.id} updated successfully.`);
  };

  const handleDeleteBill = (id: string) => {
    if (currentUser?.role !== "Administrator") {
      alert("Access Denied: Only Administrator accounts can delete invoice records.");
      return;
    }
    const originalBill = bills.find((b) => b.id === id);
    if (originalBill) {
      const origCash = originalBill.paymentMode === "Cash" ? originalBill.grandTotal : 0;
      const origBank = originalBill.paymentMode !== "Cash" ? originalBill.grandTotal : 0;
      atomicUpdateLedger(-origCash, -origBank);
    }
    setBills((prev) => prev.filter((b) => b.id !== id));
    deleteBillFromFirestore(id).catch((err) =>
      console.error("Failed to delete bill from Firestore:", err),
    );
    alert(`Receipt ${id} deleted successfully.`);
  };

  // SEVA CATALOG LOGIC
  const handleAddSeva = (newSeva: Omit<Seva, "id">) => {
    const sevaNumbers = sevas.map((s) => {
      const match = s.id.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const nextSevaNum = Math.max(0, ...sevaNumbers) + 1;
    const nextId = `SEVA-${String(nextSevaNum).padStart(3, "0")}`;
    const seva: Seva = {
      ...newSeva,
      id: nextId,
    };
    setSevas((prev) => [seva, ...prev]);
    saveSevaToFirestore(seva).catch((err) =>
      console.error("Failed to save seva to Firestore:", err),
    );
    alert(
      `Seva category successfully added to Temple Catalog: Code ${seva.code}`,
    );
  };

  const handleUpdateSeva = (updatedSeva: Seva) => {
    setSevas((prev) =>
      prev.map((s) => (s.id === updatedSeva.id ? updatedSeva : s)),
    );
    saveSevaToFirestore(updatedSeva).catch((err) =>
      console.error("Failed to update seva in Firestore:", err),
    );
  };

  const handleDeleteSeva = (id: string) => {
    if (currentUser?.role !== "Administrator") {
      alert("Access Denied: Only Administrator accounts can delete seva catalog entries.");
      return;
    }
    setSevas((prev) => prev.filter((s) => s.id !== id));
    deleteSevaFromFirestore(id).catch((err) =>
      console.error("Failed to delete seva from Firestore:", err),
    );
  };

  // EXPENSES OUTDOOR BOOK ENTRIES
  const handleAddExpense = (newExp: Omit<Expense, "id" | "date">) => {
    const expNumbers = expenses.map((e) => {
      const match = e.id.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const nextExpSeq = Math.max(200, ...expNumbers) + 1;
    const epNum = String(nextExpSeq).padStart(3, "0");
    const expense: Expense = {
      ...newExp,
      id: `EXP-${epNum}`,
      date: new Date().toISOString(),
    };

    // Reflect expense out of physical ledger liquidity atomically
    const cashDelta = newExp.paymentMode === "Cash" ? -newExp.amount : 0;
    const bankDelta = newExp.paymentMode !== "Cash" ? -newExp.amount : 0;
    atomicUpdateLedger(cashDelta, bankDelta);

    setExpenses((prev) => [...prev, expense]);
    saveExpenseToFirestore(expense).catch((err) =>
      console.error("Failed to save expense to Firestore:", err),
    );
    alert(`Operational expense registered: Voucher EXP-${epNum} logged.`);
  };

  const handleDeleteExpense = (id: string) => {
    if (currentUser?.role !== "Administrator") {
      alert("Access Denied: Only Administrator accounts can delete expense vouchers.");
      return;
    }
    const target = expenses.find((e) => e.id === id);
    if (target) {
      const cashDelta = target.paymentMode === "Cash" ? target.amount : 0;
      const bankDelta = target.paymentMode !== "Cash" ? target.amount : 0;
      atomicUpdateLedger(cashDelta, bankDelta);
    }
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    deleteExpenseFromFirestore(id).catch((err) =>
      console.error("Failed to delete expense from Firestore:", err),
    );
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    const originalExpense = expenses.find((e) => e.id === updatedExpense.id);
    if (originalExpense) {
      const origCash = originalExpense.paymentMode === "Cash" ? originalExpense.amount : 0;
      const origBank = originalExpense.paymentMode !== "Cash" ? originalExpense.amount : 0;
      const newCash = updatedExpense.paymentMode === "Cash" ? updatedExpense.amount : 0;
      const newBank = updatedExpense.paymentMode !== "Cash" ? updatedExpense.amount : 0;
      atomicUpdateLedger(origCash - newCash, origBank - newBank);
    }
    setExpenses((prev) =>
      prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e)),
    );
    saveExpenseToFirestore(updatedExpense).catch((err) =>
      console.error("Failed to update expense in Firestore:", err),
    );
    alert(`Voucher ${updatedExpense.id} updated successfully.`);
  };

  // BANK REMITTANCE SHIFT LOGIC
  const handleRemitToBank = (amount: number, description: string) => {
    const remittance = {
      date: new Date().toISOString(),
      amount,
      description,
    };
    atomicUpdateLedger(-amount, +amount, remittance);
    alert(
      `Remittance dispatched successfully: ₹ ${amount.toLocaleString("en-IN")} remitted to bank depot.`,
    );
  };

  // OPERATORS REGULATOR
  const handleSwitchUser = (user: SystemUser) => {
    setCurrentUser(user);
  };

  const handleAddUser = (newUser: Omit<SystemUser, "id">) => {
    let maxNum = 0;
    users.forEach((u) => {
      const match = u.id.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const nextId = `USR-${String(maxNum + 1).padStart(2, "0")}`;
    const user: SystemUser = {
      ...newUser,
      id: nextId,
    };
    setUsers((prev) => [...prev, user]);
    saveUserToFirestore(user).catch((err) =>
      console.error("Failed to save user to Firestore:", err),
    );
    alert(`Access granted: ${user.name} registered as ${user.role}.`);
  };

  const handleUpdateUser = (updatedUser: SystemUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
    saveUserToFirestore(updatedUser).catch((err) =>
      console.error("Failed to update user in Firestore:", err),
    );
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    alert(
      `Operator "${updatedUser.name}" profile and roles updated successfully.`,
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (currentUser?.role !== "Administrator") {
      alert("Access Denied: Only Administrator accounts can manage operator profiles.");
      return;
    }
    if (currentUser && userId === currentUser.id) {
      alert("Cannot delete the currently logged in operator.");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    deleteUserFromFirestore(userId).catch((err) =>
      console.error("Failed to delete user from Firestore:", err),
    );
    alert("Operator account deleted successfully.");
  };

  const handleSaveSettings = (newSettings: TempleSettings) => {
    setSettings(newSettings);
    saveSettingsToFirestore(newSettings).catch((err) =>
      console.error("Failed to save settings to Firestore:", err),
    );
  };

  // BACKUP EXPORTS & RESTORE ENGINE
  const handleExportBackup = (): string => {
    const bundle = generateBackupBundle(
      devotees,
      sevas,
      bills,
      expenses,
      ledger,
      users,
      settings,
      cartItems
    );
    return JSON.stringify(bundle, null, 2);
  };

  const handleImportBackup = (backupJson: string): boolean => {
    try {
      // Create a safety backup of current state before overwriting
      const currentBundle = generateBackupBundle(
        devotees,
        sevas,
        bills,
        expenses,
        ledger,
        users,
        settings,
        cartItems
      );
      createPreRestoreBackup(currentBundle);

      // Validate and parse incoming JSON
      const res = validateAndParseBackup(backupJson);
      if (!res.valid || !res.data) {
        return false;
      }

      setDevotees(res.data.devotees);
      setSevas(res.data.sevas);
      setBills(res.data.bills);
      setExpenses(res.data.expenses);
      setLedger(res.data.ledger);
      setUsers(res.data.users);
      setSettings(res.data.settings);
      if (res.data.cartItems) {
        setCartItems(res.data.cartItems);
      }

      // Sync imported dataset to Firestore
      for (const d of res.data.devotees) saveDevoteeToFirestore(d);
      for (const s of res.data.sevas) saveSevaToFirestore(s);
      for (const b of res.data.bills) saveBillToFirestore(b);
      for (const e of res.data.expenses) saveExpenseToFirestore(e);
      saveLedgerToFirestore(res.data.ledger);
      for (const u of res.data.users) saveUserToFirestore(u);
      saveSettingsToFirestore(res.data.settings);

      if (currentUser?.username.toLowerCase() !== "godmode") {
        if (res.data.users && res.data.users.length > 0) {
          const match = res.data.users.find((u) => u.id === currentUser?.id);
          if (match) {
            setCurrentUser(match);
          } else {
            setCurrentUser(res.data.users[0]);
          }
        }
      }

      return true;
    } catch (e) {
      return false;
    }
  };

  const handleResetBillingSystem = async (): Promise<boolean> => {
    if (currentUser?.role !== "Administrator") {
      alert("Access Denied: Only Administrator account can perform billing system resets.");
      return false;
    }

    try {
      // 1. Auto-generate & trigger download of full JSON backup file first
      const dataStr = handleExportBackup();
      const bundle = JSON.parse(dataStr);
      await downloadBackupFile(bundle, "DSSM_PRE_RESET_BACKUP.json");
    } catch (e: any) {
      if (e?.name === "AbortError") {
        // User canceled file dialog, but proceed with reset
      } else {
        console.error("Backup download error during reset:", e);
      }
    }

    // 2. Clear all bills and expenses in local state and Firestore
    for (const b of bills) {
      deleteBillFromFirestore(b.id).catch(() => {});
    }
    for (const e of expenses) {
      deleteExpenseFromFirestore(e.id).catch(() => {});
    }

    setBills([]);
    setExpenses([]);
    setCartItems([]);
    const resetLedger: AccountLedger = {
      cashInHand: 0,
      bankBalance: 0,
      capitalFund: 0,
      annadanaFund: 0,
      remittances: [],
    };
    setLedger(resetLedger);
    saveLedgerToFirestore(resetLedger).catch(() => {});

    // Write reset state to localStorage immediately
    localStorage.setItem("dsssm_bills", JSON.stringify([]));
    localStorage.setItem("dsssm_expenses", JSON.stringify([]));
    localStorage.setItem("dsssm_ledger", JSON.stringify(resetLedger));
    localStorage.setItem("dsssm_cart", JSON.stringify([]));

    // Note: Devotee Directory and Seva Catalog are strictly retained intact!
    alert(
      "✔ Billing System Reset Complete!\n\n• JSON Backup archive was created and downloaded.\n• All billing receipts, revenues, expenses & ledger values set to ₹0.\n• Devotee Directory & Seva Catalog have been safely retained intact."
    );

    return true;
  };

  // ----------------------------------------------------
  // SUMMARY CALCULATIONS FOR RECONCILIATIONS
  // ----------------------------------------------------
  const grandTotalBillsSum = bills
    .filter((b) => !b.isCancelled)
    .reduce((a, c) => a + c.grandTotal, 0);
  const totalExpensesSum = expenses.reduce((a, c) => a + c.amount, 0);

  // Layout menus - categorized by Operator Roles & Functional Modules
  const isAdmin = currentUser?.role === "Administrator";

  const MENU_SECTIONS = [
    {
      category: "Dashboard",
      categoryKey: "nav.dashboard",
      items: [{ id: "dashboard", name: "Dashboard", icon: LayoutDashboard }],
    },
    {
      category: "Billing and Devotees",
      categoryKey: "nav.catBillingDevotees",
      items: [
        { id: "billing", name: "Billing Desk Counter", icon: Receipt },
        { id: "devotees", name: "Devotee Directory", icon: Users },
        { id: "sevas", name: "Seva Catalog", icon: Bookmark },
      ],
    },
    {
      category: "Knowledge",
      categoryKey: "nav.catKnowledge",
      items: [
        { id: "panchanga", name: t("nav.panchanga") || "Panchanga", icon: Calendar },
      ],
    },
    {
      category: "Operations",
      categoryKey: "nav.catOperations",
      items: [
        ...(isAdmin
          ? [
              { id: "expenses", name: "Expenses Vouchers", icon: TrendingDown },
              { id: "reports", name: "Audit Reports", icon: BarChart3 },
            ]
          : []),
      ],
    },
    {
      category: "Admin Controls",
      categoryKey: "nav.catAdminControls",
      items: [
        ...(isAdmin
          ? [
              { id: "users", name: "Desk Operators", icon: UserCog },
              { id: "settings", name: "Terminal Config", icon: SettingsIcon },
            ]
          : []),
      ],
    },
  ].filter((section) => section.items.length > 0);

  // Auth gate layout guard - Prompts LoginPage if session is null
  if (!currentUser) {
    return (
      <LoginPage
        users={users}
        onLoginSuccess={(validUser) => {
          setCurrentUser(validUser);
          setCurrentTab("dashboard");
        }}
      />
    );
  }

  return (
    <>
      <div
        className="h-screen w-full overflow-hidden bg-[#f8fafc] text-[#1e293b] flex font-sans no-print"
        id="temple-billing-app"
      >
        {/* 1. SIDEBAR NAVIGATION - DESKTOP VIEW */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#160d0b] border-r border-[#2d1713] shrink-0 select-none shadow-[4px_0_12px_rgba(0,0,0,0.35)] relative z-20 text-stone-100">
          {/* Brand Identity Card with Logo */}
          <div className="pt-3 pb-4 px-3 border-b border-[#2d1713] bg-[#0f0706] flex flex-col items-center justify-center text-center shadow-md shadow-black/20">
            <DssmLogo
              size="md"
              className="scale-[1.2] shrink-0 w-[80px] h-[60px] mb-4"
              showSubtitle={false}
            />
            <div className="flex flex-col items-center text-center">
              <span className="font-display text-[13.5px] font-bold tracking-widest text-[#ff7a00] leading-tight uppercase">
                {t("brand.line1")}
              </span>
              <span className="font-display text-[13.5px] font-bold tracking-widest text-[#ff7a00] leading-tight mt-1 uppercase">
                {t("brand.line2")}
              </span>
              <span className="font-display text-[13.5px] font-bold tracking-widest text-[#ff7a00] leading-tight mt-1 uppercase">
                {t("brand.line3")}
              </span>
              <span className="text-[11px] text-stone-400 mt-2 font-semibold">
                {t("brand.shortAddress")}
              </span>
            </div>
          </div>

          {/* Dynamic navigation indices by Category */}
          <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
            {MENU_SECTIONS.map((section) => (
              <div key={section.category} className="space-y-1">
                {/* Category Header */}
                <div className="px-3 pt-1 pb-1 text-[10px] font-black tracking-widest text-[#ff7a00]/90 uppercase font-mono flex items-center gap-1.5 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00] shrink-0"></span>
                  <span>{section.categoryKey ? t(section.categoryKey) : section.category}</span>
                </div>

                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-${item.id}`}
                        onClick={() => {
                          setCurrentTab(item.id);
                          if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-[12.5px] font-bold transition-all text-left cursor-pointer focus:outline-hidden ${
                          isActive
                            ? "bg-[#ff7a00] text-white font-semibold shadow-lg shadow-[#ff7a00]/20 border border-[#ff9c47]/30"
                            : "text-stone-300 hover:bg-white/5 hover:text-white hover:border-l-4 hover:border-l-[#ff7a00] rounded-r-none"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#ff7a00]"}`} />
                          <span>{t("nav." + item.id)}</span>
                        </span>

                        {item.id === "billing" && (
                          <span className="bg-amber-500/10 text-amber-400 font-mono text-[9px] font-bold px-1.5 rounded-full scale-95 border border-amber-500/20 font-sans">
                            POS
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Session Details */}
          <div className="mt-auto flex border-t border-[#2d1713] bg-[#0f0706] shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.25)] w-full shrink-0 items-center justify-between px-5 py-3">
            <div className="flex flex-col text-xs">
              <div className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                {t("nav.loggedInAs")}
              </div>
              <span className="font-bold text-stone-200 truncate text-[12px] mt-0.5 max-w-[130px]">
                {transliterateOperatorName(currentUser.name, language)}
              </span>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-1.5 min-w-[28px] min-h-[28px] flex items-center justify-center bg-[#241310] hover:bg-[#321a16] border border-[#40231e] rounded-lg text-red-400 hover:text-red-300 transition-colors shadow-sm cursor-pointer"
              title={t("nav.yesLogout")}
            >
              <Power className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </aside>

        {/* 2. MAIN APPLICATION BOUNDARIES CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* RESPONSIVE FLOATING CONTAINER HEADER */}
          <header className="bg-[#ff7a00] min-h-14 px-3 sm:px-4 md:px-6 py-2 flex items-center justify-between shrink-0 shadow-lg relative z-30 text-white border-b border-[#ea580c]/50">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Mobile menu burger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 bg-white/10 hover:bg-white/25 border border-white/20 rounded-lg text-white cursor-pointer transition-colors shrink-0"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              <span className="text-xs sm:text-sm font-extrabold text-amber-50 tracking-wider font-display truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                {t("header.node")}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs font-semibold shrink-0">
              {/* Language switcher pill */}
              <div className="relative flex items-center bg-black/25 border border-white/20 rounded-full p-0.5 sm:p-1 select-none w-[116px] sm:w-[136px] h-[30px] sm:h-[34px]">
                <motion.div
                  className="absolute inset-y-0.5 sm:inset-y-1 bg-white rounded-full shadow-xs"
                  initial={false}
                  animate={{
                    left: language === "en" ? "2px" : "calc(50% + 1px)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                    mass: 0.5,
                  }}
                  style={{
                    width: "calc(50% - 3px)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`relative z-10 w-1/2 h-full rounded-full text-[9px] sm:text-[10px] font-black tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center uppercase ${
                    language === "en"
                      ? "text-[#d34100]"
                      : "text-amber-100 hover:text-white"
                  }`}
                >
                  ENG
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("kn")}
                  className={`relative z-10 w-1/2 h-full rounded-full text-[9px] sm:text-[10px] font-black tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center uppercase ${
                    language === "kn"
                      ? "text-[#d34100]"
                      : "text-amber-100 hover:text-white"
                  }`}
                >
                  ಕನ್ನಡ
                </button>
              </div>

              {/* Operator state indicator */}
              <div className="hidden md:flex items-center gap-2 text-white bg-black/15 border border-white/10 px-3 py-1.5 rounded-xl shadow-inner">
                <UserCheck className="w-4 h-4 text-amber-200 shrink-0" />
                <span className="truncate max-w-[130px] lg:max-w-none">
                  {t("header.operator")}: <strong className="text-amber-50">{transliterateOperatorName(currentUser.name, language)}</strong>
                </span>
                <span className="text-white/20">|</span>
                <span className="text-white bg-white/20 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase font-mono tracking-wider shrink-0">
                  {currentUser.role === "Administrator"
                    ? t("login.admin")
                    : currentUser.role === "Chief Cashier"
                      ? t("login.cashier")
                      : currentUser.role === "Billing Clerk"
                        ? t("login.clerk")
                        : t("login.pujari")}
                </span>
              </div>

              {/* Cloud Database Status indicator */}
              <div
                className="hidden sm:flex items-center gap-1.5 bg-black/15 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-white/10"
                title={cloudSynced ? "Firestore Cloud Database: Live & Connected" : "Connecting to Firestore Cloud Database..."}
              >
                <Cloud className={`w-3.5 h-3.5 ${cloudSynced ? "text-emerald-300 animate-pulse" : "text-amber-300"}`} />
                <span className="text-amber-50 text-[9px] sm:text-[10px] tracking-widest font-black uppercase whitespace-nowrap">
                  {cloudSynced ? "Cloud Live" : "Connecting"}
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 bg-black/10 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-white/5">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399] shrink-0" />
                <span className="text-amber-50 text-[9px] sm:text-[10px] tracking-widest font-black uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)] whitespace-nowrap">
                  {t("header.secureSpool")}
                </span>
              </div>
            </div>
          </header>

          {/* MOBILE SIDEBAR DROPDOWN BACKDROP & DRAWER */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 z-35 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
              />

              {/* Drawer */}
              <div className="lg:hidden absolute top-14 left-0 right-0 max-h-[80vh] bg-[#160d0b] shadow-2xl border-b border-[#2d1713] z-40 p-4 space-y-4 animate-in slide-in-from-top duration-200 overflow-y-auto text-stone-100 light-scrollbar">
                {MENU_SECTIONS.map((section) => (
                  <div key={section.category} className="space-y-1">
                    <div className="px-3 text-[10px] font-black tracking-widest text-[#ff7a00]/90 uppercase font-mono flex items-center gap-1.5 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00] shrink-0"></span>
                      <span>{section.categoryKey ? t(section.categoryKey) : section.category}</span>
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setCurrentTab(item.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all text-left cursor-pointer ${
                              isActive
                                ? "bg-[#ff7a00] text-white font-semibold shadow-md"
                                : "text-stone-300 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#ff7a00]"}`} />
                              <span>{t("nav." + item.id)}</span>
                            </span>
                            {item.id === "billing" && (
                              <span className="bg-amber-500/10 text-amber-400 font-mono text-[9px] font-bold px-1.5 rounded-full border border-amber-500/20">
                                POS
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="border-t border-[#2d1713] pt-4 mt-4 flex items-center justify-between text-xs text-stone-400 px-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#ff7a00]" />
                    <span>
                      {t("dash.operator")}: <strong className="text-stone-200">{transliterateOperatorName(currentUser.name, language)}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowLogoutModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-red-400 font-bold hover:text-red-300 cursor-pointer px-2.5 py-1 bg-red-950/40 border border-red-900/50 rounded-lg text-xs"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}

          {/* 3. SCROLLABLE TAB SCREEN CONTAINER ELEMENT */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 pb-24 lg:pb-8 relative bg-[#f7f8fa] text-[#1e293b] light-scrollbar">
            {currentTab === "dashboard" && (
              <DashboardTab
                devotees={devotees}
                sevas={sevas}
                bills={bills}
                expenses={expenses}
                ledger={ledger}
                setCurrentTab={setCurrentTab}
                currentUser={currentUser}
                onQuickAddDevotee={() => {
                  setCurrentTab("devotees");
                }}
                onQuickAddExpense={() => {
                  setCurrentTab("expenses");
                }}
                onQuickBill={() => {
                  setCurrentTab("billing");
                }}
                setActiveBillForReceiptModal={setActiveBillForReceiptModal}
                cartItems={cartItems}
                setCartItems={setCartItems}
              />
            )}

            {currentTab === "devotees" && (
              <DevoteeTab
                devotees={devotees}
                bills={bills}
                currentUser={currentUser}
                onAddDevotee={handleAddDevotee}
                onUpdateDevotee={handleUpdateDevotee}
                onDeleteDevotee={handleDeleteDevotee}
              />
            )}

            {currentTab === "billing" && (
              <BillingTab
                bills={bills}
                devotees={devotees}
                sevas={sevas}
                settings={settings}
                currentUser={currentUser}
                onAddBill={handleAddBill}
                onUpdateBill={handleUpdateBill}
                onDeleteBill={handleDeleteBill}
                setCurrentTab={setCurrentTab}
                onQuickAddDevotee={() => {
                  setCurrentTab("devotees");
                }}
                activeBillForReceiptModal={activeBillForReceiptModal}
                setActiveBillForReceiptModal={setActiveBillForReceiptModal}
                cartItems={cartItems}
                setCartItems={setCartItems}
              />
            )}

            {currentTab === "sevas" && (
              <SevaTab
                sevas={sevas}
                currentUser={currentUser}
                onAddSeva={handleAddSeva}
                onUpdateSeva={handleUpdateSeva}
                onDeleteSeva={handleDeleteSeva}
              />
            )}

            {currentTab === "panchanga" && <PanchangaTab />}

            {currentTab === "expenses" && isAdmin && (
              <ExpensesTab
                expenses={expenses}
                currentUser={currentUser}
                onAddExpense={handleAddExpense}
                onUpdateExpense={handleUpdateExpense}
                onDeleteExpense={handleDeleteExpense}
                cashInHand={ledger.cashInHand}
                grandTotalBills={grandTotalBillsSum}
              />
            )}

            {currentTab === "accounts" && isAdmin && (
              <AccountsTab
                ledger={ledger}
                onRemitToBank={handleRemitToBank}
                grandTotalBills={grandTotalBillsSum}
                totalExpenses={totalExpensesSum}
              />
            )}

            {currentTab === "reports" && isAdmin && (
              <ReportsTab
                bills={bills}
                expenses={expenses}
                currentUser={currentUser}
                onResetBillingSystem={handleResetBillingSystem}
              />
            )}

            {currentTab === "users" && isAdmin && (
              <UsersTab
                users={users}
                currentUser={currentUser}
                onSwitchUser={handleSwitchUser}
                onAddUser={handleAddUser}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
              />
            )}

            {currentTab === "settings" && isAdmin && (
              <SettingsTab
                settings={settings}
                currentUser={currentUser}
                onSaveSettings={handleSaveSettings}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackup}
                onResetBillingSystem={handleResetBillingSystem}
              />
            )}
          </main>

          {/* MOBILE & TABLET BOTTOM WORKFLOW NAVIGATION BAR */}
          <nav
            className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#160d0b]/95 backdrop-blur-md border-t border-[#2d1713] px-2 py-1.5 safe-pb flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
            aria-label="Mobile Bottom Navigation"
          >
            {/* Dashboard */}
            <button
              onClick={() => {
                setCurrentTab("dashboard");
                setIsMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                currentTab === "dashboard" && !isMobileMenuOpen
                  ? "text-[#ff7a00]"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  currentTab === "dashboard" && !isMobileMenuOpen
                    ? "bg-[#ff7a00]/15"
                    : ""
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[65px] mt-0.5">
                {language === "kn" ? "ಮುಖಪುಟ" : "Dashboard"}
              </span>
            </button>

            {/* Billing POS */}
            <button
              onClick={() => {
                setCurrentTab("billing");
                setIsMobileMenuOpen(false);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                currentTab === "billing" && !isMobileMenuOpen
                  ? "text-[#ff7a00]"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <div
                className={`p-1 rounded-lg relative ${
                  currentTab === "billing" && !isMobileMenuOpen
                    ? "bg-[#ff7a00]/15"
                    : ""
                }`}
              >
                <Receipt className="w-4 h-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff7a00] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border border-[#160d0b]">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <span className="truncate max-w-[65px] mt-0.5">
                {language === "kn" ? "ಬಿಲ್ಲಿಂಗ್" : "Billing"}
              </span>
            </button>

            {/* Devotees */}
            <button
              onClick={() => {
                setCurrentTab("devotees");
                setIsMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                currentTab === "devotees" && !isMobileMenuOpen
                  ? "text-[#ff7a00]"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  currentTab === "devotees" && !isMobileMenuOpen
                    ? "bg-[#ff7a00]/15"
                    : ""
                }`}
              >
                <Users className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[65px] mt-0.5">
                {language === "kn" ? "ಭಕ್ತರು" : "Devotees"}
              </span>
            </button>

            {/* Panchanga */}
            <button
              onClick={() => {
                setCurrentTab("panchanga");
                setIsMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                currentTab === "panchanga" && !isMobileMenuOpen
                  ? "text-[#ff7a00]"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  currentTab === "panchanga" && !isMobileMenuOpen
                    ? "bg-[#ff7a00]/15"
                    : ""
                }`}
              >
                <Calendar className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[65px] mt-0.5">
                {language === "kn" ? "ಪಂಚಾಂಗ" : "Panchanga"}
              </span>
            </button>

            {/* Menu Drawer Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                isMobileMenuOpen
                  ? "text-[#ff7a00]"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isMobileMenuOpen ? "bg-[#ff7a00]/15" : ""
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </div>
              <span className="truncate max-w-[65px] mt-0.5">
                {language === "kn" ? "ಮೆನು" : "Menu"}
              </span>
            </button>
          </nav>
        </div>

        {/* Enhanced Logout / Disconnect Confirmation Modal with Backup Option */}
        {showLogoutModal && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none animate-in fade-in duration-200"
            id="logout-confirmation-overlay"
          >
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3.5 bg-amber-50 text-[#ff7a00] rounded-full border border-amber-200 shadow-sm">
                  <Power className="w-7 h-7 text-[#ff7a00]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800 tracking-wider uppercase font-display">
                    {t("nav.disconnectTerminal")}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === "kn"
                      ? "ನೀವು ಲಾಗ್ ಔಟ್ ಮಾಡುವ ಮೊದಲು ಈ ಅವಧಿಯ ಡೇಟಾಬೇಸ್ ಬ್ಯಾಕಪ್ (JSON) ಅನ್ನು ಉಳಿಸಲು ಬಯಸುತ್ತೀರಾ?"
                      : "Would you like to save a JSON backup of the terminal database before logging out?"}
                  </p>
                </div>

                {/* Last backup timestamp if available */}
                {localStorage.getItem("dsssm_last_backup_at") && (
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-600 flex items-center justify-between font-mono">
                    <span className="text-slate-400">Last JSON Backup:</span>
                    <span className="font-bold text-amber-600">
                      {new Date(
                        localStorage.getItem("dsssm_last_backup_at")!
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    const bundle = generateBackupBundle(
                      devotees,
                      sevas,
                      bills,
                      expenses,
                      ledger,
                      users,
                      settings,
                      cartItems
                    );
                    try {
                      const res = await downloadBackupFile(bundle, "DSSM_TEMPLE_DATABASE.json");
                      alert(`✔ Database backup saved (${res.fileName}).\nTerminal session logged out.`);
                      setCurrentUser(null);
                      setShowLogoutModal(false);
                    } catch (err: any) {
                      if (err?.name === "AbortError") {
                        // User canceled save dialog, don't force logout
                        return;
                      }
                      alert("Error saving backup file. Session logged out.");
                      setCurrentUser(null);
                      setShowLogoutModal(false);
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-[#ff7a00] hover:bg-[#ea580c] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {language === "kn"
                      ? "JSON ಬ್ಯಾಕಪ್ ಉಳಿಸಿ ಮತ್ತು ಲಾಗ್ ಔಟ್ ಮಾಡಿ"
                      : "Save JSON Backup & Logout"}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentUser(null);
                      setShowLogoutModal(false);
                    }}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {language === "kn" ? "ಸ್ಕಿಪ್ ಮಾಡಿ (ಲಾಗ್ ಔಟ್)" : "Skip Backup"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(false)}
                    className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t("nav.cancel")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global A4 Receipt / Invoice Preview & Spooling System */}
      {activeBillForReceiptModal && (
        <ReceiptModal
          bill={activeBillForReceiptModal}
          settings={settings}
          onClose={() => setActiveBillForReceiptModal(null)}
        />
      )}
    </>
  );
}
