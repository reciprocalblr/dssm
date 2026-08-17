/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Users,
  UserCheck,
  ShieldAlert,
  Clock,
  Plus,
  Check,
  X,
  Trash2,
  Lock,
  Smartphone,
  Edit2,
  Shield,
  FileSpreadsheet,
  AlertCircle,
  Key,
} from "lucide-react";
import { SystemUser } from "../types";
import { useLanguage } from "../context/LanguageContext";

const RESPONSIBILITY_OPTIONS = [
  {
    id: "book_receipt",
    label: "Issue Pooja Tickets & Receipts",
    desc: "Book new sevas and print ticket counter invoices.",
  },
  {
    id: "edit_devotees",
    label: "Manage Devotee Directory",
    desc: "Add/update devotee demographic records.",
  },
  {
    id: "void_billing",
    label: "Void & Cancel Tickets",
    desc: "Administer daily ticket cancellations & register alterations.",
  },
  {
    id: "manage_financials",
    label: "Petty Cash & Expense Logging",
    desc: "Record daily temple expenses & maintain ledgers.",
  },
  {
    id: "admin_sys_config",
    label: "Override Settings & Rates",
    desc: "Modify puja prices, configurations & staff profiles.",
  },
  {
    id: "pujari_consecrate",
    label: "Pujari Sanctum Offerings",
    desc: "Oversee rituals, distribute prasadam & do pujas.",
  },
];

interface UsersTabProps {
  users: SystemUser[];
  currentUser: SystemUser;
  onSwitchUser: (user: SystemUser) => void;
  onAddUser: (user: Omit<SystemUser, "id">) => void;
  onUpdateUser: (user: SystemUser) => void;
  onDeleteUser: (userId: string) => void;
}

