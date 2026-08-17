/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Devotee,
  Seva,
  Bill,
  Expense,
  AccountLedger,
  SystemUser,
  TempleSettings,
} from "../types";

const getRelativeDateFormatted = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split("T")[0];
};

const getRelativeDateISO = (offsetDays: number, hourStr: string): string => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return `${d.toISOString().split("T")[0]}T${hourStr}Z`;
};

export const initialDevotees: Devotee[] = [
  {
    id: "DEV-1001",
    name: "Anand Kumar",
    phone: "9845012345",
    gothra: "Kashyapa",
    nakshatra: "Rohini",
    rashi: "Vrishabha",
    address: "12, 4th Main, Vaddarahalli, Bangalore",
    email: "anand.kumar@gmail.com",
    familyMembers: [
      { name: "Sujatha Anand", relation: "Spouse", dob: "1983-05-12" },
      { name: "Aditya Kumar", relation: "Son", dob: "2010-08-25" },
    ],
    remarks: "Regular Thursday visitor. Prefers Annadana donation.",
    createdAt: "2026-04-10T11:20:00Z",
  },
  {
    id: "DEV-1002",
    name: "Ramesh Rao",
    phone: "9900112233",
    gothra: "Bharadwaj",
    nakshatra: "Pushya",
    rashi: "Karka",
    address: "45/A, Sai Kuteera, Pipeline Road, Vaddarahalli, Bangalore",
    email: "ramesh.rao@yahoo.com",
    familyMembers: [{ name: "Mangala Rao", relation: "Spouse" }],
    remarks: "Sponsors Thursday Special Alankara once in 3 months.",
    createdAt: "2026-04-15T09:15:00Z",
  },
  {
    id: "DEV-1003",
    name: "Nandini Gowda",
    phone: "9448098765",
    gothra: "Vishwamitra",
    nakshatra: "Hasta",
    rashi: "Kanya",
    address: "Sree Nilaya, Near Temple Arch, Vaddarahalli, Bangalore",
    familyMembers: [
      { name: "Kiran Gowda", relation: "Son" },
      { name: "Sharath Gowda", relation: "Son" },
    ],
    remarks: "Volunteers for festival queue management and flower decoration.",
    createdAt: "2026-05-01T14:30:00Z",
  },
  {
    id: "DEV-1004",
    name: "Prashanth Hegde",
    phone: "8073123456",
    gothra: "Vashishta",
    nakshatra: "Uttara Bhadrapada",
    rashi: "Meena",
    address: "Apartment 302, Sai Flora, Vaddarahalli, Bangalore",
    email: "prashanth.h@gmail.com",
    remarks: "Corporate donor. Conducts Sri Satyanarayana Vratha.",
    createdAt: "2026-05-12T10:00:00Z",
  },
];

