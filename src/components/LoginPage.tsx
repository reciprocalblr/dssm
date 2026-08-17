/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShieldCheck, Eye, EyeOff, Lock, User } from "lucide-react";
import { motion } from "motion/react";
import { SystemUser } from "../types";
import DssmLogo from "./DssmLogo";
import { useLanguage } from "../context/LanguageContext";

interface LoginPageProps {
  users: SystemUser[];
  onLoginSuccess: (user: SystemUser) => void;
}

export default function LoginPage({ users, onLoginSuccess }: LoginPageProps) {
  const { language, setLanguage, t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const enteredUsername = username.trim().toLowerCase();
    const enteredPassword = password.trim();

    if (!enteredUsername) {
      setErrorMsg(
        language === "kn"
          ? "ದಯವಿಟ್ಟು ಬಳಕೆದಾರ ಹೆಸರು ನಮೂದಿಸಿ."
          : "Please enter your username.",
      );
      return;
    }

    // 1. Secret Developer Superuser Authentication ("godmode" / "god123")
    // Hidden root clearance for service and maintenance
    if (enteredUsername === "godmode") {
      if (enteredPassword === "god123") {
        const godmodeSuperUser: SystemUser = {
          id: "USR-DEV-00",
          username: "godmode",
          name: "Developer & Service Superuser",
          role: "Administrator",
          isActive: true,
          contactNumber: "9999999999",
          responsibilities:
            "Master Root Maintenance, Service Superuser & Full System Clearance",
          password: "god123",
        };
        onLoginSuccess(godmodeSuperUser);
        return;
      } else {
        setErrorMsg(
          language === "kn"
            ? "ತಪ್ಪಾದ ಭದ್ರತಾ ಪಾಸ್‌ಕೋಡ್. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ."
            : "Invalid security password. Please check your credentials.",
        );
        return;
      }
    }

    // 2. Standard Portal Operator / Administrator Lookup
    const matchingUser = users.find(
      (u) => u.username.toLowerCase() === enteredUsername,
    );

    if (!matchingUser) {
      setErrorMsg(
        language === "kn"
          ? "ಆಪರೇಟರ್ ಐಡಿ ಅಥವಾ ಬಳಕೆದಾರ ಹೆಸರು ಕಂಡುಬಂದಿಲ್ಲ."
          : "Operator username not found in DSSM terminal registry.",
      );
      return;
    }

    if (!matchingUser.isActive) {
      setErrorMsg(
        language === "kn"
          ? "ಈ ಆಪರೇಟರ್ ಖಾತೆಯನ್ನು ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ. ಅಡ್ಮಿನ್‌ರನ್ನು ಸಂಪರ್ಕಿಸಿ."
          : "This operator account has been marked inactive. Contact administrator.",
      );
      return;
    }

    // Validate the operator passcode (default fallback: "dssm2026")
    const expectedPassword = matchingUser.password || "dssm2026";
    if (enteredPassword !== expectedPassword) {
      setErrorMsg(
        language === "kn"
          ? "ತಪ್ಪಾದ ಭದ್ರತಾ ಪಾಸ್‌ಕೋಡ್ (ಪಿನ್). ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ."
          : "Invalid security passcode (PIN). Please verify your password.",
      );
      return;
    }

    onLoginSuccess(matchingUser);
  };

  return (
    <div
      className="min-h-screen relative flex flex-col justify-center items-center p-4 overflow-hidden select-none animate-in fade-in duration-300"
      style={{
        backgroundColor: "#f7f8fa",
        backgroundImage: `
          radial-gradient(circle at center, transparent 15%, #ffffff 90%),
          repeating-radial-gradient(circle at center, rgba(0, 0, 0, 0.03) 0px, rgba(0, 0, 0, 0.03) 1px, transparent 1.5px, transparent 32px),
          repeating-radial-gradient(circle at center, rgba(255, 122, 0, 0.04) 0px, rgba(255, 122, 0, 0.04) 1px, transparent 2px, transparent 96px)
        `,
      }}
      id="login-layout-panel"
    >
      {/* Floating Language Switcher Pill & Version Tag at Extreme Top Right */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-50 flex flex-col items-end gap-1 select-none">
        <div className="flex items-center bg-white/95 border border-slate-200/90 rounded-full p-1 shadow-sm relative w-[160px] h-[36px]">
          <motion.div
            className="absolute inset-y-1 bg-gradient-to-r from-[#ff7a00] to-[#ea580c] rounded-full shadow-xs"
            initial={false}
            animate={{
              left: language === "en" ? "4px" : "calc(50% + 2px)",
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
              mass: 0.5,
            }}
            style={{
              width: "calc(50% - 6px)",
            }}
          />
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`relative z-10 w-1/2 h-full rounded-full text-[11px] font-black tracking-wider transition-colors cursor-pointer uppercase text-center flex items-center justify-center ${
              language === "en"
                ? "text-white drop-shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ENGLISH
          </button>
          <button
            type="button"
            onClick={() => setLanguage("kn")}
            className={`relative z-10 w-1/2 h-full rounded-full text-[11px] font-black tracking-wider transition-colors cursor-pointer uppercase text-center flex items-center justify-center ${
              language === "kn"
                ? "text-white drop-shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ಕನ್ನಡ
          </button>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 pr-2 tracking-wider">
          Ver : 16.08
        </span>
      </div>

      {/* Decorative center ambient bloom & rotating spiritual mandala rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
        {/* Outer Sacred Geometry Ring - Slow Clockwise Rotation */}
        <motion.div
          className="absolute w-[600px] h-[600px] sm:w-[780px] sm:h-[780px] md:w-[960px] md:h-[960px] text-[#ff7a00]/12"
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <circle
              cx="250"
              cy="250"
              r="240"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4, 10"
            />
            <circle
              cx="250"
              cy="250"
              r="220"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="1, 14"
            />
            <circle
              cx="250"
              cy="250"
              r="200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
            />
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i * 10 * Math.PI) / 180;
              const x = 250 + 220 * Math.cos(angle);
              const y = 250 + 220 * Math.sin(angle);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill="currentColor"
                  opacity="0.7"
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Counter-Clockwise Rotating Lotus Petals Mandala */}
        <motion.div
          className="absolute w-[460px] h-[460px] sm:w-[600px] sm:h-[600px] text-amber-600/15"
          animate={{ rotate: -360 }}
          transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle
              cx="200"
              cy="200"
              r="190"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="8, 8"
            />
            <circle
              cx="200"
              cy="200"
              r="160"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2, 8"
            />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = i * 30;
              return (
                <path
                  key={i}
                  d="M200,200 Q220,130 200,60 Q180,130 200,200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.4"
                  transform={`rotate(${angle} 200 200)`}
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Inner Pulsing Sacred Ray Ring */}
        <motion.div
          className="absolute w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] text-amber-500/12"
          animate={{ rotate: 360, scale: [0.98, 1.04, 0.98] }}
          transition={{
            rotate: { duration: 110, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <circle
              cx="150"
              cy="150"
              r="140"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="12, 12"
            />
            <circle
              cx="150"
              cy="150"
              r="110"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.3"
            />
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 15 * Math.PI) / 180;
              const x1 = 150 + 110 * Math.cos(angle);
              const y1 = 150 + 110 * Math.sin(angle);
              const x2 = 150 + 140 * Math.cos(angle);
              const y2 = 150 + 140 * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.5"
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Soft Golden Spiritual Halo Bloom */}
        <motion.div
          className="absolute w-[450px] h-[450px] bg-gradient-to-r from-amber-400/10 via-[#ff7a00]/10 to-orange-500/5 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Column container */}
      <div className="w-full max-w-lg flex flex-col items-center justify-center relative z-10 space-y-6 mx-auto">
        {/* Vector Logo */}
        <div className="transform hover:scale-105 transition-all duration-300 flex items-center justify-center drop-shadow-[0_10px_20px_rgba(255,122,0,0.3)]">
          <DssmLogo
            size="lg"
            className="w-[180px] h-[135px]"
            showSubtitle={false}
          />
        </div>

        {/* Title Group with stabilized layout box */}
        <div className="text-center space-y-1 mt-1 px-4 w-full flex flex-col items-center mx-auto select-none">
          <h1 className="h-[68px] sm:h-[80px] md:h-[92px] text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-slate-900 tracking-wider font-display text-center max-w-full leading-tight mx-auto flex flex-col items-center justify-center transition-all duration-300 drop-shadow-xs">
            <span className="block whitespace-nowrap transition-opacity duration-300">
              {t("brand.loginLine1")}
            </span>
            <span className="block whitespace-nowrap transition-opacity duration-300">
              {t("brand.loginLine2")}
            </span>
          </h1>
          <div className="flex items-center justify-center gap-3.5 pt-2 mb-1 mx-auto shrink-0 h-[24px]">
            <div className="h-[2px] w-10 sm:w-14 bg-gradient-to-r from-transparent to-[#ff7a00]/80" />
            <span className="text-[11px] md:text-[12px] font-black tracking-[0.25em] text-[#ff8008] uppercase font-sans text-center whitespace-nowrap">
              Billing & Management System
            </span>
            <div className="h-[2px] w-10 sm:w-14 bg-gradient-to-l from-transparent to-[#ff7a00]/80" />
          </div>
        </div>

        {/* Single Tab Header: LOGIN as ADMIN/STAFF */}
        <div className="w-full max-w-md flex items-center justify-center">
          <div className="bg-gradient-to-r from-[#ff7a00] to-[#ea580c] text-white px-6 py-2.5 rounded-2xl shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 border border-amber-300/30">
            <ShieldCheck className="w-5 h-5 text-white shrink-0" />
            <span className="text-xs sm:text-sm font-black tracking-widest uppercase font-display whitespace-nowrap">
              {language === "kn"
                ? "LOGIN AS ADMIN / STAFF (ಅಡ್ಮಿನ್ / ಸಿಬ್ಬಂದಿ)"
                : "LOGIN AS ADMIN / STAFF"}
            </span>
          </div>
        </div>

        {/* Dynamic Card Form */}
        <div className="w-full max-w-md bg-white/95 border border-slate-200 rounded-3xl p-7 shadow-[0_20px_60px_-10px_rgba(255,122,0,0.25)] border-b-[8px] border-b-[#ff7a00] border-r-[4px] border-r-slate-200 backdrop-blur-md z-20 hover:-translate-y-0.5 transition-all duration-300">
          <div className="text-center pb-4 border-b border-slate-200/60 mb-5 flex flex-col items-center justify-center">
            <h3 className="font-extrabold text-slate-800 tracking-wider text-sm font-display uppercase transition-opacity duration-200 whitespace-nowrap">
              {language === "kn"
                ? "ಕೌಂಟರ್ ಆಪರೇಟರ್ / ಅಡ್ಮಿನ್ ಲಾಗಿನ್"
                : "Terminal Access Authentication"}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 transition-opacity duration-200">
              {language === "kn"
                ? "ನಿಮ್ಮ ಬಳಕೆದಾರ ಹೆಸರು ಮತ್ತು ಭದ್ರತಾ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ"
                : "Enter your assigned username and security password"}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#ff7a00]" />
                <span>
                  {language === "kn"
                    ? "ಬಳಕೆದಾರ ಹೆಸರು / USERNAME *"
                    : "Username / Operator ID *"}
                </span>
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={
                  language === "kn"
                    ? "ಬಳಕೆದಾರ ಹೆಸರು ನಮೂದಿಸಿ (Username)"
                    : "Enter your username"
                }
                className="w-full bg-[#faf8f5] text-slate-800 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#ff7a00] focus:bg-white placeholder-slate-400 transition-all shadow-inner"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#ff7a00]" />
                <span>
                  {language === "kn"
                    ? "ಪಾಸ್‌ವರ್ಡ್ / PASSWORD (PIN) *"
                    : "Password / Security PIN *"}
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    language === "kn"
                      ? "ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ (Password)"
                      : "Enter your password"
                  }
                  className="w-full bg-[#faf8f5] text-slate-800 border-2 border-slate-200 rounded-xl pl-4 pr-11 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#ff7a00] focus:bg-white placeholder-slate-400 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-amber-600 cursor-pointer rounded-lg transition-colors"
                  tabIndex={-1}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center text-red-600 text-[11px] leading-relaxed font-bold font-sans animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {/* Signin Button */}
            <button
              type="submit"
              className="w-full h-[46px] bg-gradient-to-r from-[#ff7a00] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white border-none font-black text-xs sm:text-sm tracking-wider uppercase py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-950/20 transition-all focus:outline-none hover:scale-[1.01] active:scale-[0.99]"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span className="whitespace-nowrap transition-opacity duration-200">
                {language === "kn"
                  ? "ದೃಢೀಕರಿಸಿ ಮತ್ತು ಪ್ರವೇಶಿಸಿ"
                  : "AUTHENTICATE & ENTER PORTAL"}
              </span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-center text-slate-500 font-medium leading-normal drop-shadow-sm max-w-md min-h-[32px] flex items-center justify-center transition-opacity duration-300">
          {t("login.footer")}
        </p>
      </div>
    </div>
  );
}