export default function UsersTab({
  users,
  currentUser,
  onSwitchUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}: UsersTabProps) {
  const { t } = useLanguage();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  // Custom confirmation and passcode update states
  const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null);
  const [userToChangePassword, setUserToChangePassword] =
    useState<SystemUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(
    null,
  );

  // Create Form State
  const [createName, setCreateName] = useState("");
  const [createUsername, setCreateUsername] = useState("");
  const [createRole, setCreateRole] =
    useState<SystemUser["role"]>("Billing Clerk");
  const [createContactNumber, setCreateContactNumber] = useState("");
  const [createPassword, setCreatePassword] = useState("dssm2026");
  const [createSelectedOpts, setCreateSelectedOpts] = useState<string[]>([
    "book_receipt",
    "edit_devotees",
  ]);

  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState<SystemUser["role"]>("Billing Clerk");
  const [editContact, setEditContact] = useState("");
  const [editSelectedOpts, setEditSelectedOpts] = useState<string[]>([]);

  const isAdmin = currentUser.role === "Administrator";
  const displayedUsers = users.filter(
    (u) => u.username.toLowerCase() !== "godmode",
  );

  const getDefaultOptionsForRole = (role: SystemUser["role"]): string[] => {
    switch (role) {
      case "Administrator":
        return [
          "book_receipt",
          "edit_devotees",
          "void_billing",
          "manage_financials",
          "admin_sys_config",
          "pujari_consecrate",
        ];
      case "Chief Cashier":
        return [
          "book_receipt",
          "edit_devotees",
          "void_billing",
          "manage_financials",
        ];
      case "Billing Clerk":
        return ["book_receipt", "edit_devotees"];
      case "Pujari":
        return ["pujari_consecrate"];
      default:
        return [];
    }
  };

  const handleCreateRoleChange = (role: SystemUser["role"]) => {
    setCreateRole(role);
    setCreateSelectedOpts(getDefaultOptionsForRole(role));
  };

  const handleEditRoleChange = (role: SystemUser["role"]) => {
    setEditRole(role);
    setEditSelectedOpts(getDefaultOptionsForRole(role));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim() || !createUsername.trim()) {
      alert("Name and username are required");
      return;
    }

    if (createUsername.trim().toLowerCase() === "godmode") {
      alert("System Protected: 'godmode' is reserved for developer service mode.");
      return;
    }

    if (
      users.some(
        (u) => u.username.toLowerCase() === createUsername.trim().toLowerCase(),
      )
    ) {
      alert("Username already exists. Choose a unique code.");
      return;
    }

    // Build the responsibilities string from selected checkboxes
    const chosenLabels = RESPONSIBILITY_OPTIONS.filter((opt) =>
      createSelectedOpts.includes(opt.id),
    ).map((opt) => opt.label);
    const resolvedResponsibilities =
      chosenLabels.length > 0
        ? chosenLabels.join(", ")
        : "General operational support.";

    onAddUser({
      name: createName.trim(),
      username: createUsername.trim().toLowerCase(),
      role: createRole,
      isActive: true,
      contactNumber: createContactNumber.trim() || undefined,
      responsibilities: resolvedResponsibilities,
      password: createPassword.trim() || "dssm2026",
    });

    setIsCreateModalOpen(false);
    setCreateName("");
    setCreateUsername("");
    setCreateContactNumber("");
    setCreatePassword("dssm2026");
    setCreateRole("Billing Clerk");
    setCreateSelectedOpts(["book_receipt", "edit_devotees"]);
  };

  const handleEditClick = (user: SystemUser) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditUsername(user.username);
    setEditRole(user.role);
    setEditContact(user.contactNumber || "");

    // Reverse build chosen option ids from existing string or match to role
    const currentRespStr = user.responsibilities || "";
    const activeIds = RESPONSIBILITY_OPTIONS.filter((opt) =>
      currentRespStr.includes(opt.label),
    ).map((opt) => opt.id);

    setEditSelectedOpts(
      activeIds.length > 0 ? activeIds : getDefaultOptionsForRole(user.role),
    );
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editName.trim() || !editUsername.trim()) {
      alert("Name and username are required");
      return;
    }

    if (editUsername.trim().toLowerCase() === "godmode") {
      alert("System Protected: 'godmode' is reserved for developer service mode.");
      return;
    }

    // Verify username is unique (excluding self)
    if (
      users.some(
        (u) =>
          u.id !== editingUser.id &&
          u.username.toLowerCase() === editUsername.trim().toLowerCase(),
      )
    ) {
      alert(
        "Trading username code already assigned to another staff member. Must be unique.",
      );
      return;
    }

    const chosenLabels = RESPONSIBILITY_OPTIONS.filter((opt) =>
      editSelectedOpts.includes(opt.id),
    ).map((opt) => opt.label);
    const resolvedResponsibilities =
      chosenLabels.length > 0
        ? chosenLabels.join(", ")
        : "General operational support.";

    onUpdateUser({
      ...editingUser,
      name: editName.trim(),
      username: editUsername.trim().toLowerCase(),
      role: editRole,
      contactNumber: editContact.trim() || undefined,
      responsibilities: resolvedResponsibilities,
    });

    setEditingUser(null);
  };

  const handleDeleteClick = (user: SystemUser) => {
    if (user.id === currentUser.id) {
      alert(
        "Security alert: You cannot delete your own active running session.",
      );
      return;
    }
    setUserToDelete(user);
  };

  return (
    <div className="space-y-6" id="users-tab">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display">
            {t("user.title")}
          </h2>
          <p className="text-xs text-slate-500">{t("user.subtitle")}</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#ff7a00] hover:bg-[#ea580c] border-none text-white font-bold text-xs p-2 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t("user.addBtn")}</span>
        </button>
      </div>

      {/* Grid of Users or Empty State */}
      {displayedUsers.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-md border border-dashed border-slate-300 rounded-2xl p-10 text-center shadow-sm max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl border border-amber-200 text-[#ff7a00] flex items-center justify-center mx-auto shadow-inner">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 font-display">
              No Desk Operators Registered
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-md mx-auto">
              You are currently logged in with master service privileges (<strong>godmode</strong>).
              Click below to register custom Administrators, Chief Cashiers, Billing Clerks, or Pujaris for this terminal.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-[#ff7a00] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] border-none text-white font-bold text-xs py-2.5 px-5 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Operator / Admin</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            * All user accounts and billing records are auto-saved in JSON on this system.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedUsers.map((user) => {
            const isCurrentUser = user.id === currentUser.id;
            return (
              <div
                key={user.id}
                className={`bg-white/90 backdrop-blur-md border-2 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all relative overflow-hidden group ${
                  isCurrentUser
                    ? "border-amber-500 shadow-md ring-1 ring-amber-500/25"
                    : "border-slate-200 hover:border-amber-400"
                }`}
              >
                {isCurrentUser && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#ff7a00] text-white text-[9px] font-bold uppercase py-0.5 px-2 rounded-full font-sans">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Active Login</span>
                  </div>
                )}

                <div className="space-y-3">
                  <span className="text-[9px] font-bold bg-white border border-slate-200 rounded px-2 py-0.5 text-amber-600 inline-block font-mono">
                    {user.id}
                  </span>

                  <div>
                    <h4 className="font-bold text-slate-800 text-base font-display">
                      {user.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      @{user.username}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Clearance Role block */}
                    <div className="flex justify-between items-center bg-white p-2.5 border border-slate-200 rounded-xl">
                      <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-amber-500" /> Role
                        Type:
                      </span>
                      <span className="font-extrabold text-amber-600 text-[11px] font-mono uppercase">
                        {user.role}
                      </span>
                    </div>

                    {/* Responsibilities list display */}
                    <div className="bg-white/50 p-2.5 border border-slate-200 rounded-xl text-[11px]">
                      <div className="text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-1">
                        Responsibilities & Powers:
                      </div>
                      <p className="text-slate-800 italic leading-relaxed font-sans">
                        {user.responsibilities ||
                          "General terminal operations, ticket bookings & daily counter registers."}
                      </p>
                    </div>

                    {user.contactNumber && (
                      <div className="flex justify-between items-center text-slate-500 text-[11px] pt-1">
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5 text-[#ff7a00]" />{" "}
                          Mobile:
                        </span>
                        <span className="font-mono text-amber-600 font-bold">
                          {user.contactNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CARD FOOTER OPERATIONS */}
                <div className="border-t border-slate-200 mt-4.5 pt-3 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                    {/* Switch user control */}
                    {isCurrentUser ? (
                      <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1 p-1 bg-emerald-50 border border-emerald-500/30 rounded-lg px-2">
                        <Check className="w-3 h-3 text-emerald-600 font-extrabold" />{" "}
                        Current Operator
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onSwitchUser(user);
                          alert(
                            `Operator shifted. Desk initialized for ${user.name} (${user.role}).`,
                          );
                        }}
                        className="p-1 px-2.5 bg-white/90 backdrop-blur-md hover:bg-[#ff7a00] border border-slate-200 hover:border-transparent font-bold text-slate-755 hover:text-white rounded-lg text-[10px] transition-all cursor-pointer"
                      >
                        Shift Terminal Login
                      </button>
                    )}

                    {/* Administrative edit suite */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      {isAdmin ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setUserToChangePassword(user);
                              setNewPassword(user.password || "dssm2026");
                              setPasswordSuccessMsg(null);
                            }}
                            title="Change operator security passcode PIN (Admin Only)"
                            className="p-1.5 bg-white/90 backdrop-blur-md hover:bg-emerald-600 border border-slate-200 hover:border-transparent rounded-lg text-emerald-600 hover:text-white transition-all cursor-pointer"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditClick(user)}
                            title="Edit Profile & Responsibilities"
                            className="p-1.5 bg-white/90 backdrop-blur-md hover:bg-[#ff7a00] border border-slate-200 hover:border-transparent rounded-lg text-[#ff7a00] hover:text-white transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(user)}
                            title="Revoke System Access"
                            className="p-1.5 bg-white/90 backdrop-blur-md hover:bg-rose-600 border border-slate-200 hover:border-transparent rounded-lg text-rose-500 hover:text-white transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        /* Read-Only visual shield alert for non-admins */
                        <span
                          title="Administrator privilege required to edit or delete roles & responsibilities"
                          className="flex items-center gap-1 text-[9px] text-slate-500 bg-white border border-slate-200 rounded-lg px-2 py-1 font-sans font-medium hover:text-amber-600 transition-colors"
                        >
                          <Lock className="w-3 h-3 text-slate-450" />
                          <span>Admin Only</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ACCESS CONSOLE ADVISORY */}
      <div className="p-4 rounded-2xl bg-amber-50/50 border border-[#ff7a00]/30/60 flex gap-3.5 text-xs leading-relaxed max-w-2xl">
        <Lock className="w-5.5 h-5.5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800 block text-[13px]">
            Credential Hierarchy Protocol Active:
          </span>
          <p className="text-slate-500 mt-1 text-[11px]">
            Roles, active permissions and custom designated responsibilities of
            all desks standard/pujari operators can be edited or permanently
            deleted exclusively by accounts with active{" "}
            <strong>Administrator</strong> tier clearance. Switch Operator login
            state to verify terminal permission flows.
          </p>
        </div>
      </div>

      {/* CREATE NEW OPERATOR USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 font-display text-sm">
                Register System Account
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 bg-white/90 backdrop-blur-md border border-slate-200 hover:bg-white hover:text-slate-800 rounded-lg text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Operator display name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="Sri/Smt Staff Name"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#ff7a00] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Username login code *
                  </label>
                  <input
                    type="text"
                    required
                    value={createUsername}
                    onChange={(e) => setCreateUsername(e.target.value)}
                    placeholder="e.g. prakash_clerk"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Operational clearance role *
                  </label>
                  <select
                    value={createRole}
                    onChange={(e) =>
                      handleCreateRoleChange(
                        e.target.value as SystemUser["role"],
                      )
                    }
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#ff7a00] font-sans"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Chief Cashier">Chief Cashier</option>
                    <option value="Billing Clerk">Billing Clerk</option>
                    <option value="Pujari">Pujari</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Contact mobile number
                  </label>
                  <input
                    type="tel"
                    value={createContactNumber}
                    onChange={(e) => setCreateContactNumber(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Security Passcode (PIN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="e.g. dssm2026"
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Designated Responsibilities & Powers *
                  </label>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin bg-white/90 backdrop-blur-md p-3 border border-slate-200 rounded-xl">
                    {RESPONSIBILITY_OPTIONS.map((opt) => {
                      const isChecked = createSelectedOpts.includes(opt.id);
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-[#ff7a00]/5 border border-[#ff7a00]/20"
                              : "bg-transparent border border-transparent hover:bg-white"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setCreateSelectedOpts((prev) =>
                                  prev.filter((id) => id !== opt.id),
                                );
                              } else {
                                setCreateSelectedOpts((prev) => [
                                  ...prev,
                                  opt.id,
                                ]);
                              }
                            }}
                            className="mt-0.5 rounded border-slate-200 bg-white/90 backdrop-blur-md text-[#ff7a00] focus:ring-[#ff7a00]"
                          />
                          <div>
                            <span className="block text-[11px] font-semibold text-slate-800">
                              {opt.label}
                            </span>
                            <span className="block text-[9px] text-slate-500 mt-0.5 leading-snug">
                              {opt.desc}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 hover:bg-white border border-transparent rounded-lg text-slate-500 font-bold cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ff7a00] hover:bg-[#ea580c] text-white border-none font-bold px-5 py-2 rounded-lg cursor-pointer text-xs"
                >
                  Grant Counter Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT OPERATOR USER & RESPONSIBILITIES MODAL (ADMIN ONLY) */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600">
                <Shield className="w-4 h-4" />
                <h3 className="font-bold text-slate-800 font-display text-sm">
                  Alter Operational Role & Duties
                </h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 bg-white/90 backdrop-blur-md border border-slate-200 hover:bg-white hover:text-slate-800 rounded-lg text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div className="p-3 bg-amber-50 border border-[#ff7a00]/30 rounded-xl flex gap-2.5 text-[11px] text-slate-500 leading-relaxed">
                <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  You are overriding roles for{" "}
                  <strong>{editingUser.name}</strong>. Modifying clearance
                  alters real-time ticket cancellation and ledger authorization.
                </span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Display Real Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#ff7a00] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Login Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Change Operational Role *
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) =>
                      handleEditRoleChange(e.target.value as SystemUser["role"])
                    }
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#ff7a00] font-sans"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Chief Cashier">Chief Cashier</option>
                    <option value="Billing Clerk">Billing Clerk</option>
                    <option value="Pujari">Pujari</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={editContact}
                    onChange={(e) => setEditContact(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#ff7a00]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Designated Responsibilities & Powers *
                  </label>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin bg-white/90 backdrop-blur-md p-3 border border-slate-200 rounded-xl">
                    {RESPONSIBILITY_OPTIONS.map((opt) => {
                      const isChecked = editSelectedOpts.includes(opt.id);
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-[#ff7a00]/5 border border-[#ff7a00]/20"
                              : "bg-transparent border border-transparent hover:bg-white"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setEditSelectedOpts((prev) =>
                                  prev.filter((id) => id !== opt.id),
                                );
                              } else {
                                setEditSelectedOpts((prev) => [
                                  ...prev,
                                  opt.id,
                                ]);
                              }
                            }}
                            className="mt-0.5 rounded border-slate-200 bg-white/90 backdrop-blur-md text-[#ff7a00] focus:ring-[#ff7a00]"
                          />
                          <div>
                            <span className="block text-[11px] font-semibold text-slate-800">
                              {opt.label}
                            </span>
                            <span className="block text-[9px] text-slate-500 mt-0.5 leading-snug">
                              {opt.desc}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 hover:bg-white border border-transparent rounded-lg text-slate-500 font-bold cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ff7a00] hover:bg-[#ea580c] text-white border-none font-bold px-5 py-2 rounded-lg cursor-pointer text-xs"
                >
                  Save Alterations
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM ACCESS REVOKE DIALOG */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-rose-50 border-b border-rose-100 px-5 py-4 flex items-center gap-2.5 text-rose-700">
              <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
              <h3 className="font-bold font-display text-sm text-rose-800">
                Revoke System Access?
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently revoke system counter
                access and cancel responsibilities for:
              </p>
              <div className="p-3 bg-white border border-slate-2000 rounded-xl">
                <div className="font-extrabold text-slate-800 text-sm font-sans">
                  {userToDelete.name}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  @{userToDelete.username} • {userToDelete.role}
                </div>
              </div>
              <p className="text-[11px] text-rose-600 font-medium">
                ⚠️ Warning: This operator status record will be deleted. They
                will not be able to log in or register billing receipt sheets.
              </p>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  className="px-4 py-2 hover:bg-white border border-transparent rounded-lg text-slate-500 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteUser(userToDelete.id);
                    setUserToDelete(null);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white border-none font-bold px-5 py-2 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Deletion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSCODE MODAL (ADMIN ONLY) */}
      {userToChangePassword && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#ff7a00]">
                <Key className="w-4 h-4 text-[#ff7a00]" />
                <h3 className="font-bold text-slate-800 font-display text-sm">
                  Set Terminal PIN / Passcode
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUserToChangePassword(null);
                  setNewPassword("");
                  setPasswordSuccessMsg(null);
                }}
                className="p-1.5 bg-white/90 backdrop-blur-md border border-slate-200 hover:bg-white hover:text-slate-800 rounded-lg text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-amber-50/50 border border-[#ea580c]/15 rounded-xl flex gap-2.5 text-[11px] text-slate-800">
                <Lock className="w-4.5 h-4.5 text-[#ff7a00] shrink-0 mt-0.5" />
                <span>
                  Setting a secure login PIN for{" "}
                  <strong>{userToChangePassword.name}</strong> (@
                  {userToChangePassword.username}).
                </span>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  New Security Passcode (PIN) *
                </label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="e.g. dssm2026 or secretPIN"
                  className="w-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-[#ff7a00]"
                />
                <p className="text-[9px] text-slate-500 mt-1">
                  This passcode replaces the user's previous login credentials.
                </p>
              </div>

              {passwordSuccessMsg && (
                <div className="p-2 bg-emerald-50 border border-emerald-500/30 rounded-xl text-center text-emerald-800 text-[11px] font-semibold animate-pulse">
                  ✨ {passwordSuccessMsg}
                </div>
              )}

              <div className="border-t border-slate-200 pt-4 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setUserToChangePassword(null);
                    setNewPassword("");
                    setPasswordSuccessMsg(null);
                  }}
                  className="px-4 py-2 hover:bg-white border border-transparent rounded-lg text-slate-500 font-bold cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newPassword.trim()) {
                      setPasswordSuccessMsg("Please enter a valid passcode");
                      return;
                    }
                    onUpdateUser({
                      ...userToChangePassword,
                      password: newPassword.trim(),
                    });
                    setPasswordSuccessMsg("Passcode altered successfully!");
                    setTimeout(() => {
                      setUserToChangePassword(null);
                      setNewPassword("");
                      setPasswordSuccessMsg(null);
                    }, 1200);
                  }}
                  className="bg-[#ff7a00] hover:bg-[#ea580c] text-white border-none font-bold px-5 py-2 rounded-lg cursor-pointer text-xs flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Credentials</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