export const initialSevas: Seva[] = [
  {
    id: "SEVA-001",
    name: "Ksheerabhisheka Seva (Milk Bath)",
    code: "KSB",
    price: 150,
    description:
      "Abhishekha of Sri Sai Baba with fresh milk, performed during Kakad Arati. Includes Prasada (Sweet Pongal and Baba Udi).",
    category: "Abhishekha",
    isActive: true,
  },
  {
    id: "SEVA-002",
    name: "Panchamrutha Abhisheka Seva",
    code: "PMB",
    price: 351,
    description:
      "Detailed Abhishekha with five sacred items. Performed at 7:30 AM. Includes coconut, sweet prasada, and photo card.",
    category: "Abhishekha",
    isActive: true,
  },
  {
    id: "SEVA-003",
    name: "Astothara Archana",
    code: "ARC",
    price: 51,
    description:
      "Daily chanting of 108 names of Sri Sai Baba. Includes Baba's sacred Udi and Kumkuma.",
    category: "Daily Pooja",
    isActive: true,
  },
  {
    id: "SEVA-004",
    name: "Sahasranama Archana (1008 Names)",
    code: "SNA",
    price: 151,
    description:
      "Detailed chanting of 1008 names of Sai Baba. Performed on Thursdays and weekends.",
    category: "Daily Pooja",
    isActive: true,
  },
  {
    id: "SEVA-005",
    name: "Sri Satyanarayana Swamy Pooja",
    code: "SVR",
    price: 1001,
    description:
      "Performed on Full Moon (Pournami) days or special requests. Materials provided by Temple.",
    category: "Special Seva",
    isActive: true,
  },
  {
    id: "SEVA-006",
    name: "Thursday Special Pushpa Alankara Seva",
    code: "SPS",
    price: 2501,
    description:
      "Sponsorship of fresh flower decoration for Sri Sai Baba on Thursday. Devotee name read in Sankalpa.",
    category: "Special Seva",
    isActive: true,
  },
  {
    id: "SEVA-007",
    name: "Anna Daana Seva (One Day Meal)",
    code: "ADS",
    price: 3001,
    description:
      "Direct sponsorship of Maha Prasad / Annadana served to devotees in the temple dining hall.",
    category: "Prasada",
    isActive: true,
  },
  {
    id: "SEVA-008",
    name: "Ganapathi Homa (Success/Removal of Obstacles)",
    code: "GNH",
    price: 1501,
    description:
      "Sacred fire ritual performed in the morning for health, peace, and prosperity.",
    category: "Homa",
    isActive: true,
  },
  {
    id: "SEVA-009",
    name: "Two Wheeler Vehicle Pooja",
    code: "TWP",
    price: 101,
    description:
      "Pooja including arati, lemon, and sacred string tie for newly bought motorcycles/scooters.",
    category: "Daily Pooja",
    isActive: true,
  },
  {
    id: "SEVA-010",
    name: "Four Wheeler Vehicle Pooja",
    code: "FWP",
    price: 251,
    description:
      "Vehicle pooja with customized layout, breaking 4 coconuts, lemons under tires, and full arati.",
    category: "Daily Pooja",
    isActive: true,
  },
  {
    id: "SEVA-011",
    name: "General Kanike (Sanctum Donation)",
    code: "KNK",
    price: 0,
    description:
      "Direct donation for temple improvement and charitable works. Enter customized amount.",
    category: "Donation",
    isActive: true,
  },
];

export const initialExpenses: Expense[] = [
  {
    id: "EXP-201",
    category: "Pooja Samagri",
    description:
      "Weekly fresh flowers (marigold, jasmine) and tulsi garlands for Sri Sai Baba",
    amount: 1850,
    date: getRelativeDateISO(6, "10:15:00"),
    recordedBy: "admin",
    paymentMode: "Cash",
  },
  {
    id: "EXP-202",
    category: "Annadana Provision",
    description:
      "Purchase of Sona Masoori Rice (5 Bags), Tur dal, and edible oil from wholesale co-op",
    amount: 14200,
    date: getRelativeDateISO(5, "12:30:00"),
    recordedBy: "admin",
    paymentMode: "UPI",
  },
  {
    id: "EXP-203",
    category: "Utility",
    description:
      "BESCOM monthly electricity charges for Temple Sanctum and Dining Hall",
    amount: 3250,
    date: getRelativeDateISO(4, "15:00:00"),
    recordedBy: "admin",
    paymentMode: "Bank Transfer",
  },
  {
    id: "EXP-204",
    category: "Salaries",
    description:
      "Honorarium (Dakshina) to Chief Priest Sri Chandrashekar Bhat for May 2026",
    amount: 25000,
    date: getRelativeDateISO(10, "10:00:00"),
    recordedBy: "admin",
    paymentMode: "Bank Transfer",
  },
];

export const initialLedger: AccountLedger = {
  cashInHand: 15450,
  bankBalance: 245800,
  capitalFund: 200000,
  annadanaFund: 45800,
  remittances: [
    {
      date: getRelativeDateISO(10, "15:00:00"),
      amount: 10000,
      description:
        "Remitted excess temple cash counter collections to Vijaya Bank account",
    },
    {
      date: getRelativeDateISO(4, "16:00:00"),
      amount: 15000,
      description: "Remitted cash to bank account",
    },
  ],
};

export const initialUsers: SystemUser[] = [];

export const defaultSettings: TempleSettings = {
  templeName: "DAKSHINA SHIRDI SRI SAI MANDIRA AND DATTAPEETA",
  tagline: "Magadi Main Road, near Kamadhenu Kshethra",
  addressLine1: "Kammasandra, Vaddarahalli",
  addressLine2: "Karnataka 562162",
  city: "Bangalore",
  postalCode: "562162",
  contactNumber: "080-28564251",
  upiMerchantId: "srisaimandira@upi",
  upiDisplayName: "DAKSHINA SHIRDI SRI SAI TRUST",
  receiptPrefix: "DSSM",
  paperSize: "80mm",
  enableBlessingMessage: true,
  blessingMessage:
    "May the Divine Grace of Shirdi Sai Baba bring Peace, Prosperity, and Happiness to your entire family. Om Sai Ram.",
};

