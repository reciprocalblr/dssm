/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Devotee {
  id: string;
  name: string;
  phone: string;
  gothra: string;
  nakshatra: string;
  rashi: string;
  address?: string;
  email?: string;
  familyMembers?: { name: string; relation: string; dob?: string }[];
  remarks?: string;
  createdAt: string;
}

export interface Seva {
  id: string;
  name: string;
  code: string;
  price: number;
  description: string;
  category:
    | "Daily Pooja"
    | "Abhishekha"
    | "Special Seva"
    | "Homa"
    | "Prasada"
    | "Donation";
  isActive: boolean;
}

export interface BillItem {
  id: string;
  sevaId: string;
  sevaName: string;
  price: number;
  count: number;
  pujariDakshina: number;
  bookingDate: string;
  devoteeName: string;
  gothra?: string;
  nakshatra?: string;
  rashi?: string;
  address?: string;
}

export interface Bill {
  id: string; // e.g., "DSSM-2026-27-0001"
  devoteeId?: string; // Optional (allows direct walk-in booking)
  devoteeName: string;
  phone?: string;
  gothra?: string;
  nakshatra?: string;
  rashi?: string;
  address?: string;
  isRegistered: boolean;
  items: BillItem[];
  subtotal: number;
  pujariDakshinaTotal: number;
  grandTotal: number;
  paymentMode: "Cash" | "UPI" | "Card" | "Bank Transfer";
  paymentReference?: string;
  createdByUser: string;
  createdAt: string;
  isCancelled?: boolean;
}

export interface Expense {
  id: string;
  category:
    | "Pooja Samagri"
    | "Annadana Provision"
    | "Salaries"
    | "Utility"
    | "Maintenance"
    | "Charity"
    | "Other";
  description: string;
  amount: number;
  date: string;
  recordedBy: string;
  paymentMode: "Cash" | "Bank Transfer" | "UPI";
  otherDetails?: string;
}

export interface AccountLedger {
  cashInHand: number;
  bankBalance: number;
  capitalFund: number;
  annadanaFund: number;
  remittances: { date: string; amount: number; description: string }[];
}

export interface SystemUser {
  id: string;
  username: string;
  name: string;
  role: "Administrator" | "Chief Cashier" | "Billing Clerk" | "Pujari";
  isActive: boolean;
  contactNumber?: string;
  responsibilities?: string;
  password?: string;
}

export interface TempleSettings {
  templeName: string;
  tagline: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  contactNumber: string;
  upiMerchantId: string;
  upiDisplayName: string;
  receiptPrefix: string;
  paperSize: "80mm" | "A4";
  enableBlessingMessage: boolean;
  blessingMessage: string;
}
