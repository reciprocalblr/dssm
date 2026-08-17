/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Printer, Receipt, Sparkles } from "lucide-react";
import { Bill, TempleSettings } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface ReceiptModalProps {
  bill: Bill | null;
  settings: TempleSettings;
  onClose: () => void;
}

// Helper to convert numbers to Indian English Words
function numberToWords(num: number): string {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (num === 0) return "Zero Rupees Only";

  const g = (n: number): string => {
    if (n < 20) return a[n];
    const digit = n % 10;
    return b[Math.floor(n / 10)] + (digit ? " " + a[digit] : "");
  };

  const lakh = Math.floor(num / 100000);
  const temp1 = num % 100000;
  const thousand = Math.floor(temp1 / 1000);
  const temp2 = temp1 % 1000;
  const hundred = Math.floor(temp2 / 100);
  const remaining = temp2 % 100;

  let str = "";
  if (lakh > 0) {
    str += g(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    str += g(thousand) + " Thousand ";
  }
  if (hundred > 0) {
    str += g(hundred) + " Hundred ";
  }
  if (remaining > 0) {
    if (str !== "") str += "and ";
    str += g(remaining) + " ";
  }
  return str.trim() + " Rupees Only";
}

export default function ReceiptModal({
  bill,
  settings,
  onClose,
}: ReceiptModalProps) {
  const { t, language } = useLanguage();

  if (!bill) return null;

  // Static logo url from the GDrive attachment configured in DssmLogo
  const gdriveId = "1eXQYps6myew2Ss9jAKEip4oilDMAlRRz";
  const logoUrl = `https://lh3.googleusercontent.com/d/${gdriveId}`;

  // Localized dictionaries for print rendering
  const isKn = language === "kn";
  const labels = {
    templeName: isKn
      ? "ದಕ್ಷಿಣ ಶಿರಡಿ ಶ್ರೀ ಸಾಯಿ ಮಂದಿರ ಮತ್ತು ದತ್ತಪೀಠ"
      : "DAKSHINA SHIRDI SRI SAI MANDIRA AND DATTAPEETA",
    address: isKn
      ? "ಮಾಗಡಿ ಮುಖ್ಯ ರಸ್ತೆ, ಕಾಮಧೇನು ಕ್ಷೇತ್ರ ಹತ್ತಿರ, ಕಮ್ಮಸಂದ್ರ, ವಡ್ಡರಹಳ್ಳಿ, ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ 562162"
      : "Magadi Main Road, near Kamadhenu Kshethra, Kammasandra, Vaddarahalli, Bengaluru, Karnataka 562162",
    officeCopy: isKn ? "ಕಚೇರಿ ಪ್ರತಿ (OFFICE COPY)" : "OFFICE COPY",
    devoteeCopy: isKn ? "ಭಕ್ತರ ಪ್ರತಿ (DEVOTEE COPY)" : "DEVOTEE COPY",
    receiptNo: isKn ? "ರಸೀದಿ ಸಂಖ್ಯೆ" : "RECEIPT NO",
    date: isKn ? "ದಿನಾಂಕ ಮತ್ತು ಸಮಯ" : "DATE & TIME",
    operator: isKn ? "ಆಪರೇಟರ್" : "OPERATOR",
    paymentMode: isKn ? "ಪಾವತಿ ವಿಧಾನ" : "PAYMENT MODE",
    devoteeName: isKn ? "ಭಕ್ತರ ಹೆಸರು" : "DEVOTEE NAME",
    phone: isKn ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ" : "MOBILE NO",
    gothra: isKn ? "ಗೋತ್ರ" : "GOTHRA",
    nakshatra: isKn ? "ನಕ್ಷತ್ರ" : "NAKSHATRA",
    rashi: isKn ? "ರಾಶಿ" : "RASHI",
    slNo: isKn ? "ಕ್ರ.ಸಂ" : "SL.NO",
    particulars: isKn ? "ಸೇವಾ ವಿವರಗಳು" : "SEVA PARTICULARS / POOJA OFFERINGS",
    qty: isKn ? "ಪ್ರಮಾಣ" : "QTY",
    amount: isKn ? "ಮೊತ್ತ" : "AMOUNT",
    pujariDakshina: isKn ? "ಪೂಜಾರಿ ದಕ್ಷಿಣೆ" : "PUJARI DAKSHINA",
    subtotal: isKn ? "ಸೇವಾ ಶುಲ್ಕ" : "SEVA CHARGES",
    grandTotal: isKn ? "ಒಟ್ಟು ಪಾವತಿ" : "GRAND TOTAL",
    inWords: isKn ? "ಅಕ್ಷರಗಳಲ್ಲಿ ಒಟ್ಟು ಮೊತ್ತ" : "AMOUNT IN WORDS",
    blessing: isKn
      ? "ಶಿರಡಿ ಸಾಯಿ ಬಾಬಾರವರ ದಿವ್ಯ ಅನುಗ್ರಹವು ಸದಾ ನಿಮ್ಮ ಮೇಲಿರಲಿ."
      : "May the Divine Grace of Shirdi Sai Baba bring Peace, Prosperity, and Happiness to your entire family.",
    babaBless: "OM SAI RAM",
    authSig: isKn ? "ಅಧಿಕೃತ ಸಹಿ" : "AUTHORIZED SIGNATORY",
    pujariSig: isKn ? "ಪೂಜಾರಿ ಸಹಿ" : "PUJARI / RECEIVER SIGNATURE",
    printBtnText: isKn
      ? "ಭಕ್ತರ ರಸೀದಿ ಪ್ರಿಂಟ್ ಮಾಡಿ (Print Devotee Copy)"
      : "Print Devotee Copy (A4)",
    closeBtn: isKn ? "ಮುಚ್ಚಿ" : "Close Preview",
  };

  // Trigger standard page printing which hides main screen layout via .no-print
  const handlePrint = () => {
    window.print();
  };

  const roundedTotal = Math.round(bill.grandTotal);
  const wordsRepresentation = numberToWords(roundedTotal);

  return (
    <>
      {/* 1. SCREEN INTERACTIVE PREVIEW PANEL (HIDDEN ON PRINT MODE) */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 no-print">
        <div className="bg-white border border-[#301614] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
          {/* Modal Header */}
          <div className="bg-[#faf8f5] border-b border-slate-200 px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#ff7a00]/10 rounded-xl border border-[#ff7a00]/20">
                <Receipt className="w-5 h-5 text-[#ff7a00]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base font-display flex items-center gap-1.5 leading-snug">
                  <span>{t("bill.receiptModalTitle")}</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium font-sans">
                  {language === "kn"
                    ? "ಭಕ್ತರ ರಸೀದಿ ಪ್ರಿವ್ಯೂ ಮತ್ತು ಪ್ರಿಂಟ್ ಲೇಔಟ್"
                    : "Devotee Receipt Preview & Print Spooler"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white border border-slate-200 hover:bg-[#ff7a00]/10 rounded-xl text-slate-500 hover:text-slate-800 cursor-pointer transition-all focus:outline-hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Single Copy Preview Screen */}
          <div className="p-6 overflow-y-auto max-h-[68vh] bg-slate-50 flex flex-col gap-6 select-none border-b border-slate-200">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center gap-2.5 text-[11px] text-amber-900 leading-normal font-sans">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <p>
                {language === "kn"
                  ? "ಈ ರಸೀದಿಯನ್ನು ಅರ್ಧ ಪುಟದ A4 ಕಾಗದದಲ್ಲಿ ಮುದ್ರಿಸಲು ಸೂಕ್ತವಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ."
                  : "This template is optimized to fit perfectly on exactly half of an A4 page, leaving the other half clean."}
              </p>
            </div>

            <div className="space-y-4">
              {/* DEVOTEE COPY PREVIEW CONTAINER */}
              <div className="bg-white/90 backdrop-blur-md text-slate-800 rounded-xl p-5 border border-stone-200 shadow-md relative">
                <span className="absolute top-2 right-2 px-2.5 py-0.5 text-[9px] font-bold bg-[#ff7a00]/10 border border-[#ff7a00]/30 rounded text-[#ff7a00] uppercase">
                  {labels.devoteeCopy}
                </span>

                {/* Header Info */}
                <div className="flex items-start gap-3 border-b border-stone-200 pb-3 mb-3">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-11 h-11 object-contain shrink-0"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#ff7a00] font-sans flex items-center gap-1.5 leading-none mb-1">
                      <span>{labels.babaBless}</span>
                    </h4>
                    <h3 className="text-sm font-black tracking-normal text-slate-800 leading-tight">
                      {labels.templeName}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-semibold uppercase leading-none mt-1">
                      {labels.address}
                    </p>
                  </div>
                </div>

                {/* Meta information layout (1-column full-width) */}
                <div className="space-y-2 text-[11px] border-b border-stone-200 pb-3 mb-3">
                  <div className="flex border-b border-stone-100 pb-1.5 justify-between">
                    <span className="text-stone-500 font-medium">
                      {labels.devoteeName}:
                    </span>
                    <strong className="text-slate-800 font-black uppercase text-right">
                      {bill.devoteeName || "Walk-In Guest"}
                    </strong>
                  </div>
                  {bill.phone && (
                    <div className="flex border-b border-stone-100 pb-1.5 justify-between">
                      <span className="text-stone-500 font-medium">
                        {labels.phone}:
                      </span>
                      <strong className="text-slate-800 font-bold text-right">
                        {bill.phone}
                      </strong>
                    </div>
                  )}
                  <div className="flex border-b border-stone-100 pb-1.5 justify-between">
                    <span className="text-stone-500 font-medium">
                      {labels.gothra} / {labels.nakshatra} / {labels.rashi}:
                    </span>
                    <strong className="text-slate-800 font-extrabold uppercase text-right">
                      {bill.gothra || "NITYA GOTHRA"}{" "}
                      {bill.nakshatra ? `/ ${bill.nakshatra}` : ""}{" "}
                      {bill.rashi ? `/ ${bill.rashi}` : ""}
                    </strong>
                  </div>
                  <div className="flex border-b border-stone-100 pb-1.5 justify-between">
                    <span className="text-stone-500 font-medium">
                      {labels.receiptNo}:
                    </span>
                    <strong className="text-slate-800 font-mono font-bold text-right">
                      {bill.id}
                    </strong>
                  </div>
                  <div className="flex border-b border-stone-100 pb-1.5 justify-between">
                    <span className="text-stone-500 font-medium">
                      {labels.date}:
                    </span>
                    <span className="text-stone-800 font-semibold text-right">
                      {new Date(bill.createdAt).toLocaleString("en-IN", {
                        hour12: true,
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">
                      {labels.paymentMode} | {labels.operator}:
                    </span>
                    <strong className="text-slate-800 font-bold uppercase text-right text-xs">
                      {bill.paymentMode}
                      {bill.paymentReference
                        ? ` (${bill.paymentReference})`
                        : ""}{" "}
                      &nbsp;|&nbsp; {bill.createdByUser}
                    </strong>
                  </div>
                </div>

                {/* Items Summary Table */}
                <table className="w-full text-[11px] border-collapse mb-3">
                  <thead>
                    <tr className="bg-stone-50 border-t border-b border-stone-200 font-bold text-stone-700 text-[9.5px]">
                      <th className="py-1 text-center w-8">{labels.slNo}</th>
                      <th className="py-1 text-left">{labels.particulars}</th>
                      <th className="py-1 text-center w-12">{labels.qty}</th>
                      <th className="py-1 text-right w-20">{labels.amount}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {bill.items.map((item, idx) => (
                      <tr key={idx} className="font-medium text-slate-800">
                        <td className="py-1.5 text-center font-bold text-stone-400">
                          {idx + 1}
                        </td>
                        <td className="py-1.5 font-bold">
                          {item.sevaName.toUpperCase()}
                        </td>
                        <td className="py-1.5 text-center font-bold">
                          {item.count}
                        </td>
                        <td className="py-1.5 text-right font-mono font-bold">
                          ₹{item.price * item.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals math layout display */}
                <div className="flex justify-between items-start pt-2 border-t border-stone-200">
                  <div className="max-w-[55%] text-[9px] text-stone-500 leading-relaxed font-sans mt-0.5">
                    <strong className="block text-[8px] text-stone-400 uppercase tracking-widest">
                      {labels.inWords}
                    </strong>
                    <span className="font-bold text-stone-800 italic">
                      {wordsRepresentation}
                    </span>
                  </div>
                  <div className="text-right text-[10.5px] w-[40%]">
                    <div className="flex justify-between font-black text-xs border-t border-stone-200 border-dashed pt-1.5 text-slate-800 leading-none">
                      <span>{labels.grandTotal}:</span>
                      <span className="font-mono">₹{bill.grandTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Blessings Note */}
                <div className="border-t border-dashed border-stone-200 mt-4.5 pt-3 mb-2.5 text-center text-[10px] text-stone-600 font-sans italic font-medium leading-relaxed">
                  {labels.blessing}
                </div>

                {/* Signatures columns */}
                <div className="flex justify-end mt-5 text-[9px] font-bold text-stone-500 px-1 pt-1.5">
                  <div className="text-right">
                    <div className="w-36 border-b border-stone-300 mb-1 opacity-60 ml-auto"></div>
                    <span>{labels.authSig}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Controls Footer */}
          <div className="p-4 bg-[#faf8f5] flex gap-3.5 shrink-0 border-t border-slate-200">
            <button
              onClick={handlePrint}
              className="flex-1 bg-[#ff7a00] hover:bg-[#ea580c] active:bg-[#d94e00] text-white font-bold text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-950/20 transition-all border-none"
            >
              <Printer className="w-5 h-5 shrink-0" />
              <span>{labels.printBtnText}</span>
            </button>

            <button
              onClick={onClose}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 px-5 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all active:scale-98 shrink-0"
            >
              {labels.closeBtn}
            </button>
          </div>
        </div>
      </div>

      {/* 2. VECTOR PRISTINE A4 PORTRAIT PRINT-SPOOL DEVOTEE RECEIPT (HIDDEN ON SCREEN, ACTIVE ON PRINT) */}
      <div
        className="print-only mx-auto"
        style={{
          width: "185mm",
          boxSizing: "border-box",
          padding: "8mm 4mm 0 4mm",
          margin: "0 auto",
        }}
      >
        <div
          className="bg-white text-black p-4 flex flex-col justify-between"
          style={{
            minHeight: "135mm",
            boxSizing: "border-box",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          <div>
            {/* Header section */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2.5 mb-3">
              <div className="w-[12%]">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-14 w-auto object-contain"
                />
              </div>
              <div className="text-center flex-1 mx-2">
                <div className="inline-block border border-black font-bold uppercase tracking-widest text-[9px] px-3.5 py-0.5 mb-1.5 bg-stone-50">
                  {labels.babaBless}
                </div>
                <h1 className="text-[17px] font-black tracking-normal text-black uppercase leading-tight m-0">
                  {labels.templeName}
                </h1>
                <p className="text-[10px] font-bold text-stone-700 m-0 mt-0.5">
                  {labels.address}
                </p>
              </div>
              <div className="w-[18%] text-right">
                <div className="inline-block border border-black font-extrabold uppercase tracking-wide text-[9px] px-2 py-1.5 bg-stone-50 text-center leading-none">
                  {labels.devoteeCopy}
                </div>
              </div>
            </div>

            {/* Meta Information Container (Double Column Layout for Print Density) */}
            <div className="grid grid-cols-2 gap-y-1.5 text-[11px] border-b border-stone-200 pb-2.5 mb-2.5">
              <div className="flex justify-between border-r border-stone-200 pr-4">
                <span className="text-stone-500 font-semibold">
                  {labels.devoteeName}:
                </span>
                <strong className="text-black font-extrabold uppercase">
                  {bill.devoteeName || "GUEST DEVOTEE"}
                </strong>
              </div>
              <div className="flex justify-between pl-4">
                <span className="text-stone-500 font-semibold">
                  {labels.receiptNo}:
                </span>
                <strong className="text-black font-mono font-black">
                  {bill.id}
                </strong>
              </div>

              <div className="flex justify-between border-r border-stone-200 pr-4">
                <span className="text-stone-500 font-semibold">
                  {labels.phone || "Phone"}:
                </span>
                <strong className="text-black font-bold">
                  {bill.phone || "N/A"}
                </strong>
              </div>
              <div className="flex justify-between pl-4">
                <span className="text-stone-500 font-semibold">
                  {labels.date}:
                </span>
                <strong className="text-black font-bold">
                  {new Date(bill.createdAt).toLocaleString("en-IN", {
                    hour12: true,
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
              </div>

              <div className="flex justify-between border-r border-stone-200 pr-4">
                <span className="text-stone-500 font-semibold">
                  {labels.gothra} / {labels.nakshatra} /{" "}
                  {labels.rashi || "Rashi"}:
                </span>
                <strong className="text-black font-extrabold uppercase">
                  {bill.gothra || "NITYA GOTHRA"}
                  {bill.nakshatra ? ` / ${bill.nakshatra}` : ""}
                  {bill.rashi ? ` / ${bill.rashi}` : ""}
                </strong>
              </div>
              <div className="flex justify-between pl-4">
                <span className="text-stone-500 font-semibold">
                  {labels.paymentMode} | {labels.operator}:
                </span>
                <strong className="text-black font-extrabold uppercase">
                  {bill.paymentMode}
                  {bill.paymentReference
                    ? ` (${bill.paymentReference})`
                    : ""} | {bill.createdByUser}
                </strong>
              </div>
            </div>

            {/* Printed Item list table */}
            <table className="w-full text-[11px] border-collapse mb-3.5">
              <thead>
                <tr className="bg-stone-50 border-t border-b border-black font-bold text-black text-[9.5px]">
                  <th className="py-1 text-center w-8">{labels.slNo}</th>
                  <th className="py-1 text-left">{labels.particulars}</th>
                  <th className="py-1 text-center w-12">{labels.qty}</th>
                  <th className="py-1 text-right w-24">{labels.amount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {bill.items.map((item, idx) => (
                  <tr key={idx} className="font-semibold text-black">
                    <td className="py-1 text-center text-stone-400">
                      {idx + 1}
                    </td>
                    <td className="py-1">{item.sevaName.toUpperCase()}</td>
                    <td className="py-1 text-center">{item.count}</td>
                    <td className="py-1 text-right font-mono font-extrabold">
                      ₹{item.price * item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table of totals & blessing and signature columns */}
          <div>
            <div className="flex justify-between items-start pt-2 border-t border-black mb-3">
              <div className="max-w-[55%] text-[9.5px] text-stone-600 leading-normal">
                <strong className="block text-[8px] text-stone-400 uppercase tracking-widest">
                  {labels.inWords}
                </strong>
                <span className="font-bold text-black italic">
                  {wordsRepresentation}
                </span>
              </div>
              <div className="text-right text-[11px] w-[40%]">
                <div className="flex justify-between font-black text-xs border-t border-black border-dashed pt-1.5 text-black">
                  <span>{labels.grandTotal}:</span>
                  <span className="font-mono font-extrabold">
                    ₹{bill.grandTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* Blessings Footer */}
            <div className="border-t border-dashed border-stone-300 py-2 mb-3 text-center text-[10px] text-stone-800 italic font-medium leading-relaxed">
              {labels.blessing}
            </div>

            {/* Authorized signature rule */}
            <div className="flex justify-end mt-10 text-[9px] font-bold text-stone-600 px-1">
              <div className="text-right">
                <div className="w-36 border-b border-black mb-1 opacity-50 ml-auto"></div>
                <span className="uppercase">{labels.authSig}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