// Generates some initial bills mock dated spanning the past couple of days
export const initialBills: Bill[] = [
  {
    id: "DSSM-2026-27-0001",
    devoteeId: "DEV-1001",
    devoteeName: "Anand Kumar",
    phone: "9845012345",
    gothra: "Kashyapa",
    nakshatra: "Rohini",
    rashi: "Vrishabha",
    isRegistered: true,
    items: [
      {
        id: "BI-01",
        sevaId: "SEVA-001",
        sevaName: "Ksheerabhisheka Seva (Milk Bath)",
        price: 150,
        count: 1,
        pujariDakshina: 20,
        bookingDate: getRelativeDateFormatted(1),
        devoteeName: "Anand Kumar",
      },
      {
        id: "BI-02",
        sevaId: "SEVA-003",
        sevaName: "Astothara Archana",
        price: 51,
        count: 2,
        pujariDakshina: 10,
        bookingDate: getRelativeDateFormatted(1),
        devoteeName: "Anand Kumar",
      },
    ],
    subtotal: 252,
    pujariDakshinaTotal: 40,
    grandTotal: 292,
    paymentMode: "Cash",
    createdByUser: "rashmi",
    createdAt: getRelativeDateISO(1, "08:30:00"),
  },
  {
    id: "DSSM-2026-27-0002",
    devoteeId: "DEV-1004",
    devoteeName: "Prashanth Hegde",
    phone: "8073123456",
    gothra: "Vashishta",
    nakshatra: "Uttara Bhadrapada",
    rashi: "Meena",
    isRegistered: true,
    items: [
      {
        id: "BI-03",
        sevaId: "SEVA-005",
        sevaName: "Sri Satyanarayana Swamy Pooja",
        price: 1001,
        count: 1,
        pujariDakshina: 150,
        bookingDate: getRelativeDateFormatted(1),
        devoteeName: "Prashanth Hegde",
      },
    ],
    subtotal: 1001,
    pujariDakshinaTotal: 150,
    grandTotal: 1151,
    paymentMode: "UPI",
    paymentReference: "UPI982347102934",
    createdByUser: "rashmi",
    createdAt: getRelativeDateISO(1, "10:15:00"),
  },
  {
    id: "DSSM-2026-27-0003",
    devoteeName: "Saraswathi Bai (Walk-in)",
    phone: "9108123456",
    gothra: "Atreya",
    nakshatra: "Swati",
    rashi: "Tula",
    isRegistered: false,
    items: [
      {
        id: "BI-04",
        sevaId: "SEVA-004",
        sevaName: "Sahasranama Archana (1008 Names)",
        price: 151,
        count: 1,
        pujariDakshina: 30,
        bookingDate: getRelativeDateFormatted(1),
        devoteeName: "Saraswathi Bai",
      },
    ],
    subtotal: 151,
    pujariDakshinaTotal: 30,
    grandTotal: 181,
    paymentMode: "Cash",
    createdByUser: "rashmi",
    createdAt: getRelativeDateISO(1, "16:45:00"),
  },
  {
    id: "DSSM-2026-27-0004",
    devoteeId: "DEV-1003",
    devoteeName: "Nandini Gowda",
    phone: "9448098765",
    gothra: "Vishwamitra",
    nakshatra: "Hasta",
    rashi: "Kanya",
    isRegistered: true,
    items: [
      {
        id: "BI-05",
        sevaId: "SEVA-007",
        sevaName: "Anna Daana Seva (One Day Meal)",
        price: 3001,
        count: 1,
        pujariDakshina: 0,
        bookingDate: getRelativeDateFormatted(0),
        devoteeName: "Nandini Gowda",
      },
    ],
    subtotal: 3001,
    pujariDakshinaTotal: 0,
    grandTotal: 3001,
    paymentMode: "UPI",
    paymentReference: "GPAY7712398542",
    createdByUser: "admin",
    createdAt: getRelativeDateISO(0, "02:10:00"),
  },
];
