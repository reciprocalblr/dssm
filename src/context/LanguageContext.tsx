import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "kn";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand Info
    "brand.full": "DAKSHINA SHIRDI SRI SAI MANDIRA AND DATTAPEETA",
    "brand.loginLine1": "DAKSHINA SHIRDI SRI",
    "brand.loginLine2": "SAI MANDIRA AND DATTAPEETA",
    "brand.loginAddress1": "Magadi Main Road, near Kamadhenu Kshethra,",
    "brand.loginAddress2": "Kammasandra, Vaddarahalli, Bengaluru,",
    "brand.loginAddress3": "Karnataka 562162",
    "brand.line1": "DAKSHINA SHIRDI",
    "brand.line2": "SRI SAI MANDIRA AND",
    "brand.line3": "DATTAPEETA",
    "brand.address":
      "Magadi Main Road, near Kamadhenu Kshethra, Kammasandra, Vaddarahalli, Bengaluru, Karnataka 562162",
    "brand.addressDetailed":
      "Magadi Main Road, near Kamadhenu Kshethra, Kammasandra, Vaddarahalli, Bengaluru, Karnataka 562162",
    "brand.addressWelcomeLine1":
      "Magadi Main Road, near Kamadhenu Kshethra, Kammasandra,",
    "brand.addressWelcomeLine2": "Vaddarahalli, Bengaluru, Karnataka 562162",
    "brand.shortAddress": "VADDARAHALLI | BENGALURU",

    // Nav / Sidebar Category Headers
    "nav.catBillingDevotees": "Billing and Devotees",
    "nav.catKnowledge": "Knowledge",
    "nav.catOperations": "Operations",
    "nav.catAdminControls": "Admin Controls",

    // Nav / Sidebar
    "nav.dashboard": "Dashboard",
    "nav.devotees": "Devotee Directory",
    "nav.billing": "Billing Desk Counter",
    "nav.sevas": "Seva Catalog",
    "nav.expenses": "Expenses Vouchers",
    "nav.accounts": "Accounts Ledger",
    "nav.reports": "Audit Reports",
    "nav.users": "Desk Operators",
    "nav.settings": "Terminal Config",
    "nav.panchanga": "Panchanga",
    "nav.pos": "POS",
    "nav.loggedInAs": "Logged In As",
    "nav.disconnectTerminal": "Disconnect Terminal?",
    "nav.disconnectTerminalDesc":
      "Are you sure you want to log out of the active DSSM cash billing node? You will need operator clearance credentials to log back in.",
    "nav.yesLogout": "Yes, Logout",
    "nav.cancel": "Cancel",
    "header.node": "DSSM Billing Node #01",
    "header.operator": "Operator",
    "header.secureSpool": "SECURE SPOOL",

    // Login Page
    "login.footer":
      "Om Sai Ram • Dakshina Shiradi Sri Sai Mandira And Dattapeeta, Magadi Main Road, near Kamadhenu Kshethra, Kammasandra, Vaddarahalli, Bengaluru, Karnataka 562162",
    "login.verifyKey": "Terminal Key Verification",
    "login.keyPlaceholder": "Enter DSSM Master Access Key...",
    "login.verify": "Verify Connection",
    "login.unifiedLogin": "LOGIN AS ADMIN / STAFF",
    "login.unifiedSubtitle": "Enter your operator ID or administrative credentials",
    "login.staffLogin": "LOGIN AS BILLING STAFF",
    "login.adminLogin": "LOGIN AS ADMINISTRATOR",
    "login.usernameLabel": "Operator Username / Code",
    "login.passwordLabel": "Security Passcode (PIN)",
    "login.authenticate": "AUTHENTICATE & ENTER PORTAL",
    "login.quickOp": "Quick Test Operators",
    "login.quickOpDesc": "Click to pre-fill standard credentials:",
    "login.admin": "Administrator",
    "login.cashier": "Chief Cashier",
    "login.clerk": "Billing Clerk",
    "login.pujari": "Pujari",

    // Dashboard
    "dash.activeTerminal": "Sai Mandira Terminal Active",
    "dash.todayCash": "Today's Cash Collection",
    "dash.totalSevasBookedToday": "Total Sevas Booked Today",
    "dash.activeSevas": "Active Sevas Count",
    "dash.expenseTotal": "Expense Total Today",
    "dash.activeDevotees": "Registered Devotees",
    "dash.todaysIncome": "Today's Total Income",
    "dash.quickAccess": "Quick Access Operations Desk",
    "dash.newBooking": "New Seva Invoice (POS)",
    "dash.addDevotee": "Register New Devotee",
    "dash.addExpense": "Record Expense Voucher",
    "dash.viewLedger": "Check Accounts Ledger",
    "dash.realtimeLedger": "Today's Financial Ledger",
    "dash.cashInHand": "Cash In Hand",
    "dash.bankBalance": "Bank Remitted Balance",
    "dash.recentInvoices": "Recent Seva Invoices",
    "dash.invoiceId": "Invoice ID",
    "dash.devoteeName": "Devotee / Walk-in Name",
    "dash.mode": "Mode",
    "dash.amount": "Amount",
    "dash.time": "Time",
    "dash.status": "Status",
    "dash.active": "Active",
    "dash.cancelled": "Cancelled",
    "dash.receipt": "Receipt",
    "dash.noBillsToday": "No seva invoices registered today yet.",
    "dash.pujariDakshina": "Pujari Dakshina",
    "dash.grandTotal": "Grand Total",

    // Devotees
    "dev.title": "Temple Devotee Registry",
    "dev.subtitle":
      "Manage permanent devotee database profiles for direct billing lookup, gothra verification, and special notifications.",
    "dev.search": "Search by Name or Phone number...",
    "dev.addBtn": "Register New Devotee Profile",
    "dev.phone": "Phone Number",
    "dev.gothra": "Gothra",
    "dev.nakshatra": "Nakshatra",
    "dev.rashi": "Rashi",
    "dev.address": "Residential Address",
    "dev.email": "Email ID (Optional)",
    "dev.familyDesc": "Family Members Associated (Add name & relationship):",
    "dev.addFamilyMember": "+ Add Family Member",
    "dev.remarks": "Special Desk Remarks / Notes",
    "dev.save": "Save Devotee Profile",
    "dev.edit": "Edit Profile",
    "dev.delete": "Delete Profile",
    "dev.noDevotees": "No devotees found matching the description.",
    "dev.deleteConfirm":
      "Are you sure you want to delete this devotee profile? This action is irreversible.",
    "dev.billingHistory": "Seva Reservation History",

    // Billing
    "bill.title": "Seva Billing Counter POS",
    "bill.subtitle":
      "Generate dynamic invoices, select multiple sevas, calculate Pujari Dakshina distributions, and print receipts.",
    "bill.walkin": "Direct Walk-in Devotee (No registration)",
    "bill.registered": "Search Registered Devotee Directory",
    "bill.selectDevotee": "Select a devotee pattern...",
    "bill.searchPlaceholder": "Type name or phone to filter...",
    "bill.devoteeDetails": "Devotee Details For Seva Archana Sankalpa",
    "bill.fullName": "Full Name",
    "bill.walkinLabel": "WALK-IN DEVOTEE REGISTRATION",
    "bill.gothraLabel": "Gothra / Lineage",
    "bill.nakshatraLabel": "Nakshatra / Moon Star",
    "bill.rashiLabel": "Rashi / Zodiac Sign",
    "bill.cartTitle": "Seva Cart Scheduler",
    "bill.selectSeva": "Select Seva to Add to Receipt",
    "bill.addCart": "Add to Cart",
    "bill.qty": "Qty",
    "bill.pujariDakshinaLabel": "Pujari Dakshina per item",
    "bill.paymentLabel": "Payment Settlement Details",
    "bill.paymentMode": "Payment Mode",
    "bill.ref": "UPI Ref / Bank Transfer Txn ID",
    "bill.generate": "Generate Seva Invoice & Print Receipt",
    "bill.subtotal": "Ticket Subtotal",
    "bill.clearanceCode": "Required Desk Clearance",
    "bill.cash": "Cash",
    "bill.upi": "UPI (Google Pay, PhonePe, Paytm)",
    "bill.card": "Card (POS Machine)",
    "bill.bankTransfer": "Direct Bank Transfer",
    "bill.receiptModalTitle":
      "Dakshina Shiradi Sri Sai Mandira And Dattapeeta Receipt",
    "bill.receiptNo": "Receipt No",
    "bill.date": "Date & Time",
    "bill.blessing":
      "May the divine blessings of Shirdi Sai Baba always be with you.",
    "bill.printedBy": "Printed by Terminal Operator",
    "bill.printBtn": "Print Receipt (Thermal 80mm / A4 Layout)",
    "bill.closeBtn": "Close Receipt",

    // Sevas
    "seva.title": "Seva Catalog Management",
    "seva.subtitle":
      "Configure pooja types, prices, Pujari Dakshina schedules, and category folders for mandira offerings.",
    "seva.addBtn": "Configure New Seva Category",
    "seva.nameLabel": "Seva Offering Name",
    "seva.codeLabel": "Desk Quick Code (e.g., ARCH01)",
    "seva.priceLabel": "Ticket Price (₹)",
    "seva.category": "Category Offering Folder",
    "seva.description": "Description or Prasada details",
    "seva.save": "Save Seva Configuration",
    "seva.status": "Status",
    "seva.actions": "Actions",
    "seva.pujariDakshinaLabel": "Pujari Dakshina (₹)",

    // Expenses
    "exp.title": "Expenses Vouchers",
    "exp.subtitle":
      "Record and claim mandira utility, salaries, daily grocery purchases (Annadana), and maintenance charges.",
    "exp.addBtn": "Record New Expense Voucher",
    "exp.amount": "Amount (₹)",
    "exp.recordedBy": "Recorded By Staff name",
    "exp.category": "Expense Category Folder",
    "exp.paymentMode": "Payment Mode Used",
    "exp.descLabel": "Expense Justification & Description",
    "exp.save": "Record & Post Expense Voucher",
    "exp.noExpenses": "No expense vouchers logged for this session yet.",
    "exp.cashInHandWarn":
      "Expense will reduce active Temple Cash-In-Hand pool by equivalent amount.",

    // Accounts
    "acc.title": "Accounts reconciliations & Ledger",
    "acc.subtitle":
      "Track cash in hand, bank deposits, separate Annadana funds, and perform physical vault-to-bank ledger remittances.",
    "acc.liquidCap": "Liquid Assets & Balances",
    "acc.cashInHand": "Temple Cash-In-Hand Pool",
    "acc.bankBal": "Remitted Bank Account Balance",
    "acc.annadana": "Annadana Dedicated Fund",
    "acc.totalCollection": "Gross Billing Revenue",
    "acc.remitTitle": "Remit Vault Cash to Bank Account",
    "acc.remitAmt": "Amount to Remit (₹)",
    "acc.remitDesc": "Remittance Description (e.g., State Bank Depot 09-06)",
    "acc.remitBtn": "Commit Cash Remittance to Bank",
    "acc.history": "Historic Cash Vault-to-Bank Remittances Log",
    "acc.noRemittances":
      "No vaults bank remittances logged for the active timeline.",

    // Reports
    "rep.title": "Reconciliation & Audit Reports",
    "rep.subtitle":
      "Perform daily closing statements, audit cashier desks, and generate accounts breakdowns for review boards.",
    "rep.exportCsv": "Export Excel/CSV Sheet",
    "rep.exportPdf": "Export PDF Report",
    "rep.selectRange": "Select Summary Calendar Bounds",
    "rep.startDate": "Start Date",
    "rep.endDate": "End Date",
    "rep.summary": "Ledger Audit Summary",
    "rep.grossIn": "Gross Income Generated",
    "rep.totalOut": "Total Expenses Audited",
    "rep.netCash": "Net Cash Generated",
    "rep.catIn": "Revenue Classified by Category",
    "rep.catOut": "Expenses Classified by Category",

    // Users
    "user.title": "Desk Operators & Clerks",
    "user.subtitle":
      "Manage operator clearance profiles, register new cashiers, and verify active session timelines.",
    "user.addBtn": "Register New Desk Operator",
    "user.name": "Operator Display Name",
    "user.username": "Username / Login Code",
    "user.role": "Assigned Access Role",
    "user.contact": "Contact Phone",
    "user.save": "Register Operator Profile",
    "user.status": "Terminal State",

    // Settings
    "set.title": "Terminal Configuration & Settings",
    "set.subtitle":
      "Modify print layout styles, receipt title headers, UPI merchant configurations, and automatic blessing lines.",
    "set.templeName": "Primary Temple Institution Name",
    "set.tagline": "Sub-Header Display Line",
    "set.addr1": "Address Line 1",
    "set.addr2": "Address Line 2",
    "set.city": "City / Zone",
    "set.pin": "Postal PIN Code",
    "set.contact": "Contact Support Number",
    "set.upiId": "UPI Merchant ID (for static QR generation)",
    "set.upiName": "UPI Display Name",
    "set.receiptPrefix": "Receipt Spool Invoice Prefix",
    "set.paperSize": "Physical Thermal Printer Paper Width",
    "set.blessing": "Enable Blessings line on Receipt footer",
    "set.blessingMsg": "Blessings Footer Text",
    "set.saveBtn": "Save Master Terminal Configurations",
    "set.savedSuccess": "Terminal configurations updated successfully!",
  },
  kn: {
    // Brand Info
    "brand.full": "ದಕ್ಷಿಣ ಶಿರಡಿ ಶ್ರೀ ಸಾಯಿ ಮಂದಿರ ಮತ್ತು ದತ್ತಪೀಠ",
    "brand.loginLine1": "ದಕ್ಷಿಣ ಶಿರಡಿ ಶ್ರೀ",
    "brand.loginLine2": "ಸಾಯಿ ಮಂದಿರ ಮತ್ತು ದತ್ತಪೀಠ",
    "brand.loginAddress1": "ಮಾಗಡಿ ಮುಖ್ಯ ರಸ್ತೆ, ಕಾಮಧೇನು ಕ್ಷೇತ್ರ ಹತ್ತಿರ,",
    "brand.loginAddress2": "ಕಮ್ಮಸಂದ್ರ, ವಡ್ಡರಹಳ್ಳಿ, ಬೆಂಗಳೂರು,",
    "brand.loginAddress3": "ಕರ್ನಾಟಕ 562162",
    "brand.line1": "ದಕ್ಷಿಣ ಶಿರಡಿ",
    "brand.line2": "ಶ್ರೀ ಸಾಯಿ ಮಂದಿರ ಮತ್ತು",
    "brand.line3": "ದತ್ತಪೀಠ",
    "brand.address":
      "ಮಾಗಡಿ ಮುಖ್ಯ ರಸ್ತೆ, ಕಾಮಧೇನು ಕ್ಷೇತ್ರ ಹತ್ತಿರ, ಕಮ್ಮಸಂದ್ರ, ವಡ್ಡರಹಳ್ಳಿ, ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ 562162",
    "brand.addressDetailed":
      "ಮಾಗಡಿ ಮುಖ್ಯ ರಸ್ತೆ, ಕಾಮಧೇನು ಕ್ಷೇತ್ರ ಹತ್ತಿರ, ಕಮ್ಮಸಂದ್ರ, ವಡ್ಡರಹಳ್ಳಿ, ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ 562162",
    "brand.addressWelcomeLine1":
      "ಮಾಗಡಿ ಮುಖ್ಯ ರಸ್ತೆ, ಕಾಮಧೇನು ಕ್ಷೇತ್ರ ಹತ್ತಿರ, ಕಮ್ಮಸಂದ್ರ,",
    "brand.addressWelcomeLine2": "ವಡ್ಡರಹಳ್ಳಿ, ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ 562162",
    "brand.shortAddress": "ವಡ್ಡರಹಳ್ಳಿ | ಬೆಂಗಳೂರು",

    // Nav / Sidebar Category Headers
    "nav.catBillingDevotees": "ಬಿಲ್ಲಿಂಗ್ ಮತ್ತು ಭಕ್ತರು",
    "nav.catKnowledge": "ಜ್ಞಾನ",
    "nav.catOperations": "ಕಾರ್ಯಾಚರಣೆಗಳು",
    "nav.catAdminControls": "ಆಡಳಿತ ನಿಯಂತ್ರಣಗಳು",

    // Nav / Sidebar
    "nav.dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "nav.devotees": "ಭಕ್ತರ ವಿವರಗಳು",
    "nav.billing": "ಜಮಾ ಮಾಡು / ಕೌಂಟರ್",
    "nav.sevas": "ಸೇವಾ ಪಟ್ಟಿ",
    "nav.expenses": "ಖರ್ಚುಗಳ ವಿವರ",
    "nav.accounts": "ಲೆಕ್ಕ ಪುಸ್ತಕ",
    "nav.reports": "ವರದಿ ಮತ್ತು ಆಡಿಟ್",
    "nav.users": "ಡೆಸ್ಕ್ ಆಪರೇಟರ್ಸ್",
    "nav.settings": "ಸಿಸ್ಟಂ ಕಾನ್ಫಿಗರೇಶನ್",
    "nav.panchanga": "ಪಂಚಾಂಗ",
    "nav.pos": "ಬಿಲ್ಲಿಂಗ್",
    "nav.loggedInAs": "ಲಾಗ್ ಇನ್ ಆಗಿರುವವರು",
    "nav.disconnectTerminal": "ಟರ್ಮಿನಲ್ ಡಿಸ್ಕನೆಕ್ಟ್ ಮಾಡಬೇಕೆ?",
    "nav.disconnectTerminalDesc":
      "ಸಕ್ರಿಯ ಡಿಎಸ್ಎಸ್ಎಮ್ ನಗದು ಬಿಲ್ಲಿಂಗ್ ನೋಡ್‌ನಿಂದ ನೀವು ಲಾಗ್ ಔಟ್ ಮಾಡಲು ಬಯಸುವಿರಾ? ಲಾಗ್ ಇನ್ ಮಾಡಲು ಆಪರೇಟರ್ ಅನುಮತಿ ರುಜುವಾತುಗಳು ಬೇಕಾಗುತ್ತವೆ.",
    "nav.yesLogout": "ಹೌದು, ಲಾಗ್ ಔಟ್ ಮಾಡಿ",
    "nav.cancel": "ರದ್ದು",
    "header.node": "ಡಿಎಸ್ಎಸ್ಎಸ್ಎಮ್ ಬಿಲ್ಲಿಂಗ್ ನೋಡ್ #01",
    "header.operator": "ಆಪರೇಟರ್",
    "header.secureSpool": "ಸುರಕ್ಷಿತ ಸ್ಪೂಲ್",

    // Login Page
    "login.footer":
      "ಓಂ ಸಾಯಿ ರಾಮ್ • ದಕ್ಷಿಣ ಶಿರಡಿ ಶ್ರೀ ಸಾಯಿ ಮಂದಿರ ಮತ್ತು ದತ್ತಪೀಠ, ಮಾಗಡಿ ಮುಖ್ಯ ರಸ್ತೆ, ಕಾಮಧೇನು ಕ್ಷೇತ್ರ ಹತ್ತಿರ, ಕಮ್ಮಸಂದ್ರ, ವಡ್ಡರಹಳ್ಳಿ, ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ 562162",
    "login.verifyKey": "ಟರ್ಮಿನಲ್ ಕೀ ಪರಿಶೀಲನೆ",
    "login.keyPlaceholder": "ಡಿಎಸ್ಎಸ್ಎಮ್ ಮಾಸ್ಟರ್ ಕೀ ನಮೂದಿಸಿ...",
    "login.verify": "ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ",
    "login.unifiedLogin": "ಅಡ್ಮಿನ್ / ಸಿಬ್ಬಂದಿ ಲಾಗಿನ್",
    "login.unifiedSubtitle": "ಕೌಂಟರ್ ಆಪರೇಟರ್ ಅಥವಾ ಅಡ್ಮಿನ್ ವಿವರಗಳೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಿ",
    "login.staffLogin": "ಬಿಲ್ಲಿಂಗ್ ಸಿಬ್ಬಂದಿಯಾಗಿ ಪ್ರವೇಶಿಸಿ",
    "login.adminLogin": "ಅಡ್ಮಿನಿಸ್ಟ್ರೇಟರ್ ಆಗಿ ಪ್ರವೇಶಿಸಿ",
    "login.usernameLabel": "ಆಪರೇಟರ್ ಐಡಿ / ಬಳಕೆದಾರ ಹೆಸರು",
    "login.passwordLabel": "ಸುರಕ್ಷಿತ ಪಾಸ್‌ಕೋಡ್ (ಪಿನ್)",
    "login.authenticate": "ದೃಢೀಕರಿಸಿ ಮತ್ತು ಪ್ರವೇಶಿಸಿ",
    "login.quickOp": "ಪರೀಕ್ಷಾರ್ಥ ಆಪರೇಟರ್ ವಿವರಗಳು",
    "login.quickOpDesc": "ರುಜುವಾತು ತುಂಬಲು ಕ್ಲಿಕ್ ಮಾಡಿ:",
    "login.admin": "ಅಡ್ಮಿನಿಸ್ಟ್ರೇಟರ್",
    "login.cashier": "ಮುಖ್ಯ ಕ್ಯಾಷಿಯರ್",
    "login.clerk": "ಬಿಲ್ಲಿಂಗ್ ಕ್ಲರ್ಕ್",
    "login.pujari": "ಪೂಜಾರಿ",

    // Dashboard
    "dash.activeTerminal": "ಮಂದಿರದ ಟರ್ಮಿನಲ್ ಸಕ್ರಿಯವಾಗಿದೆ",
    "dash.todayCash": "ಇಂದಿನ ಜಮಾ ಸಂಗ್ರಹಣೆ",
    "dash.totalSevasBookedToday": "ಇಂದು ಬುಕ್ ಆದ ಒಟ್ಟು ಸೇವೆಗಳು",
    "dash.activeSevas": "ಇಂದಿನ ಒಟ್ಟು ಸೇವೆಗಳು",
    "dash.expenseTotal": "ಇಂದಿನ ಒಟ್ಟು ಖರ್ಚು",
    "dash.activeDevotees": "ನೋಂದಾಯಿತ ಭಕ್ತರು",
    "dash.todaysIncome": "ಇಂದಿನ ಒಟ್ಟು ಆದಾಯ",
    "dash.quickAccess": "ತ್ವರಿತ ಕಾರ್ಯಾಚರಣೆ ಮೆನು",
    "dash.newBooking": "ಹೊಸ ಸೇವಾ ರಸೀದಿ (POS)",
    "dash.addDevotee": "ಹೊಸ ಭಕ್ತರ ನೋಂದಣಿ",
    "dash.addExpense": "ಖರ್ಚುಗಳ ವೋಚರ್ ನಮೂದಿಸಿ",
    "dash.viewLedger": "ಲೆಕ್ಕ ಪುಸ್ತಕ ಪರಿಶೀಲಿಸಿ",
    "dash.realtimeLedger": "ಇಂದಿನ ಹಣಕಾಸಿನ ರಿಪೋರ್ಟ್",
    "dash.cashInHand": "ಕೈಯಲ್ಲಿರುವ ನಗದು",
    "dash.bankBalance": "ಬ್ಯಾಂಕಿಗೆ ಜಮಾ ಆದ ಮೊತ್ತ",
    "dash.recentInvoices": "ಇತ್ತೀಚಿನ ಸೇವಾ ರಸೀದಿಗಳು",
    "dash.invoiceId": "ರಸೀದಿ ಸಂಖ್ಯೆ",
    "dash.devoteeName": "ಭಕ್ತರ ಹೆಸರು",
    "dash.mode": "ವಿಧಾನ",
    "dash.amount": "ಮೊತ್ತ",
    "dash.time": "ಸಮಯ",
    "dash.status": "ಸ್ಥಿತಿ",
    "dash.active": "ಸಕ್ರಿಯ",
    "dash.cancelled": "ರದ್ದು ಮಾಡಲಾಗಿದೆ",
    "dash.receipt": "ರಸೀದಿ",
    "dash.noBillsToday": "ಇಂದು ಇದುವರೆಗೆ ಯಾವುದೇ ರಸೀದಿಗಳನ್ನು ಬಿಡುಗಡೆ ಮಾಡಲಾಗಿಲ್ಲ.",
    "dash.pujariDakshina": "ಪೂಜಾರಿ ದಕ್ಷಿಣೆ",
    "dash.grandTotal": "ಒಟ್ಟು ಮೊತ್ತ",

    // Devotees
    "dev.title": "ಮಂದಿರದ ಭಕ್ತರ ನೋಂದಣಿ ಪುಸ್ತಕ",
    "dev.subtitle":
      "ತ್ವರಿತ ಬಿಲ್ಲಿಂಗ್ ವೀಕ್ಷಣೆ, ಗೋತ್ರ ಪರಿಶೀಲನೆ ಮತ್ತು ವಿಶೇಷ ಅಧಿಸೂಚನೆಗಳಿಗಾಗಿ ಖಾಯಂ ಭಕ್ತರ ಪ್ರೊಫೈಲ್ ಡೇಟಾಬೇಸ್ ಅನ್ನು ನಿರ್ವಹಿಸಿ.",
    "dev.search": "ಹೆಸರು ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮೂಲಕ ಹುಡುಕಿ...",
    "dev.addBtn": "ಹೊಸ ಭಕ್ತರ ಪ್ರೊಫೈಲ್ ನೋಂದಾಯಿಸಿ",
    "dev.phone": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    "dev.gothra": "ಗೋತ್ರ",
    "dev.nakshatra": "ನಕ್ಷತ್ರ",
    "dev.rashi": "ರಾಶಿ",
    "dev.address": "ಮನೆ ವಿಳಾಸ",
    "dev.email": "ಇಮೇಲ್ ವಿಳಾಸ (ಐಚ್ಛಿಕ)",
    "dev.familyDesc": "ಸಂಬಂಧಿತ ಕುಟುಂಬ ಸದಸ್ಯರು (ಹೆಸರು ಮತ್ತು ಸಂಬಂಧ ಸೇರಿಸಿ):",
    "dev.addFamilyMember": "+ ಕುಟುಂಬ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ",
    "dev.remarks": "ವಿಶೇಷ ಟಿಪ್ಪಣಿಗಳು / ಷರಾ",
    "dev.save": "ಭಕ್ತರ ವಿವರ ಉಳಿಸಿ",
    "dev.edit": "ವಿವರ ತಿದ್ದುಪಡಿ",
    "dev.delete": "ವಿವರ ಅಳಿಸಿ",
    "dev.noDevotees": "ಯಾವುದೇ ಭಕ್ತರ ವಿವರಗಳು ಇಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ.",
    "dev.deleteConfirm":
      "ಈ ಭಕ್ತರ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂಪಡೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ.",
    "dev.billingHistory": "ಸೇವಾ ಜಮಾಗಳ ಇತಿಹಾಸ",

    // Billing
    "bill.title": "ಸೇವಾ ಬಿಲ್ಲಿಂಗ್ ಕೌಂಟರ್ (POS)",
    "bill.subtitle":
      "ರಸೀದಿಗಳನ್ನು ಸೃಷ್ಟಿಸಿ, ವಿವಿಧ ಸೇವೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ, ಪೂಜಾರಿ ದಕ್ಷಿಣೆ ವಿಭಾಗಿಸಿ ಮತ್ತು ಪ್ರಿಂಟ್ ಮಾಡಿ.",
    "bill.walkin": "ನೋಂದಣಿ ಇಲ್ಲದ ಭಕ್ತರು (ವಾಕ್-ಇನ್)",
    "bill.registered": "ನೋಂದಾಯಿತ ಭಕ್ತರ ಪಟ್ಟಿಯಲ್ಲಿ ಹುಡುಕಿ",
    "bill.selectDevotee": "ನೋಂದಾಯಿತ ಭಕ್ತರನ್ನು ಆಯ್ಕೆಮಾಡಿ...",
    "bill.searchPlaceholder": "ಹುಡುಕಲು ಹೆಸರು ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಹಾಕಿ...",
    "bill.devoteeDetails": "ಸೇವಾ ಅರ್ಚನೆ ಸಂಕಲ್ಪಕ್ಕಾಗಿ ಭಕ್ತರ ವಿವರಗಳು",
    "bill.fullName": "ಪೂರ್ಣ ಹೆಸರು",
    "bill.walkinLabel": "ವಾಕ್-ಇನ್ ಭಕ್ತರ ನೋಂದಣಿ (WALK-IN DEVOTEE REGISTRATION)",
    "bill.gothraLabel": "ಗೋತ್ರ",
    "bill.nakshatraLabel": "ನಕ್ಷತ್ರ",
    "bill.rashiLabel": "ರಾಶಿ",
    "bill.cartTitle": "ಆಯ್ಕೆಯಾದ ಸೇವೆಗಳ ಪಟ್ಟಿ",
    "bill.selectSeva": "ಸೇವೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಹಾಗೂ ಬುಟ್ಟಿಗೆ ಸೇರಿಸಿ",
    "bill.addCart": "ಬುಟ್ಟಿಗೆ ಸೇರಿಸಿ",
    "bill.qty": "ಪ್ರಮಾಣ",
    "bill.pujariDakshinaLabel": "ಪ್ರತಿ ಪೂಜಾರಿ ದಕ್ಷಿಣೆ",
    "bill.paymentLabel": "ಹಣ ಪಾವತಿ ವಿವರಗಳು",
    "bill.paymentMode": "ಪಾವತಿ ವಿಧಾನ",
    "bill.ref": "ಯುಪಿಐ (UPI) ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ",
    "bill.generate": "ಸೇವಾ ರಸೀದಿ ಸೃಷ್ಟಿಸಿ ಮತ್ತು ಮುದ್ರಿಸಿ",
    "bill.subtotal": "ಟಿಕೆಟ್ ಉಪಮೊತ್ತ",
    "bill.clearanceCode": "ಕೌಂಟರ್ ಅನುಮತಿ ಕೋಡ್ ಅಗತ್ಯವಿದೆ",
    "bill.cash": "ನಗದು",
    "bill.upi": "UPI (ಗೂಗಲ್ ಪೇ, ಫೋನ್ ಪೇ, ಪೇಟಿಎಂ)",
    "bill.card": "ಕಾರ್ಡ್ (POS ಯಂತ್ರ)",
    "bill.bankTransfer": "ನೇರ ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ",
    "bill.receiptModalTitle":
      "ದಕ್ಷಿಣ ಶಿರಾಡಿ ಶ್ರೀ ಸಾಯಿ ಮಂದಿರ ಹಾಗು ದತ್ತಪೀಠದ ರಸೀದಿ",
    "bill.receiptNo": "ರಸೀದಿ ಸಂ.",
    "bill.date": "ದಿನಾಂಕ ಮತ್ತು ಸಮಯ",
    "bill.blessing": "ಶಿರಡಿ ಸಾಯಿ ಬಾಬಾರವರ ದಿವ್ಯ ಅನುಗ್ರಹವು ಸದಾ ನಿಮ್ಮ ಮೇಲಿರಲಿ.",
    "bill.printedBy": "ಮುದ್ರಿಸಿದ ಆಪರೇಟರ್",
    "bill.printBtn": "ರಸೀದಿ ಪ್ರಿಂಟ್ ಮಾಡಿ (ಥರ್ಮಲ್ 80mm / A4 ಲೇಔಟ್)",
    "bill.closeBtn": "ರಸೀದಿ ಪೇಜ್ ಮುಚ್ಚಿ",

    // Sevas
    "seva.title": "ಸೇವಾ ಕ್ಯಾಟಲಾಗ್ ನಿರ್ವಹಣೆ",
    "seva.subtitle":
      "ಪೂಜಾ ಪ್ರಕಾರಗಳು, ದರಗಳು, ಪೂಜಾರಿ ದಕ್ಷಿಣೆ ವಿಭಾಗಗಳು ಮತ್ತು ವರ್ಗಾವಣೆಗಳನ್ನು ಇಲ್ಲಿ ಕಾನ್ಫಿಗರ್ ಮಾಡಿ.",
    "seva.addBtn": "ಹೊಸ ಸೇವೆ ಕಾನ್ಫಿಗರ್ ಮಾಡಿ",
    "seva.nameLabel": "ಸೇವೆಯ ಹೆಸರು",
    "seva.codeLabel": "ಸೇವಾ ಕೋಡ್ (ಉದಾ: ARCH01)",
    "seva.priceLabel": "ಟಿಕೆಟ್ ಬೆಲೆ (₹)",
    "seva.category": "ಸೇವಾ ವಿಭಾಗ",
    "seva.description": "ವಿವರಣೆ ಅಥವಾ ಪ್ರಸಾದದ ಮಾಹಿತಿ",
    "seva.save": "ಸೇವಾ ಕಾನ್ಫಿಗರೇಶನ್ ಉಳಿಸಿ",
    "seva.status": "ಸ್ಥಿತಿ",
    "seva.actions": "ಕ್ರಮಗಳು",
    "seva.pujariDakshinaLabel": "ಪೂಜಾರಿ ದಕ್ಷಿಣೆ (₹)",

    // Expenses
    "exp.title": "ಖರ್ಚುಗಳ ವೋಚರ್ ಹಂಚಿಕೆ",
    "exp.subtitle":
      "ಮಂದಿರದ ದಿನನಿತ್ಯದ ಸಾಮಗ್ರಿಗಳು, ಸಂಬಳ, ದಿನಸಿ ಸಾಮಗ್ರಿ (ಅನ್ನದಾನ) ಮತ್ತು ನಿರ್ವಹಣಾ ವೆಚ್ಚಗಳನ್ನು ದಾಖಲಿಸಿ.",
    "exp.addBtn": "ಹೊಸ ಖರ್ಚಿನ ವೋಚರ್ ದಾಖಲಿಸಿ",
    "exp.amount": "ಮೊತ್ತ (₹)",
    "exp.recordedBy": "ದಾಖಲಿಸಿದ ಸಿಬ್ಬಂದಿ ಹೆಸರು",
    "exp.category": "ವೆಚ್ಚದ ವರ್ಗ",
    "exp.paymentMode": "ಪಾವತಿಸಿದ ವಿಧಾನ",
    "exp.descLabel": "ಖರ್ಚಿನ ಸಮರ್ಥನೆ ಮತ್ತು ವಿವರಣೆ",
    "exp.save": "ಖರ್ಚಿನ ವೋಚರ್ ದಾಖಲಿಸಿ",
    "exp.noExpenses": "ಈ ಅವಧಿಯಲ್ಲಿ ಯಾವುದೇ ಖರ್ಚಿನ ವೋಚರ್‌ಗಳನ್ನು ದಾಖಲಿಸಲಾಗಿಲ್ಲ.",
    "exp.cashInHandWarn":
      "ಖರ್ಚಿನಿಂದ ಮಂದಿರದ ಸಕ್ರಿಯ ನಗದು ಬ್ಯಾಲೆನ್ಸ್ ಪೂಲ್ ಅಷ್ಟೇ ಮೊತ್ತಕ್ಕೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ.",

    // Accounts
    "acc.title": "ಖಾತೆಗಳ ಸಮನ್ವಯ ಮತ್ತು ಲೆಕ್ಕ",
    "acc.subtitle":
      "ಕೈಯಲ್ಲಿರುವ ನಗದು, ಬ್ಯಾಂಕ್ ಠೇವಣಿಗಳು, ಪ್ರತ್ಯೇಕ ಅನ್ನದಾನ ನಿಧಿ ಮತ್ತು ಭೌತಿಕ ಬ್ಯಾಂಕ್ ಸಲ್ಲಿಕೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
    "acc.liquidCap": "ದ್ರವ ಆಸ್ತಿಗಳು ಮತ್ತು ಬ್ಯಾಲೆನ್ಸ್‌ಗಳು",
    "acc.cashInHand": "ಮಂದಿರದ ಸಕ್ರಿಯ ಕೈ-ಹಣ ಪೂಲ್",
    "acc.bankBal": "ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮಾ ಮಾಡಲಾದ ಬ್ಯಾಲೆನ್ಸ್",
    "acc.annadana": "ಅನ್ನದಾನ ಸಮರ್ಪಿತ ನಿಧಿ",
    "acc.totalCollection": "ಒಟ್ಟು ಬಿಲ್ಲಿಂಗ್ ಆದಾಯ",
    "acc.remitTitle": "ನಿಗದಿತ ನಗದನ್ನು ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮಾ ಮಾಡಿ",
    "acc.remitAmt": "ಜಮಾ ಮಾಡಬೇಕಾದ ಮೊತ್ತ (₹)",
    "acc.remitDesc": "ಜಮೆಯ ವಿವರಣೆ (ಉದಾ: ಎಸ್‌ಬಿಐ ಬ್ಯಾಂಕ್ ಡೆಪೋ 09-06)",
    "acc.remitBtn": "ನಗದು ಬ್ಯಾಂಕ್ ಜಮೆಗೆ ಕಳುಹಿಸಿ",
    "acc.history": "ಹಣಕಾಸು ಬ್ಯಾಂಕ್ ಜಮಾ ಇತಿಹಾಸ",
    "acc.noRemittances": "ಯಾವುದೇ ಬ್ಯಾಂಕ್ ಠೇವಣಿಗಳ ಇತಿಹಾಸ ಲಭ್ಯವಿಲ್ಲ.",

    // Reports
    "rep.title": "ಲೆಕ್ಕ ಸಮನ್ವಯ ಮತ್ತು ಆಡಿಟ್ ವರದಿಗಳು",
    "rep.subtitle":
      "ದಿನದ ಮುಕ್ತಾಯದ ಹೇಳಿಕೆಗಳನ್ನು ಪೂರೈಸಿ, ಕ್ಯಾಷಿಯರ್ ಡೆಸ್ಕ್ ಆಡಿಟ್ ನಡೆಸಿ ಮತ್ತು ಪರಿಶೀಲನಾ ಮಂಡಳಿಗೆ ಪ್ರತಿಯನ್ನು ಲಭ್ಯಗೊಳಿಸಿ.",
    "rep.exportCsv": "ಎಕ್ಸೆಲ್/CSV ಫೈಲ್ ರಫ್ತು ಮಾಡಿ",
    "rep.exportPdf": "PDF ವರದಿ ರಫ್ತು ಮಾಡಿ",
    "rep.selectRange": "ವರದಿಯ ಕ್ಯಾಲೆಂಡರ್ ದಿನಾಂಕಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    "rep.startDate": "ಪ್ರಾರಂಭದ ದಿನಾಂಕ",
    "rep.endDate": "ಅಂತಿಮ ದಿನಾಂಕ",
    "rep.summary": "ಲೆಕ್ಕಪತ್ರದ ಆಡಿಟ್ ಸಾರಾಂಶ",
    "rep.grossIn": "ಒಟ್ಟು ಗಳಿಸಿದ ಆದಾಯ",
    "rep.totalOut": "ಒಟ್ಟು ಆಡಿಟ್ ಆದ ಖರ್ಚುಗಳು",
    "rep.netCash": "ಒಟ್ಟು ಉಳಿದ ನಿವ್ವಳ ಲಾಭ",
    "rep.catIn": "ವರ್ಗದ ಆಧಾರದ ಆದಾಯದ ವಿವರ",
    "rep.catOut": "ವರ್ಗದ ಆಧಾರದ ವೆಚ್ಚದ ವಿವರ",

    // Users
    "user.title": "ಡೆಸ್ಕ್ ಆಪರೇಟರ್ ಹಾಗೂ ಸಿಬ್ಬಂದಿಗಳು",
    "user.subtitle":
      "ಆಪರೇಟರ್ ಅನುಮತಿ ಪಡೆಯುವ ಪ್ರೊಫೈಲ್ ನಿರ್ವಹಿಸಿ, ಹೊಸ ಕ್ಯಾಷಿಯರ್ ನೋಂದಾಯಿಸಿ ಮತ್ತು ಕ್ರಿಯಾ ಪ್ರಕ್ರಿಯೆ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
    "user.addBtn": "ಹೊಸ ಆಪರೇಟರ್ ಸೇರಿಸಿ",
    "user.name": "ಆಪರೇಟರ್ ಪ್ರದರ್ಶನ ಹೆಸರು",
    "user.username": "ಬಳಕೆದಾರ ಹೆಸರು / ಲಾಗಿನ್ ಕೋಡ್",
    "user.role": "ನಿಯೋಜಿತ ಪಾತ್ರ / ಜವಾಬ್ದಾರಿ",
    "user.contact": "ಸಂಪರ್ಕ ಮೊಬೈಲ್",
    "user.save": "ಆಪರೇಟರ್ ಪ್ರೊಫೈಲ್ ನೋಂದಾಯಿಸಿ",
    "user.status": "ಸ್ಥಿತಿ",

    // Settings
    "set.title": "ಟರ್ಮಿನಲ್ ಸಂರಚನೆಗಳು ಮತ್ತು ಸೆಟ್ಟಿಂಗ್ಸ್",
    "set.subtitle":
      "ಪ್ರಿಂಟ್ ಲೇಔಟ್ ವಿನ್ಯಾಸಗಳು, ರಶೀದಿ ಶೀರ್ಷಿಕೆ ಹೆಡರ್‌ಗಳು, ಯುಪಿಐ ಮರ್ಚೆಂಟ್ ವಿವರಗಳು ಮತ್ತು ಸ್ವಯಂಚಾಲಿತ ಆಶೀರ್ವಾದ ಸಾಲುಗಳನ್ನು ಬದಲಾಯಿಸಿ.",
    "set.templeName": "ಪ್ರಾಥಮಿಕ ಮಂದಿರದ ಸಾಂಸ್ಥಿಕ ಹೆಸರು",
    "set.tagline": "ಉಪ-ಶೀರ್ಷಿಕೆ ಸಾಲು",
    "set.addr1": "ವಿಳಾಸ ಸಾಲು 1",
    "set.addr2": "ವಿಳಾಸ ಸಾಲು 2",
    "set.city": "ನಗರ / ವಲಯ",
    "set.pin": "ಅಂಚೆ ಪಿನ್ ಕೋಡ್",
    "set.contact": "ಸಹಾಯವಾಣಿ ಸಂಪರ್ಕ ಸಂಖ್ಯೆ",
    "set.upiId": "UPI ಮರ್ಚೆಂಟ್ ಐಡಿ (ಸ್ಥಿರ QR ಕೋಡ್ ಮಾಡಲು)",
    "set.upiName": "UPI ಪ್ರದರ್ಶನ ಹೆಸರು",
    "set.receiptPrefix": "ರಸೀದಿ ಸ್ಪೂಲ್ ಸಂಖ್ಯೆಯ ಪ್ರಿಫಿಕ್ಸ್",
    "set.paperSize": "ಭೌತಿಕ ಥರ್ಮಲ್ ಪ್ರಿಂಟರ್ ಪೇಪರ್ ಅಗಲ",
    "set.blessing": "ರಸೀದಿ ಕೆಳಗೆ ಆಶೀರ್ವಾದದ ಸಾಲನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ",
    "set.blessingMsg": "ಆಶೀರ್ವಾದದ ಸಾಲಿನ ಬರಹ",
    "set.saveBtn": "ಟರ್ಮಿನಲ್ ಸಂರಚನೆಗಳನ್ನು ಉಳಿಸಿ",
    "set.savedSuccess": "ಟರ್ಮಿನಲ್ ಸಂರಚನೆಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!",
  },
};

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("dsssm_language");
    return (saved === "kn" ? "kn" : "en") as Language;
  });

  useEffect(() => {
    localStorage.setItem("dsssm_language", language);
    if (language === "kn") {
      document.documentElement.setAttribute("lang", "kn");
    } else {
      document.documentElement.setAttribute("lang", "en");
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
