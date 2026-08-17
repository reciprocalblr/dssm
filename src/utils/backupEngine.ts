import { Devotee, Seva, Bill, Expense, AccountLedger, SystemUser, TempleSettings } from "../types";

export interface BackupBundle {
  version: string;
  appName: string;
  exportTimestamp: string;
  entityCounts: {
    devotees: number;
    sevas: number;
    bills: number;
    expenses: number;
    users: number;
  };
  data: {
    devotees: Devotee[];
    sevas: Seva[];
    bills: Bill[];
    expenses: Expense[];
    ledger: AccountLedger;
    users: SystemUser[];
    settings: TempleSettings;
    cartItems?: any[];
  };
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  timestamp?: string;
  counts?: {
    devotees: number;
    sevas: number;
    bills: number;
    expenses: number;
    users: number;
  };
  data?: {
    devotees: Devotee[];
    sevas: Seva[];
    bills: Bill[];
    expenses: Expense[];
    ledger: AccountLedger;
    users: SystemUser[];
    settings: TempleSettings;
    cartItems?: any[];
  };
}

/**
 * Creates a structured JSON backup bundle containing all database entities and metadata.
 */
export function generateBackupBundle(
  devotees: Devotee[],
  sevas: Seva[],
  bills: Bill[],
  expenses: Expense[],
  ledger: AccountLedger,
  users: SystemUser[],
  settings: TempleSettings,
  cartItems: any[] = []
): BackupBundle {
  return {
    version: "1.0",
    appName: "DSSM Temple Billing System",
    exportTimestamp: new Date().toISOString(),
    entityCounts: {
      devotees: devotees?.length || 0,
      sevas: sevas?.length || 0,
      bills: bills?.length || 0,
      expenses: expenses?.length || 0,
      users: users?.length || 0,
    },
    data: {
      devotees: devotees || [],
      sevas: sevas || [],
      bills: bills || [],
      expenses: expenses || [],
      ledger: ledger || { id: "main-ledger", cashInHand: 0, bankBalance: 0, totalIncome: 0, totalExpenses: 0, lastUpdated: new Date().toISOString() },
      users: users || [],
      settings: settings || {},
      cartItems: cartItems || [],
    },
  };
}

/**
 * Saves or overwrites the JSON backup file using File System Access API (when supported in Chrome/Edge/Opera)
 * to rewrite a single master file (DSSM_TEMPLE_DATABASE.json) directly on the local machine,
 * or falls back to traditional browser download with a fixed filename.
 */
export async function downloadBackupFile(
  bundle: BackupBundle,
  customFilename?: string
): Promise<{ fileName: string; overwritten: boolean }> {
  const jsonStr = JSON.stringify(bundle, null, 2);
  const fileName = customFilename || "DSSM_TEMPLE_DATABASE.json";

  // Try modern File System Access API first (supported in Chrome/Edge/Opera)
  if ("showSaveFilePicker" in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: "DSSM Temple JSON Database",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(jsonStr);
      await writable.close();

      localStorage.setItem("dsssm_last_backup_at", new Date().toISOString());
      return { fileName: handle.name || fileName, overwritten: true };
    } catch (err: any) {
      if (err?.name === "AbortError") {
        throw err; // User explicitly canceled the file picker dialog
      }
      // If error or not permitted, fall through to anchor download fallback
    }
  }

  // Fallback for traditional download
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(jsonStr);
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", fileName);
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);

  localStorage.setItem("dsssm_last_backup_at", new Date().toISOString());
  return { fileName, overwritten: false };
}

/**
 * Validates and parses a JSON string (supporting both metadata-wrapped and legacy flat formats).
 */
export function validateAndParseBackup(jsonString: string): ValidationResult {
  try {
    if (!jsonString || !jsonString.trim()) {
      return { valid: false, error: "The provided JSON text is empty." };
    }

    const parsed = JSON.parse(jsonString.trim());

    let dataObj: any;
    let timestamp: string | undefined;

    if (parsed && typeof parsed === "object") {
      if (parsed.data && typeof parsed.data === "object") {
        dataObj = parsed.data;
        timestamp = parsed.exportTimestamp;
      } else {
        dataObj = parsed; // Legacy flat structure
      }
    } else {
      return { valid: false, error: "Invalid JSON structure. Object expected." };
    }

    // Verify critical entities exist
    if (
      !Array.isArray(dataObj.devotees) ||
      !Array.isArray(dataObj.sevas) ||
      !Array.isArray(dataObj.bills) ||
      !Array.isArray(dataObj.expenses) ||
      !Array.isArray(dataObj.users) ||
      !dataObj.settings ||
      !dataObj.ledger
    ) {
      return {
        valid: false,
        error: "Missing required database tables (devotees, sevas, bills, expenses, users, settings, ledger).",
      };
    }

    return {
      valid: true,
      timestamp,
      counts: {
        devotees: dataObj.devotees.length,
        sevas: dataObj.sevas.length,
        bills: dataObj.bills.length,
        expenses: dataObj.expenses.length,
        users: dataObj.users.length,
      },
      data: {
        devotees: dataObj.devotees,
        sevas: dataObj.sevas,
        bills: dataObj.bills,
        expenses: dataObj.expenses,
        ledger: dataObj.ledger,
        users: dataObj.users,
        settings: dataObj.settings,
        cartItems: Array.isArray(dataObj.cartItems) ? dataObj.cartItems : [],
      },
    };
  } catch (err: any) {
    return {
      valid: false,
      error: `JSON Parsing error: ${err?.message || "Invalid JSON syntax"}`,
    };
  }
}

/**
 * Save an emergency safety copy of the database to localStorage.
 */
export function createSafetyBackup(bundle: BackupBundle): void {
  try {
    localStorage.setItem("dsssm_auto_safety_backup", JSON.stringify(bundle));
  } catch (e) {
    console.error("Failed to write auto safety backup", e);
  }
}

/**
 * Save a safety copy immediately prior to restoring an archive.
 */
export function createPreRestoreBackup(bundle: BackupBundle): void {
  try {
    localStorage.setItem("dsssm_pre_restore_backup", JSON.stringify(bundle));
  } catch (e) {
    console.error("Failed to write pre-restore safety backup", e);
  }
}

export function getSafetyBackup(): BackupBundle | null {
  try {
    const saved = localStorage.getItem("dsssm_auto_safety_backup");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function getPreRestoreBackup(): BackupBundle | null {
  try {
    const saved = localStorage.getItem("dsssm_pre_restore_backup");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}
