import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  runTransaction,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  Devotee,
  Seva,
  Bill,
  Expense,
  AccountLedger,
  SystemUser,
  TempleSettings,
} from "../types";

// Collection Names
export const COLLECTIONS = {
  DEVOTEES: "devotees",
  SEVAS: "sevas",
  BILLS: "bills",
  EXPENSES: "expenses",
  LEDGER: "ledger",
  USERS: "users",
  SETTINGS: "settings",
} as const;

// ----------------------------------------------------
// 1. REAL-TIME SUBSCRIPTION HOOKS & HELPERS (MULTI-DEVICE)
// ----------------------------------------------------

export function subscribeDevotees(callback: (devotees: Devotee[]) => void) {
  const colRef = collection(db, COLLECTIONS.DEVOTEES);
  return onSnapshot(
    colRef,
    { includeMetadataChanges: false },
    (snapshot) => {
      const list: Devotee[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Devotee);
      });
      // Sort newest first
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
      callback(list);
    },
    (error) => {
      console.error("Error subscribing to devotees:", error);
    },
  );
}

export function subscribeSevas(callback: (sevas: Seva[]) => void) {
  const colRef = collection(db, COLLECTIONS.SEVAS);
  return onSnapshot(
    colRef,
    { includeMetadataChanges: false },
    (snapshot) => {
      const list: Seva[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Seva);
      });
      list.sort((a, b) => (a.code || "").localeCompare(b.code || ""));
      callback(list);
    },
    (error) => {
      console.error("Error subscribing to sevas:", error);
    },
  );
}

export function subscribeBills(callback: (bills: Bill[]) => void) {
  const colRef = collection(db, COLLECTIONS.BILLS);
  return onSnapshot(
    colRef,
    { includeMetadataChanges: false },
    (snapshot) => {
      const list: Bill[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Bill);
      });
      // Sort newest first
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
      callback(list);
    },
    (error) => {
      console.error("Error subscribing to bills:", error);
    },
  );
}

export function subscribeExpenses(callback: (expenses: Expense[]) => void) {
  const colRef = collection(db, COLLECTIONS.EXPENSES);
  return onSnapshot(
    colRef,
    { includeMetadataChanges: false },
    (snapshot) => {
      const list: Expense[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Expense);
      });
      list.sort(
        (a, b) =>
          new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
      );
      callback(list);
    },
    (error) => {
      console.error("Error subscribing to expenses:", error);
    },
  );
}

export function subscribeLedger(callback: (ledger: AccountLedger) => void) {
  const docRef = doc(db, COLLECTIONS.LEDGER, "current");
  return onSnapshot(
    docRef,
    { includeMetadataChanges: false },
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as AccountLedger);
      }
    },
    (error) => {
      console.error("Error subscribing to ledger:", error);
    },
  );
}

export function subscribeUsers(callback: (users: SystemUser[]) => void) {
  const colRef = collection(db, COLLECTIONS.USERS);
  return onSnapshot(
    colRef,
    { includeMetadataChanges: false },
    (snapshot) => {
      const list: SystemUser[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as SystemUser);
      });
      callback(list);
    },
    (error) => {
      console.error("Error subscribing to users:", error);
    },
  );
}

export function subscribeSettings(
  callback: (settings: TempleSettings) => void,
) {
  const docRef = doc(db, COLLECTIONS.SETTINGS, "temple");
  return onSnapshot(
    docRef,
    { includeMetadataChanges: false },
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as TempleSettings);
      }
    },
    (error) => {
      console.error("Error subscribing to settings:", error);
    },
  );
}

// ----------------------------------------------------
// 2. MUTATION OPERATIONS (PROMISES & ATOMIC TRANSACTIONS)
// ----------------------------------------------------

export async function saveDevoteeToFirestore(devotee: Devotee) {
  const docRef = doc(db, COLLECTIONS.DEVOTEES, devotee.id);
  await setDoc(docRef, devotee, { merge: true });
}

export async function deleteDevoteeFromFirestore(id: string) {
  const docRef = doc(db, COLLECTIONS.DEVOTEES, id);
  await deleteDoc(docRef);
}

export async function saveSevaToFirestore(seva: Seva) {
  const docRef = doc(db, COLLECTIONS.SEVAS, seva.id);
  await setDoc(docRef, seva, { merge: true });
}

export async function deleteSevaFromFirestore(id: string) {
  const docRef = doc(db, COLLECTIONS.SEVAS, id);
  await deleteDoc(docRef);
}

export async function saveBillToFirestore(bill: Bill) {
  const docRef = doc(db, COLLECTIONS.BILLS, bill.id);
  await setDoc(docRef, bill, { merge: true });
}

