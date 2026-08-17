/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useLanguage } from "../context/LanguageContext";

interface DssmLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
}

export default function DssmLogo({
  className = "",
  size = "md",
  showSubtitle = true,
}: DssmLogoProps) {
  // Dimensions based on selection
  const dimentions = {
    sm: { width: 50, height: 38 },
    md: { width: 100, height: 75 },
    lg: { width: 180, height: 135 },
    xl: { width: 320, height: 240 },
  };

  const { t } = useLanguage();

  const { width, height } = dimentions[size];

  // We convert the Google Drive view link into highly stable, direct-render URL formats
  const gdriveId = "1eXQYps6myew2Ss9jAKEip4oilDMAlRRz";
  const logoUrl = `https://lh3.googleusercontent.com/d/${gdriveId}`;
  const fallbackUrl = `https://drive.google.com/uc?export=download&id=${gdriveId}`;

  return (
    <div
      className={`flex flex-col items-center justify-center select-none ${className}`}
    >
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ width, height }}
      >
        <img
          src={logoUrl}
          alt="Dakshina Shirdi Sri Sai Mandira And Dattapeeta Logo"
          width={width}
          height={height}
          className="object-contain w-full h-full"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== fallbackUrl) {
              img.src = fallbackUrl;
            }
          }}
        />
      </div>
      {showSubtitle && size !== "sm" && (
        <div className="text-center mt-2">
          <span className="block text-[10px] font-bold text-amber-600 tracking-widest font-display">
            {t("brand.full")}
          </span>
          <span className="block text-[8px] font-medium text-slate-500 tracking-wider uppercase font-sans mt-0.5">
            {t("brand.shortAddress")}
          </span>
        </div>
      )}
    </div>
  );
}