export async function deleteBillFromFirestore(id: string) {
  const docRef = doc(db, COLLECTIONS.BILLS, id);
  await deleteDoc(docRef);
}

export async function saveExpenseToFirestore(expense: Expense) {
  const docRef = doc(db, COLLECTIONS.EXPENSES, expense.id);
  await setDoc(docRef, expense, { merge: true });
}

export async function deleteExpenseFromFirestore(id: string) {
  const docRef = doc(db, COLLECTIONS.EXPENSES, id);
  await deleteDoc(docRef);
}

export async function saveLedgerToFirestore(ledger: AccountLedger) {
  const docRef = doc(db, COLLECTIONS.LEDGER, "current");
  await setDoc(docRef, ledger, { merge: true });
}

/**
 * Multi-device atomic ledger updater using Firestore runTransaction.
 * Guarantees that concurrent bill checkouts or expenses from multiple devices
 * never overwrite or corrupt financial totals.
 */
export async function atomicUpdateLedger(
  cashDelta: number,
  bankDelta: number,
  remittance?: { date: string; amount: number; description: string },
) {
  const docRef = doc(db, COLLECTIONS.LEDGER, "current");
  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(docRef);
      if (!snap.exists()) {
        const defaultLedger: AccountLedger = {
          cashInHand: Math.max(0, cashDelta),
          bankBalance: Math.max(0, bankDelta),
          capitalFund: 500000,
          annadanaFund: 150000,
          remittances: remittance ? [remittance] : [],
        };
        transaction.set(docRef, defaultLedger);
        return;
      }

      const data = snap.data() as AccountLedger;
      const updatedCash = (data.cashInHand || 0) + cashDelta;
      const updatedBank = (data.bankBalance || 0) + bankDelta;
      const updatedRemittances = remittance
        ? [...(data.remittances || []), remittance]
        : (data.remittances || []);

      transaction.update(docRef, {
        cashInHand: updatedCash,
        bankBalance: updatedBank,
        remittances: updatedRemittances,
      });
    });
  } catch (err) {
    console.error("Failed to atomically update ledger:", err);
  }
}

export async function saveUserToFirestore(user: SystemUser) {
  const docRef = doc(db, COLLECTIONS.USERS, user.id);
  await setDoc(docRef, user, { merge: true });
}

export async function deleteUserFromFirestore(id: string) {
  const docRef = doc(db, COLLECTIONS.USERS, id);
  await deleteDoc(docRef);
}

export async function saveSettingsToFirestore(settings: TempleSettings) {
  const docRef = doc(db, COLLECTIONS.SETTINGS, "temple");
  await setDoc(docRef, settings, { merge: true });
}

// ----------------------------------------------------
// 3. INITIAL SEEDING / MIGRATION INTO FIRESTORE
// ----------------------------------------------------

export async function initializeFirestoreDatabase(initialPayload: {
  devotees: Devotee[];
  sevas: Seva[];
  bills: Bill[];
  expenses: Expense[];
  ledger: AccountLedger;
  users: SystemUser[];
  settings: TempleSettings;
}) {
  try {
    const sevasSnap = await getDocs(collection(db, COLLECTIONS.SEVAS));
    // If sevas is empty, seed everything
    if (sevasSnap.empty) {
      console.log("Seeding initial data into Firestore...");
      const batch = writeBatch(db);

      // Seed Sevas
      for (const s of initialPayload.sevas) {
        batch.set(doc(db, COLLECTIONS.SEVAS, s.id), s);
      }

      // Seed Devotees
      for (const d of initialPayload.devotees) {
        batch.set(doc(db, COLLECTIONS.DEVOTEES, d.id), d);
      }

      // Seed Bills
      for (const b of initialPayload.bills) {
        batch.set(doc(db, COLLECTIONS.BILLS, b.id), b);
      }

      // Seed Expenses
      for (const e of initialPayload.expenses) {
        batch.set(doc(db, COLLECTIONS.EXPENSES, e.id), e);
      }

      // Seed Ledger
      batch.set(
        doc(db, COLLECTIONS.LEDGER, "current"),
        initialPayload.ledger,
      );

      // Seed Users
      for (const u of initialPayload.users) {
        batch.set(doc(db, COLLECTIONS.USERS, u.id), u);
      }

      // Seed Settings
      batch.set(
        doc(db, COLLECTIONS.SETTINGS, "temple"),
        initialPayload.settings,
      );

      await batch.commit();
      console.log("Firestore database seeded successfully!");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error during Firestore initialization:", error);
    return false;
  }
}
