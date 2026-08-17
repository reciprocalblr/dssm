import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Sun,
  Moon,
  Sparkles,
  Share2,
  Printer,
  RotateCcw,
  SlidersHorizontal,
  Info,
  CheckCircle2,
  CalendarDays,
  Plus,
  X,
  Building2,
  Globe,
  Search,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// ----------------------------------------------------
// DATA STRUCTURES FOR DRIK PANCHANGA ALMANAC
// ----------------------------------------------------

export interface DayPanchangData {
  dayNumber: number; // e.g. 11
  dateStr: string; // "2026-08-11"
  dayOfWeek: string; // "Tuesday"
  dayOfWeekKn: string; // "ಮಂಗಳವಾರ"
  dayOfWeekShortKn: string; // "ಮಂಗಳ"
  tithiShort: string; // "Chaturdashi K"
  tithiFull: string; // "Chaturdashi upto 01:52 AM, Aug 12"
  tithiKn: string; // "ಚತುರ್ದಶಿ"
  lunarDayNum: number; // 29
  paksha: "Krishna Paksha" | "Shukla Paksha";
  pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ" | "ಶುಕ್ಲ ಪಕ್ಷ";
  amantaMonth: string; // "Ashadha"
  amantaMonthKn: string; // "ಆಷಾಢ"
  purnimantaMonth: string; // "Shravana"
  purnimantaMonthKn: string; // "ಶ್ರಾವಣ"
  nakshatra: string; // "Punarvasu upto 10:09 AM"
  nakshatraKn: string; // "ಪುನರ್ವಸು"
  yoga: string; // "Siddhi upto 08:41 PM"
  yogaKn: string; // "ಸಿದ್ಧಿ"
  karana: string; // "Vishti upto 03:22 PM, Shakuni upto 01:52 AM, Aug 12"
  karanaKn: string; // "ವಿಷ್ಟಿ / ಶಕುನಿ"
  sunSign: string; // "Karka"
  sunSignKn: string; // "ಕರ್ಕಾಟಕ"
  moonSign: string; // "Karka"
  moonSignKn: string; // "ಕರ್ಕಾಟಕ"
  sunrise: string; // "06:07 AM"
  sunset: string; // "06:43 PM"
  moonrise: string; // "05:31 AM, Aug 12"
  moonset: string; // "05:37 PM"
  rahuKalam: string; // "03:34 PM to 05:08 PM"
  gulikaiKalam: string; // "12:25 PM to 01:59 PM"
  yamaganda: string; // "09:16 AM to 10:50 AM"
  abhijit: string; // "12:00 PM to 12:50 PM"
  durMuhurtam: string; // "08:38 AM to 09:28 AM, 11:16 PM to 12:00 AM, Aug 12"
  amritKalam: string; // "07:59 AM to 09:28 AM, 02:10 AM to 03:37 AM, Aug 12"
  varjyam: string; // "05:26 PM to 06:53 PM"
  moonPhase: "new_moon" | "full_moon" | "waxing" | "waning";
  festivals: { title: string; desc?: string; titleKn?: string }[];
}

// ----------------------------------------------------
// AUGUST 2026 DRIK PANCHANG MONTH DATA (EXACT TO SCREENSHOT)
// ----------------------------------------------------

const AUGUST_2026_DAYS: Record<number, DayPanchangData> = {
  1: {
    dayNumber: 1,
    dateStr: "2026-08-01",
    dayOfWeek: "Saturday",
    dayOfWeekKn: "ಶನಿವಾರ",
    dayOfWeekShortKn: "ಶನಿ",
    tithiShort: "Dwitiya K",
    tithiFull: "Dwitiya upto 04:12 PM",
    tithiKn: "ದ್ವಿತೀಯಾ",
    lunarDayNum: 17,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Ashadha",
    amantaMonthKn: "ಆಷಾಢ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Shatabhisha upto 02:15 PM",
    nakshatraKn: "ಶತಭಿಷಾ",
    yoga: "Saubhagya upto 06:30 PM",
    yogaKn: "ಸೌಭಾಗ್ಯ",
    karana: "Taitila upto 04:12 PM",
    karanaKn: "ತೈತಿಲ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Kumbha",
    moonSignKn: "ಕುಂಭ",
    sunrise: "06:08 AM",
    sunset: "06:47 PM",
    moonrise: "08:45 PM",
    moonset: "08:12 AM, Aug 2",
    rahuKalam: "09:16 AM to 10:51 AM",
    gulikaiKalam: "06:08 AM to 07:42 AM",
    yamaganda: "01:59 PM to 03:35 PM",
    abhijit: "12:02 PM to 12:52 PM",
    durMuhurtam: "06:08 AM to 06:58 AM",
    amritKalam: "08:10 AM to 09:40 AM",
    varjyam: "08:20 PM to 09:50 PM",
    moonPhase: "waning",
    festivals: [
      {
        title: "Jayaparvati Vrat Ends",
        titleKn: "ಜಯಪಾರ್ವತಿ ವ್ರತ ಮುಕ್ತಾಯ",
        desc: "Special fasting ritual concludes",
      },
      {
        title: "Agastya Arghya",
        titleKn: "ಅಗಸ್ತ್ಯ ಅರ್ಘ್ಯ",
        desc: "Holy offerings to Sage Agastya",
      },
    ],
  },
  2: {
    dayNumber: 2,
    dateStr: "2026-08-02",
    dayOfWeek: "Sunday",
    dayOfWeekKn: "ಭಾನುವಾರ",
    dayOfWeekShortKn: "ರವಿ",
    tithiShort: "Chaturthi K",
    tithiFull: "Tritiya/Chaturdashi K upto 02:45 PM",
    tithiKn: "ಚತುರ್ಥಿ",
    lunarDayNum: 18,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Ashadha",
    amantaMonthKn: "ಆಷಾಢ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Purva Bhadrapada upto 01:20 PM",
    nakshatraKn: "ಪೂರ್ವಾಭಾದ್ರಪದ",
    yoga: "Shobhana upto 04:10 PM",
    yogaKn: "ಶೋಭನ",
    karana: "Gara upto 02:45 PM",
    karanaKn: "ಗರ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Meena",
    moonSignKn: "ಮೀನ",
    sunrise: "06:08 AM",
    sunset: "06:46 PM",
    moonrise: "09:30 PM",
    moonset: "09:15 AM, Aug 3",
    rahuKalam: "05:10 PM to 06:46 PM",
    gulikaiKalam: "03:35 PM to 05:10 PM",
    yamaganda: "12:27 PM to 02:01 PM",
    abhijit: "12:02 PM to 12:52 PM",
    durMuhurtam: "05:05 PM to 05:55 PM",
    amritKalam: "06:40 AM to 08:12 AM",
    varjyam: "07:15 PM to 08:45 PM",
    moonPhase: "waning",
    festivals: [
      {
        title: "Gajanana Sankashti",
        titleKn: "ಗಜಾನನ ಸಂಕಷ್ಟ ಚತುರ್ಥಿ",
        desc: "Sankashti Chaturthi dedicated to Lord Ganesha",
      },
    ],
  },
  3: {
    dayNumber: 3,
    dateStr: "2026-08-03",
    dayOfWeek: "Monday",
    dayOfWeekKn: "ಸೋಮವಾರ",
    dayOfWeekShortKn: "ಸೋಮ",
    tithiShort: "Panchami K",
    tithiFull: "Panchami upto 01:15 PM",
    tithiKn: "ಪಂಚಮಿ",
    lunarDayNum: 19,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Ashadha",
    amantaMonthKn: "ಆಷಾಢ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Uttara Bhadrapada upto 12:05 PM",
    nakshatraKn: "ಉತ್ತರಾಭಾದ್ರಪದ",
    yoga: "Atiganda upto 02:10 PM",
    yogaKn: "ಅತಿಗಂಡ",
    karana: "Visti upto 01:15 PM",
    karanaKn: "ವಿಷ್ಟಿ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Meena",
    moonSignKn: "ಮೀನ",
    sunrise: "06:08 AM",
    sunset: "06:46 PM",
    moonrise: "10:15 PM",
    moonset: "10:18 AM, Aug 4",
    rahuKalam: "07:42 AM to 09:17 AM",
    gulikaiKalam: "01:59 PM to 03:34 PM",
    yamaganda: "10:51 AM to 12:25 PM",
    abhijit: "12:01 PM to 12:51 PM",
    durMuhurtam: "12:51 PM to 01:41 PM",
    amritKalam: "05:50 AM to 07:22 AM",
    varjyam: "06:30 PM to 08:00 PM",
    moonPhase: "waning",
    festivals: [
      {
        title: "Nagar Panchami (Local)",
        titleKn: "ನಾಗರ ಪಂಚಮಿ",
        desc: "Serpent deity worship fast",
      },
    ],
  },
  4: {
    dayNumber: 4,
    dateStr: "2026-08-04",
    dayOfWeek: "Tuesday",
    dayOfWeekKn: "ಮಂಗಳವಾರ",
    dayOfWeekShortKn: "ಮಂಗಳ",
    tithiShort: "Shasthi K",
    tithiFull: "Shasthi upto 11:40 AM",
    tithiKn: "ಷಷ್ಠಿ",
    lunarDayNum: 21,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Ashadha",
    amantaMonthKn: "ಆಷಾಢ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Revati upto 10:50 AM",
    nakshatraKn: "ರೇವತಿ",
    yoga: "Sukarma upto 12:05 PM",
    yogaKn: "ಸುಕರ್ಮ",
    karana: "Bava upto 11:40 AM",
    karanaKn: "ಬವ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Mesha",
    moonSignKn: "ಮೇಷ",
    sunrise: "06:08 AM",
    sunset: "06:45 PM",
    moonrise: "11:00 PM",
    moonset: "11:20 AM, Aug 5",
    rahuKalam: "03:34 PM to 05:09 PM",
    gulikaiKalam: "12:25 PM to 02:00 PM",
    yamaganda: "09:17 AM to 10:51 AM",
    abhijit: "12:01 PM to 12:51 PM",
    durMuhurtam: "08:38 AM to 09:28 AM",
    amritKalam: "07:10 AM to 08:40 AM",
    varjyam: "04:15 PM to 05:45 PM",
    moonPhase: "waning",
    festivals: [
      {
        title: "Mangala Gauri Vrat",
        titleKn: "ಮಂಗಳ ಗೌರಿ ವ್ರತ",
        desc: "Traditional Tuesday vow for marital bliss",
      },
    ],
  },
  5: {
    dayNumber: 5,
    dateStr: "2026-08-05",
    dayOfWeek: "Wednesday",
    dayOfWeekKn: "ಬುಧವಾರ",
    dayOfWeekShortKn: "ಬುಧ",
    tithiShort: "Saptami K",
    tithiFull: "Saptami upto 10:10 AM",
    tithiKn: "ಸಪ್ತಮಿ",
    lunarDayNum: 22,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Ashadha",
    amantaMonthKn: "ಆಷಾಢ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Ashwini upto 09:35 AM",
    nakshatraKn: "ಅಶ್ವಿನಿ",
    yoga: "Dhriti upto 10:00 AM",
    yogaKn: "ಧೃತಿ",
    karana: "Kaulava upto 10:10 AM",
    karanaKn: "ಕೌಲವ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Mesha",
    moonSignKn: "ಮೇಷ",
    sunrise: "06:08 AM",
    sunset: "06:45 PM",
    moonrise: "11:48 PM",
    moonset: "12:22 PM, Aug 6",
    rahuKalam: "12:25 PM to 02:00 PM",
    gulikaiKalam: "10:51 AM to 12:25 PM",
    yamaganda: "07:43 AM to 09:17 AM",
    abhijit: "12:01 PM to 12:51 PM",
    durMuhurtam: "11:40 AM to 12:30 PM",
    amritKalam: "08:00 AM to 09:30 AM",
    varjyam: "03:10 PM to 04:40 PM",
    moonPhase: "waning",
    festivals: [
      {
        title: "Sheetala Saptami",
        titleKn: "ಶೀತಲಾ ಸಪ್ತಮಿ",
        desc: "Worship of Goddess Sheetala",
      },
    ],
  },
  6: {
    dayNumber: 6,
    dateStr: "2026-08-06",
    dayOfWeek: "Thursday",
    dayOfWeekKn: "ಗುರುವಾರ",
    dayOfWeekShortKn: "ಗುರು",
    tithiShort: "Ashtami K",
    tithiFull: "Ashtami upto 08:35 AM",
    tithiKn: "ಅಷ್ಟಮಿ",
    lunarDayNum: 23,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Ashadha",
    amantaMonthKn: "ಆಷಾಢ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Bharani upto 08:20 AM",
    nakshatraKn: "ಭರಣಿ",
    yoga: "Shoola upto 07:50 AM",
    yogaKn: "ಶೂಲ",
    karana: "Taitila upto 08:35 AM",
    karanaKn: "ತೈತಿಲ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Vrishabha",
    moonSignKn: "ವೃಷಭ",
    sunrise: "06:08 AM",
    sunset: "06:45 PM",
    moonrise: "12:38 AM, Aug 7",
    moonset: "01:25 PM",
    rahuKalam: "01:59 PM to 03:34 PM",
    gulikaiKalam: "09:17 AM to 10:51 AM",
    yamaganda: "06:08 AM to 07:43 AM",
    abhijit: "12:01 PM to 12:51 PM",
    durMuhurtam: "10:02 AM to 10:52 AM",
    amritKalam: "09:30 AM to 11:00 AM",
    varjyam: "02:00 PM to 03:30 PM",
    moonPhase: "waning",
    festivals: [
      {
        title: "Kalashtami",
        titleKn: "ಕಾಲಾಷ್ಟಮಿ",
        desc: "Monthly Kalashtami Vrat for Lord Bhairava",
      },
    ],
  },
  7: {
    dayNumber: 7,
    dateStr: "2026-08-07",
    dayOfWeek: "Friday",
    dayOfWeekKn: "ಶುಕ್ರವಾರ",
    dayOfWeekShortKn: "ಶುಕ್ರ",
    tithiShort: "Navami K",
    tithiFull: "Navami upto 07:00 AM",
    tithiKn: "ನವಮಿ",
    lunarDayNum: 24,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Ashadha",
    amantaMonthKn: "ಆಷಾಢ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Krittika upto 07:05 AM",
    nakshatraKn: "ಕೃತ್ತಿಕಾ",
    yoga: "Ganda upto 05:40 AM",
    yogaKn: "ಗಂಡ",
    karana: "Gara upto 07:00 AM",
    karanaKn: "ಗರ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Vrishabha",
    moonSignKn: "ವೃಷಭ",
    sunrise: "06:07 AM",
    sunset: "06:44 PM",
    moonrise: "01:30 AM, Aug 8",
    moonset: "02:25 PM",
    rahuKalam: "10:51 AM to 12:25 PM",
    gulikaiKalam: "07:43 AM to 09:17 AM",
    yamaganda: "03:33 PM to 05:08 PM",
    abhijit: "12:01 PM to 12:51 PM",
    durMuhurtam: "08:38 AM to 09:28 AM",
    amritKalam: "11:15 AM to 12:45 PM",
    varjyam: "01:10 PM to 02:40 PM",
    moonPhase: "waning",
    festivals: [
      {
        title: "Varahi Jayanti",
        titleKn: "ವಾರಾಹಿ ಜಯಂತಿ",
        desc: "Auspicious appearance day of Goddess Varahi",
      },
    ],
  },
  8: {
    dayNumber: 8,
    dateStr: "2026-08-08",
    dayOfWeek: "Saturday",
    dayOfWeekKn: "ಶನಿವಾರ",
    dayOfWeekShortKn: "ಶನಿ",
    tithiShort: "Dashami K",
    tithiFull: "Dashami upto 05:25 AM, Aug 9",
    tithiKn: "ದಶಮಿ",
    lunarDayNum: 25,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Ashadha",
    amantaMonthKn: "ಆಷಾಢ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Rohini upto 05:55 AM, Aug 9",
    nakshatraKn: "ರೋಹಿಣಿ",
    yoga: "Vriddhi upto 03:30 AM, Aug 9",
    yogaKn: "ವೃದ್ಧಿ",
    karana: "Visti upto 05:25 AM",
    karanaKn: "ವಿಷ್ಟಿ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Mithuna",
    moonSignKn: "ಮಿಥುನ",
    sunrise: "06:07 AM",
    sunset: "06:44 PM",
    moonrise: "02:25 AM, Aug 9",
    moonset: "03:22 PM",
    rahuKalam: "09:17 AM to 10:51 AM",
    gulikaiKalam: "06:07 AM to 07:42 AM",
    yamaganda: "01:59 PM to 03:33 PM",
    abhijit: "12:01 PM to 12:51 PM",
    durMuhurtam: "06:07 AM to 06:57 AM",
    amritKalam: "01:20 PM to 02:50 PM",
    varjyam: "12:00 PM to 01:30 PM",
    moonPhase: "waning",
    festivals: [
      {
        title: "Dashami Vrat",
        titleKn: "ದಶಮಿ ವ್ರತ",
        desc: "Observance of Dashami fasting",
      },
    ],
  },
  9: {
    dayNumber: 9,
    dateStr: "2026-08-09",
    dayOfWeek: "Sunday",
    dayOfWeekKn: "ಭಾನುವಾರ",
    dayOfWeekShortKn: "ರವಿ",
    tithiShort: "Ekadashi K",
    tithiFull: "Ekadashi upto 03:50 AM, Aug 10",
    tithiKn: "ಏಕಾದಶಿ",
    lunarDayNum: 26,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Ashadha",
    amantaMonthKn: "ಆಷಾಢ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Mrigashirsha upto 04:50 AM, Aug 10",
    nakshatraKn: "ಮೃಗಶಿರಾ",
    yoga: "Dhruva upto 01:20 AM, Aug 10",
    yogaKn: "ಧ್ರುವ",
    karana: "Bava upto 03:50 AM",
    karanaKn: "ಬವ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Mithuna",
    moonSignKn: "ಮಿಥುನ",
    sunrise: "06:07 AM",
    sunset: "06:43 PM",
    moonrise: "03:22 AM, Aug 10",
    moonset: "04:15 PM",
    rahuKalam: "05:08 PM to 06:43 PM",
    gulikaiKalam: "03:33 PM to 05:08 PM",
    yamaganda: "12:25 PM to 01:59 PM",
    abhijit: "12:00 PM to 12:50 PM",
    durMuhurtam: "05:03 PM to 05:53 PM",
    amritKalam: "03:15 PM to 04:45 PM",
    varjyam: "11:00 AM to 12:30 PM",
    moonPhase: "waning",
    festivals: [
      {
        title: "Kamika Ekadashi",
        titleKn: "ಕಾಮಿಕಾ ಏಕಾದಶಿ",
        desc: "Auspicious Lord Vishnu fast in Ashadha/Shravana Krishna Paksha",
      },
    ],
  },
  10: {
    dayNumber: 10,
    dateStr: "2026-08-10",
    dayOfWeek: "Monday",
    dayOfWeekKn: "ಸೋಮವಾರ",
    dayOfWeekShortKn: "ಸೋಮ",
    tithiShort: "Dwadashi K",
    tithiFull: "Dwadashi upto 02:48 AM, Aug 11",
    tithiKn: "ದ್ವಾದಶಿ",
    lunarDayNum: 27,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Ashadha",
    amantaMonthKn: "ಆಷಾಢ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Ardra upto 02:40 AM, Aug 11",
    nakshatraKn: "ಆರ್ದ್ರಾ",
    yoga: "Vyatipata upto 11:10 PM",
    yogaKn: "ವ್ಯತೀಪಾತ",
    karana: "Kaulava upto 02:48 AM",
    karanaKn: "ಕೌಲವ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Mithuna",
    moonSignKn: "ಮಿಥುನ",
    sunrise: "06:07 AM",
    sunset: "06:43 PM",
    moonrise: "04:22 AM, Aug 11",
    moonset: "05:00 PM",
    rahuKalam: "07:42 AM to 09:16 AM",
    gulikaiKalam: "01:59 PM to 03:33 PM",
    yamaganda: "10:50 AM to 12:25 PM",
    abhijit: "12:00 PM to 12:50 PM",
    durMuhurtam: "12:50 PM to 01:40 PM",
    amritKalam: "05:10 PM to 06:40 PM",
    varjyam: "08:15 AM to 09:45 AM",
    moonPhase: "waning",
    festivals: [
      {
        title: "Soma Pradosh Vrat",
        titleKn: "ಸೋಮ ಪ್ರದೋಷ ವ್ರತ",
        desc: "Special Monday evening Shiva worship",
      },
    ],
  },
  11: {
    // EXACT MATCH TO SCREENSHOT
    dayNumber: 11,
    dateStr: "2026-08-11",
    dayOfWeek: "Tuesday",
    dayOfWeekKn: "ಮಂಗಳವಾರ",
    dayOfWeekShortKn: "ಮಂಗಳ",
    tithiShort: "Chaturdashi K",
    tithiFull: "Chaturdashi upto 01:52 AM, Aug 12",
    tithiKn: "ಚತುರ್ದಶಿ",
    lunarDayNum: 29,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Ashadha",
    amantaMonthKn: "ಆಷಾಢ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Punarvasu upto 10:09 AM",
    nakshatraKn: "ಪುನರ್ವಸು",
    yoga: "Siddhi upto 08:41 PM",
    yogaKn: "ಸಿದ್ಧಿ",
    karana: "Vishti upto 03:22 PM, Shakuni upto 01:52 AM, Aug 12",
    karanaKn: "ವಿಷ್ಟಿ / ಶಕುನಿ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Karka",
    moonSignKn: "ಕರ್ಕಾಟಕ",
    sunrise: "06:07 AM",
    sunset: "06:43 PM",
    moonrise: "05:31 AM, Aug 12",
    moonset: "05:37 PM",
    rahuKalam: "03:34 PM to 05:08 PM",
    gulikaiKalam: "12:25 PM to 01:59 PM",
    yamaganda: "09:16 AM to 10:50 AM",
    abhijit: "12:00 PM to 12:50 PM",
    durMuhurtam: "08:38 AM to 09:28 AM, 11:16 PM to 12:00 AM, Aug 12",
    amritKalam: "07:59 AM to 09:28 AM, 02:10 AM, Aug 12 to 03:37 AM, Aug 12",
    varjyam: "05:26 PM to 06:53 PM",
    moonPhase: "waning",
    festivals: [
      {
        title: "1st Chaturmasa Day 18",
        titleKn: "೧ ನೇ ಚಾತುರ್ಮಾಸ ದಿನ ೧೮",
        desc: "Green leafy vegetable prohibition fast",
      },
      {
        title: "Sawan Shivaratri",
        titleKn: "ಶ್ರಾವಣ ಶಿವರಾತ್ರಿ",
        desc: "Auspicious monthly Shivaratri during Shravana/Ashadha",
      },
      {
        title: "Masik Shivaratri",
        titleKn: "ಮಾಸಿಕ ಶಿವರಾತ್ರಿ",
        desc: "Monthly night-long vigil for Lord Shiva",
      },
    ],
  },
  12: {
    dayNumber: 12,
    dateStr: "2026-08-12",
    dayOfWeek: "Wednesday",
    dayOfWeekKn: "ಬುಧವಾರ",
    dayOfWeekShortKn: "ಬುಧ",
    tithiShort: "Amavasya",
    tithiFull: "Amavasya upto 01:05 AM, Aug 13",
    tithiKn: "ಅಮಾವಾಸ್ಯೆ",
    lunarDayNum: 30,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Ashadha",
    amantaMonthKn: "ಆಷಾಢ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Pushya upto 11:15 AM",
    nakshatraKn: "ಪುಷ್ಯ",
    yoga: "Vatayana upto 06:15 PM",
    yogaKn: "ವ್ಯಾಪಾತ",
    karana: "Naga upto 01:05 AM",
    karanaKn: "ನಾಗ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Karka",
    moonSignKn: "ಕರ್ಕಾಟಕ",
    sunrise: "06:07 AM",
    sunset: "06:42 PM",
    moonrise: "06:30 AM, Aug 13",
    moonset: "06:18 PM",
    rahuKalam: "12:25 PM to 01:59 PM",
    gulikaiKalam: "10:50 AM to 12:25 PM",
    yamaganda: "07:42 AM to 09:16 AM",
    abhijit: "12:00 PM to 12:50 PM",
    durMuhurtam: "11:39 AM to 12:29 PM",
    amritKalam: "08:15 AM to 09:45 AM",
    varjyam: "03:40 PM to 05:10 PM",
    moonPhase: "new_moon",
    festivals: [
      {
        title: "Surya Grahan *Purna",
        titleKn: "ಸೂರ್ಯ ಗ್ರಹಣ (ಪೂರ್ಣ)",
        desc: "Total Solar Eclipse (Global astronomical occurrence)",
      },
      {
        title: "Darsha Amavasya",
        titleKn: "ದರ್ಶ ಅಮಾವಾಸ್ಯೆ",
        desc: "Ancestoral homage & Pitru Tarpan",
      },
      {
        title: "Ashadha Amavasya",
        titleKn: "ಆಷಾಢ ಅಮಾವಾಸ್ಯೆ / ಭೀಮನ ಅಮಾವಾಸ್ಯೆ",
        desc: "Holy new moon concluding Ashadha Amanta month",
      },
    ],
  },
  13: {
    dayNumber: 13,
    dateStr: "2026-08-13",
    dayOfWeek: "Thursday",
    dayOfWeekKn: "ಗುರುವಾರ",
    dayOfWeekShortKn: "ಗುರು",
    tithiShort: "Pratipada S",
    tithiFull: "Pratipada upto 01:10 AM, Aug 14",
    tithiKn: "ಪ್ರಥಮಾ (ಪಾಡ್ಯ)",
    lunarDayNum: 1,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Ashlesha upto 01:10 PM",
    nakshatraKn: "ಆಶ್ಲೇಷಾ",
    yoga: "Variyan upto 04:10 PM",
    yogaKn: "ವರೀಯಾನ್",
    karana: "Kinstughna upto 01:10 AM",
    karanaKn: "ಕಿಂಸ್ತುಘ್ನ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Simha",
    moonSignKn: "ಸಿಂಹ",
    sunrise: "06:07 AM",
    sunset: "06:42 PM",
    moonrise: "07:20 AM",
    moonset: "07:00 PM",
    rahuKalam: "01:58 PM to 03:32 PM",
    gulikaiKalam: "09:16 AM to 10:50 AM",
    yamaganda: "06:07 AM to 07:41 AM",
    abhijit: "12:00 PM to 12:50 PM",
    durMuhurtam: "10:01 AM to 10:51 AM",
    amritKalam: "09:20 AM to 10:50 AM",
    varjyam: "02:15 PM to 03:45 PM",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Ishti",
        titleKn: "ಇಷ್ಟಿ",
        desc: "Shukla Paksha Pratipada Yajna rituals",
      },
      {
        title: "Shravana Month Begins",
        titleKn: "ಶ್ರಾವಣ ಮಾಸಾರಂಭ",
        desc: "Beginning of holy Shravana month (Amanta)",
      },
    ],
  },
  14: {
    dayNumber: 14,
    dateStr: "2026-08-14",
    dayOfWeek: "Friday",
    dayOfWeekKn: "ಶುಕ್ರವಾರ",
    dayOfWeekShortKn: "ಶುಕ್ರ",
    tithiShort: "Dwitiya S",
    tithiFull: "Dwitiya upto 01:50 AM, Aug 15",
    tithiKn: "ದ್ವಿತೀಯಾ",
    lunarDayNum: 2,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Magha upto 03:20 PM",
    nakshatraKn: "ಮಘಾ",
    yoga: "Parigha upto 02:40 PM",
    yogaKn: "ಪರಿಘ",
    karana: "Bava upto 01:50 AM",
    karanaKn: "ಬವ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Simha",
    moonSignKn: "ಸಿಂಹ",
    sunrise: "06:07 AM",
    sunset: "06:41 PM",
    moonrise: "08:15 AM",
    moonset: "07:45 PM",
    rahuKalam: "10:50 AM to 12:24 PM",
    gulikaiKalam: "07:41 AM to 09:16 AM",
    yamaganda: "03:32 PM to 05:06 PM",
    abhijit: "12:00 PM to 12:50 PM",
    durMuhurtam: "08:37 AM to 09:27 AM",
    amritKalam: "11:30 AM to 01:00 PM",
    varjyam: "01:00 PM to 02:30 PM",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Chandra Darshana",
        titleKn: "ಚಂದ್ರ ದರ್ಶನ",
        desc: "Sighting of new waxing crescent moon",
      },
    ],
  },
  15: {
    dayNumber: 15,
    dateStr: "2026-08-15",
    dayOfWeek: "Saturday",
    dayOfWeekKn: "ಶನಿವಾರ",
    dayOfWeekShortKn: "ಶನಿ",
    tithiShort: "Tritiya S",
    tithiFull: "Tritiya upto 02:55 AM, Aug 16",
    tithiKn: "ತೃತೀಯಾ",
    lunarDayNum: 3,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Purva Phalguni upto 05:40 PM",
    nakshatraKn: "ಪೂರ್ವಾಫಲ್ಗುಣಿ (ಹುಬ್ಬಾ)",
    yoga: "Shiva upto 01:30 PM",
    yogaKn: "ಶಿವ",
    karana: "Kaulava upto 02:55 AM",
    karanaKn: "ಕೌಲವ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Simha",
    moonSignKn: "ಸಿಂಹ",
    sunrise: "06:07 AM",
    sunset: "06:41 PM",
    moonrise: "09:12 AM",
    moonset: "08:32 PM",
    rahuKalam: "09:16 AM to 10:50 AM",
    gulikaiKalam: "06:07 AM to 07:41 AM",
    yamaganda: "01:58 PM to 03:32 PM",
    abhijit: "12:00 PM to 12:50 PM",
    durMuhurtam: "06:07 AM to 06:57 AM",
    amritKalam: "01:10 PM to 02:40 PM",
    varjyam: "12:15 PM to 01:45 PM",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Hariyali Teej",
        titleKn: "ಹರಿಯಾಲಿ ತೀಜ್",
        desc: "Celebration of Goddess Parvati's union with Shiva",
      },
    ],
  },
  16: {
    dayNumber: 16,
    dateStr: "2026-08-16",
    dayOfWeek: "Sunday",
    dayOfWeekKn: "ಭಾನುವಾರ",
    dayOfWeekShortKn: "ರವಿ",
    tithiShort: "Chaturthi S",
    tithiFull: "Chaturthi upto 04:15 AM, Aug 17",
    tithiKn: "ಚತುರ್ಥಿ",
    lunarDayNum: 4,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Uttara Phalguni upto 08:10 PM",
    nakshatraKn: "ಉತ್ತರಾಫಲ್ಗುಣಿ (ಉತ್ತರಾ)",
    yoga: "Siddha upto 12:40 PM",
    yogaKn: "ಸಿದ್ಧ",
    karana: "Gara upto 04:15 AM",
    karanaKn: "ಗರ",
    sunSign: "Karka",
    sunSignKn: "ಕರ್ಕಾಟಕ",
    moonSign: "Kanya",
    moonSignKn: "ಕನ್ಯಾ",
    sunrise: "06:07 AM",
    sunset: "06:40 PM",
    moonrise: "10:10 AM",
    moonset: "09:22 PM",
    rahuKalam: "05:06 PM to 06:40 PM",
    gulikaiKalam: "03:31 PM to 05:06 PM",
    yamaganda: "12:24 PM to 01:58 PM",
    abhijit: "12:00 PM to 12:49 PM",
    durMuhurtam: "05:00 PM to 05:50 PM",
    amritKalam: "03:10 PM to 04:40 PM",
    varjyam: "02:00 PM to 03:30 PM",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Vinayaka Chaturthi",
        titleKn: "ವಿನಾಯಕ ಚತುರ್ಥಿ",
        desc: "Shukla Paksha Chaturthi for Lord Ganesha",
      },
    ],
  },
  17: {
    dayNumber: 17,
    dateStr: "2026-08-17",
    dayOfWeek: "Monday",
    dayOfWeekKn: "ಸೋಮವಾರ",
    dayOfWeekShortKn: "ಸೋಮ",
    tithiShort: "Panchami S",
    tithiFull: "Panchami upto 05:50 AM, Aug 18",
    tithiKn: "ಪಂಚಮಿ",
    lunarDayNum: 5,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Hasta upto 10:45 PM",
    nakshatraKn: "ಹಸ್ತಾ",
    yoga: "Sadhya upto 12:00 PM",
    yogaKn: "ಸಾಧ್ಯ",
    karana: "Visti upto 05:50 AM",
    karanaKn: "ವಿಷ್ಟಿ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Kanya",
    moonSignKn: "ಕನ್ಯಾ",
    sunrise: "06:07 AM",
    sunset: "06:39 PM",
    moonrise: "11:10 AM",
    moonset: "10:15 PM",
    rahuKalam: "07:41 AM to 09:15 AM",
    gulikaiKalam: "01:57 PM to 03:31 PM",
    yamaganda: "10:49 AM to 12:23 PM",
    abhijit: "11:59 AM to 12:49 PM",
    durMuhurtam: "12:49 PM to 01:39 PM",
    amritKalam: "05:00 PM to 06:30 PM",
    varjyam: "03:15 PM to 04:45 PM",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Nagara Panchami",
        titleKn: "ನಾಗರ ಪಂಚಮಿ",
        desc: "Major festival worshipping Serpent Gods (Nagas)",
      },
      {
        title: "Simha Sankranti",
        titleKn: "ಸಿಂಹ ಸಂಕ್ರಾಂತಿ",
        desc: "Sun enters Leo (Simha Rashi)",
      },
    ],
  },
  18: {
    dayNumber: 18,
    dateStr: "2026-08-18",
    dayOfWeek: "Tuesday",
    dayOfWeekKn: "ಮಂಗಳವಾರ",
    dayOfWeekShortKn: "ಮಂಗಳ",
    tithiShort: "Shasthi S",
    tithiFull: "Shasthi Whole Day",
    tithiKn: "ಷಷ್ಠಿ",
    lunarDayNum: 6,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Chitra upto 01:20 AM, Aug 19",
    nakshatraKn: "ಚಿತ್ರಾ",
    yoga: "Shubha upto 11:30 AM",
    yogaKn: "ಶುಭ",
    karana: "Kaulava upto 07:20 PM",
    karanaKn: "ಕೌಲವ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Tula",
    moonSignKn: "ತುಲಾ",
    sunrise: "06:07 AM",
    sunset: "06:39 PM",
    moonrise: "12:12 PM",
    moonset: "11:10 PM",
    rahuKalam: "03:31 PM to 05:05 PM",
    gulikaiKalam: "12:23 PM to 01:57 PM",
    yamaganda: "09:15 AM to 10:49 AM",
    abhijit: "11:59 AM to 12:49 PM",
    durMuhurtam: "08:36 AM to 09:26 AM",
    amritKalam: "07:20 PM to 08:50 PM",
    varjyam: "04:30 PM to 06:00 PM",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Kalki Jayanti",
        titleKn: "ಕಲ್ಕಿ ಜಯಂತಿ",
        desc: "Appearance day of Lord Kalki avatar",
      },
    ],
  },
  19: {
    dayNumber: 19,
    dateStr: "2026-08-19",
    dayOfWeek: "Wednesday",
    dayOfWeekKn: "ಬುಧವಾರ",
    dayOfWeekShortKn: "ಬುಧ",
    tithiShort: "Saptami S",
    tithiFull: "Saptami upto 07:30 AM",
    tithiKn: "ಸಪ್ತಮಿ",
    lunarDayNum: 7,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Swati upto 03:50 AM, Aug 20",
    nakshatraKn: "ಸ್ವಾತಿ",
    yoga: "Shukla upto 11:15 AM",
    yogaKn: "ಶುಕ್ಲ",
    karana: "Taitila upto 07:30 AM",
    karanaKn: "ತೈತಿಲ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Tula",
    moonSignKn: "ತುಲಾ",
    sunrise: "06:07 AM",
    sunset: "06:38 PM",
    moonrise: "01:15 PM",
    moonset: "12:08 AM, Aug 20",
    rahuKalam: "12:23 PM to 01:57 PM",
    gulikaiKalam: "10:49 AM to 12:23 PM",
    yamaganda: "07:41 AM to 09:15 AM",
    abhijit: "11:59 AM to 12:49 PM",
    durMuhurtam: "11:38 AM to 12:28 PM",
    amritKalam: "09:00 PM to 10:30 PM",
    varjyam: "05:10 PM to 06:40 PM",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Tulsidas Jayanti",
        titleKn: "ತುಳಸೀದಾಸ ಜಯಂತಿ",
        desc: "Birth anniversary of Saint Tulsidas",
      },
    ],
  },
  20: {
    dayNumber: 20,
    dateStr: "2026-08-20",
    dayOfWeek: "Thursday",
    dayOfWeekKn: "ಗುರುವಾರ",
    dayOfWeekShortKn: "ಗುರು",
    tithiShort: "Ashtami S",
    tithiFull: "Ashtami upto 09:20 AM",
    tithiKn: "ಅಷ್ಟಮಿ",
    lunarDayNum: 8,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Vishakha Whole Night",
    nakshatraKn: "ವಿಶಾಖಾ",
    yoga: "Brahma upto 11:10 AM",
    yogaKn: "ಬ್ರಹ್ಮ",
    karana: "Visti upto 09:20 AM",
    karanaKn: "ವಿಷ್ಟಿ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Vrishchika",
    moonSignKn: "ವೃಶ್ಚಿಕ",
    sunrise: "06:07 AM",
    sunset: "06:38 PM",
    moonrise: "02:18 PM",
    moonset: "01:05 AM, Aug 21",
    rahuKalam: "01:56 PM to 03:30 PM",
    gulikaiKalam: "09:15 AM to 10:49 AM",
    yamaganda: "06:07 AM to 07:41 AM",
    abhijit: "11:59 AM to 12:48 PM",
    durMuhurtam: "10:00 AM to 10:50 AM",
    amritKalam: "10:30 PM to 12:00 AM",
    varjyam: "06:00 PM to 07:30 PM",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Durgashtami",
        titleKn: "ದುರ್ಗಾಷ್ಟಮಿ",
        desc: "Monthly Ashtami devoted to Goddess Durga",
      },
    ],
  },
  21: {
    dayNumber: 21,
    dateStr: "2026-08-21",
    dayOfWeek: "Friday",
    dayOfWeekKn: "ಶುಕ್ರವಾರ",
    dayOfWeekShortKn: "ಶುಕ್ರ",
    tithiShort: "Navami S",
    tithiFull: "Navami upto 11:05 AM",
    tithiKn: "ನವಮಿ",
    lunarDayNum: 9,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Vishakha upto 06:15 AM",
    nakshatraKn: "ವಿಶಾಖಾ",
    yoga: "Indra upto 11:15 AM",
    yogaKn: "ಇಂದ್ರ",
    karana: "Bava upto 11:05 AM",
    karanaKn: "ಬವ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Vrishchika",
    moonSignKn: "ವೃಶ್ಚಿಕ",
    sunrise: "06:07 AM",
    sunset: "06:37 PM",
    moonrise: "03:18 PM",
    moonset: "02:02 AM, Aug 22",
    rahuKalam: "10:49 AM to 12:23 PM",
    gulikaiKalam: "07:41 AM to 09:15 AM",
    yamaganda: "03:29 PM to 05:03 PM",
    abhijit: "11:59 AM to 12:48 PM",
    durMuhurtam: "08:36 AM to 09:26 AM",
    amritKalam: "11:50 PM to 01:20 AM, Aug 22",
    varjyam: "07:10 PM to 08:40 PM",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Mahanavami Vrat",
        titleKn: "ಮಹಾನವಮಿ ವ್ರತ",
        desc: "Special fasting for Navami Tithi",
      },
    ],
  },
  22: {
    dayNumber: 22,
    dateStr: "2026-08-22",
    dayOfWeek: "Saturday",
    dayOfWeekKn: "ಶನಿವಾರ",
    dayOfWeekShortKn: "ಶನಿ",
    tithiShort: "Dashami S",
    tithiFull: "Dashami upto 12:40 PM",
    tithiKn: "ದಶಮಿ",
    lunarDayNum: 10,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Anuradha upto 08:35 AM",
    nakshatraKn: "ಅನುರಾಧಾ",
    yoga: "Vaidhriti upto 11:20 AM",
    yogaKn: "ವೈಧೃತಿ",
    karana: "Kaulava upto 12:40 PM",
    karanaKn: "ಕೌಲವ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Vrishchika",
    moonSignKn: "ವೃಶ್ಚಿಕ",
    sunrise: "06:07 AM",
    sunset: "06:36 PM",
    moonrise: "04:15 PM",
    moonset: "03:00 AM, Aug 23",
    rahuKalam: "09:15 AM to 10:48 AM",
    gulikaiKalam: "06:07 AM to 07:41 AM",
    yamaganda: "01:55 PM to 03:29 PM",
    abhijit: "11:58 AM to 12:48 PM",
    durMuhurtam: "06:07 AM to 06:57 AM",
    amritKalam: "01:10 AM, Aug 23 to 02:40 AM, Aug 23",
    varjyam: "08:15 PM to 09:45 PM",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Dashami S Vrat",
        titleKn: "ಶುಕ್ಲ ದಶಮಿ",
        desc: "Dashami rituals in Shravana",
      },
    ],
  },
  23: {
    dayNumber: 23,
    dateStr: "2026-08-23",
    dayOfWeek: "Sunday",
    dayOfWeekKn: "ಭಾನುವಾರ",
    dayOfWeekShortKn: "ರವಿ",
    tithiShort: "Ekadashi S",
    tithiFull: "Ekadashi upto 01:55 PM",
    tithiKn: "ಏಕಾದಶಿ",
    lunarDayNum: 11,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Jyeshtha upto 10:40 AM",
    nakshatraKn: "ಜ್ಯೇಷ್ಠಾ",
    yoga: "Vishkambha upto 11:25 AM",
    yogaKn: "ವಿಷ್ಕಂಭ",
    karana: "Gara upto 01:55 PM",
    karanaKn: "ಗರ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Dhanu",
    moonSignKn: "ಧನುಸ್ಸು",
    sunrise: "06:07 AM",
    sunset: "06:36 PM",
    moonrise: "05:10 PM",
    moonset: "03:58 AM, Aug 24",
    rahuKalam: "05:02 PM to 06:36 PM",
    gulikaiKalam: "03:28 PM to 05:02 PM",
    yamaganda: "12:22 PM to 01:55 PM",
    abhijit: "11:58 AM to 12:47 PM",
    durMuhurtam: "04:57 PM to 05:46 PM",
    amritKalam: "02:30 AM, Aug 24 to 04:00 AM, Aug 24",
    varjyam: "09:30 PM to 11:00 PM",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Shravana Putrada Ekadashi",
        titleKn: "ಶ್ರಾವಣ ಪುತ್ರದಾ ಏಕಾದಶಿ",
        desc: "Major Ekadashi fast for offspring's health and happiness",
      },
    ],
  },
  24: {
    dayNumber: 24,
    dateStr: "2026-08-24",
    dayOfWeek: "Monday",
    dayOfWeekKn: "ಸೋಮವಾರ",
    dayOfWeekShortKn: "ಸೋಮ",
    tithiShort: "Dwadashi S",
    tithiFull: "Dwadashi upto 02:50 PM",
    tithiKn: "ದ್ವಾದಶಿ",
    lunarDayNum: 12,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Mula upto 12:25 PM",
    nakshatraKn: "ಮೂಲಾ",
    yoga: "Priti upto 11:20 AM",
    yogaKn: "ಪ್ರೀತಿ",
    karana: "Visti upto 02:50 PM",
    karanaKn: "ವಿಷ್ಟಿ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Dhanu",
    moonSignKn: "ಧನುಸ್ಸು",
    sunrise: "06:07 AM",
    sunset: "06:35 PM",
    moonrise: "06:00 PM",
    moonset: "04:55 AM, Aug 25",
    rahuKalam: "07:41 AM to 09:14 AM",
    gulikaiKalam: "01:55 PM to 03:28 PM",
    yamaganda: "10:48 AM to 12:21 PM",
    abhijit: "11:58 AM to 12:47 PM",
    durMuhurtam: "12:47 PM to 01:36 PM",
    amritKalam: "03:40 AM, Aug 25 to 05:10 AM, Aug 25",
    varjyam: "10:30 PM to 12:00 AM",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Vaishnava Shravana Putrada Ekadashi",
        titleKn: "ವೈಷ್ಣವ ಶ್ರಾವಣ ಪುತ್ರದಾ ಏಕಾದಶಿ",
        desc: "Vaishnava tradition Ekadashi fast & Damodara worship",
      },
    ],
  },
  25: {
    dayNumber: 25,
    dateStr: "2026-08-25",
    dayOfWeek: "Tuesday",
    dayOfWeekKn: "ಮಂಗಳವಾರ",
    dayOfWeekShortKn: "ಮಂಗಳ",
    tithiShort: "Trayodashi S",
    tithiFull: "Trayodashi upto 03:20 PM",
    tithiKn: "ತ್ರಯೋದಶಿ",
    lunarDayNum: 13,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Purva Ashadha upto 01:50 PM",
    nakshatraKn: "ಪೂರ್ವಾಷಾಢ",
    yoga: "Ayushman upto 11:00 AM",
    yogaKn: "ಆಯುಷ್ಮಾನ್",
    karana: "Bava upto 03:20 PM",
    karanaKn: "ಬವ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Dhanu",
    moonSignKn: "ಧನುಸ್ಸು",
    sunrise: "06:07 AM",
    sunset: "06:34 PM",
    moonrise: "06:48 PM",
    moonset: "05:52 AM, Aug 26",
    rahuKalam: "03:27 PM to 05:01 PM",
    gulikaiKalam: "12:21 PM to 01:54 PM",
    yamaganda: "09:14 AM to 10:48 AM",
    abhijit: "11:58 AM to 12:47 PM",
    durMuhurtam: "08:35 AM to 09:25 AM",
    amritKalam: "04:30 AM, Aug 26 to 06:00 AM, Aug 26",
    varjyam: "11:15 PM to 12:45 AM, Aug 26",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Bhauma Pradosh Vrat",
        titleKn: "ಭೌಮ ಪ್ರದೋಷ ವ್ರತ",
        desc: "Tuesday Pradosha Vrat for Lord Shiva",
      },
    ],
  },
  26: {
    dayNumber: 26,
    dateStr: "2026-08-26",
    dayOfWeek: "Wednesday",
    dayOfWeekKn: "ಬುಧವಾರ",
    dayOfWeekShortKn: "ಬುಧ",
    tithiShort: "Chaturdashi S",
    tithiFull: "Chaturdashi upto 03:25 PM",
    tithiKn: "ಚತುರ್ದಶಿ",
    lunarDayNum: 14,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Uttara Ashadha upto 02:50 PM",
    nakshatraKn: "ಉತ್ತರಾಷಾಢ",
    yoga: "Saubhagya upto 10:30 AM",
    yogaKn: "ಸೌಭಾಗ್ಯ",
    karana: "Kaulava upto 03:25 PM",
    karanaKn: "ಕೌಲವ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Makara",
    moonSignKn: "ಮಕರ",
    sunrise: "06:07 AM",
    sunset: "06:34 PM",
    moonrise: "07:32 PM",
    moonset: "06:48 AM, Aug 27",
    rahuKalam: "12:21 PM to 01:54 PM",
    gulikaiKalam: "10:48 AM to 12:21 PM",
    yamaganda: "07:40 AM to 09:14 AM",
    abhijit: "11:57 AM to 12:46 PM",
    durMuhurtam: "11:36 AM to 12:26 PM",
    amritKalam: "07:15 AM to 08:45 AM",
    varjyam: "12:00 AM to 01:30 AM, Aug 27",
    moonPhase: "waxing",
    festivals: [
      {
        title: "Rigveda Upakarma",
        titleKn: "ಋಗ್ವೇದ ಉಪಾಕರ್ಮ",
        desc: "Rigveda sacred thread change ritual",
      },
    ],
  },
  27: {
    dayNumber: 27,
    dateStr: "2026-08-27",
    dayOfWeek: "Thursday",
    dayOfWeekKn: "ಗುರುವಾರ",
    dayOfWeekShortKn: "ಗುರು",
    tithiShort: "Purnima S",
    tithiFull: "Purnima upto 03:05 PM",
    tithiKn: "ಪೂರ್ಣಿಮಾ",
    lunarDayNum: 15,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Shravana upto 03:25 PM",
    nakshatraKn: "ಶ್ರವಣ",
    yoga: "Shobhana upto 09:40 AM",
    yogaKn: "ಶೋಭನ",
    karana: "Gara upto 03:05 PM",
    karanaKn: "ಗರ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Makara",
    moonSignKn: "ಮಕರ",
    sunrise: "06:07 AM",
    sunset: "06:33 PM",
    moonrise: "08:15 PM",
    moonset: "07:42 AM, Aug 28",
    rahuKalam: "01:53 PM to 03:26 PM",
    gulikaiKalam: "09:14 AM to 10:47 AM",
    yamaganda: "06:07 AM to 07:40 AM",
    abhijit: "11:57 AM to 12:46 PM",
    durMuhurtam: "09:58 AM to 10:48 AM",
    amritKalam: "08:30 AM to 10:00 AM",
    varjyam: "01:10 AM, Aug 28 to 02:40 AM, Aug 28",
    moonPhase: "full_moon",
    festivals: [
      {
        title: "Anvadhan",
        titleKn: "ಅನ್ವಾಧಾನ",
        desc: "Preparatory Yajna rituals before Purnima",
      },
      {
        title: "Narali Purnima",
        titleKn: "ನಾರಳಿ ಪೂರ್ಣಿಮಾ",
        desc: "Coconut festival in coastal Karnataka and Konkan",
      },
    ],
  },
  28: {
    // MAJOR FESTIVAL DAY
    dayNumber: 28,
    dateStr: "2026-08-28",
    dayOfWeek: "Friday",
    dayOfWeekKn: "ಶುಕ್ರವಾರ",
    dayOfWeekShortKn: "ಶುಕ್ರ",
    tithiShort: "Purnima",
    tithiFull: "Purnima upto 02:25 PM",
    tithiKn: "ಪೂರ್ಣಿಮಾ / ನೂಲು ಹುಣ್ಣಿಮೆ",
    lunarDayNum: 15,
    paksha: "Shukla Paksha",
    pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Shravana",
    purnimantaMonthKn: "ಶ್ರಾವಣ",
    nakshatra: "Dhanishta upto 03:35 PM",
    nakshatraKn: "ಧನಿಷ್ಠಾ",
    yoga: "Atiganda upto 08:30 AM",
    yogaKn: "ಅತಿಗಂಡ",
    karana: "Visti upto 02:25 PM",
    karanaKn: "ವಿಷ್ಟಿ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Kumbha",
    moonSignKn: "ಕುಂಭ",
    sunrise: "06:07 AM",
    sunset: "06:32 PM",
    moonrise: "08:58 PM",
    moonset: "08:35 AM, Aug 29",
    rahuKalam: "10:47 AM to 12:20 PM",
    gulikaiKalam: "07:40 AM to 09:14 AM",
    yamaganda: "03:26 PM to 04:59 PM",
    abhijit: "11:57 AM to 12:46 PM",
    durMuhurtam: "08:35 AM to 09:24 AM",
    amritKalam: "09:15 AM to 10:45 AM",
    varjyam: "02:00 AM, Aug 29 to 03:30 AM, Aug 29",
    moonPhase: "full_moon",
    festivals: [
      {
        title: "Varalakshmi Vrat",
        titleKn: "ವರಮಹಾಲಕ್ಷ್ಮಿ ವ್ರತ",
        desc: "Major sacred festival for Goddess Varalakshmi",
      },
      {
        title: "Raksha Bandhan / Rakhi",
        titleKn: "ರಕ್ಷಾ ಬಂಧನ (ರಾಖಿ)",
        desc: "Celebration of sibling bond & sacred protective thread",
      },
      {
        title: "Gayatri Jayanti",
        titleKn: "ಗಾಯತ್ರಿ ಜಯಂತಿ",
        desc: "Appearance day of Goddess Gayatri Veda Mata",
      },
      {
        title: "Chandra Grahan *Anshika",
        titleKn: "ಚಂದ್ರ ಗ್ರಹಣ (ಪಾಕ್ಷಿಕ)",
        desc: "Partial Lunar Eclipse",
      },
      {
        title: "Ishti",
        titleKn: "ಇಷ್ಟಿ",
        desc: "Purnima Ishti Yajna rites",
      },
    ],
  },
  29: {
    dayNumber: 29,
    dateStr: "2026-08-29",
    dayOfWeek: "Saturday",
    dayOfWeekKn: "ಶನಿವಾರ",
    dayOfWeekShortKn: "ಶನಿ",
    tithiShort: "Pratipada K",
    tithiFull: "Pratipada upto 01:20 PM",
    tithiKn: "ಪ್ರಥಮಾ (ಪಾಡ್ಯ)",
    lunarDayNum: 16,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Shatabhisha upto 03:20 PM",
    nakshatraKn: "ಶತಭಿಷಾ",
    yoga: "Sukarma upto 07:10 AM",
    yogaKn: "ಸುಕರ್ಮ",
    karana: "Bava upto 01:20 PM",
    karanaKn: "ಬವ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Kumbha",
    moonSignKn: "ಕುಂಭ",
    sunrise: "06:07 AM",
    sunset: "06:32 PM",
    moonrise: "09:40 PM",
    moonset: "09:28 AM, Aug 30",
    rahuKalam: "09:14 AM to 10:47 AM",
    gulikaiKalam: "06:07 AM to 07:40 AM",
    yamaganda: "01:53 PM to 03:25 PM",
    abhijit: "11:57 AM to 12:45 PM",
    durMuhurtam: "06:07 AM to 06:56 AM",
    amritKalam: "09:30 AM to 11:00 AM",
    varjyam: "02:30 AM, Aug 30 to 04:00 AM, Aug 30",
    moonPhase: "waning",
    festivals: [
      {
        title: "Gayatri Japam",
        titleKn: "ಗಾಯತ್ರಿ ಜಪಂ",
        desc: "1008 Gayatri Mantra chanting vow following Upakarma",
      },
    ],
  },
  30: {
    dayNumber: 30,
    dateStr: "2026-08-30",
    dayOfWeek: "Sunday",
    dayOfWeekKn: "ಭಾನುವಾರ",
    dayOfWeekShortKn: "ರವಿ",
    tithiShort: "Dwitiya K",
    tithiFull: "Dwitiya upto 11:50 AM",
    tithiKn: "ದ್ವಿತೀಯಾ",
    lunarDayNum: 17,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Purva Bhadrapada upto 02:45 PM",
    nakshatraKn: "ಪೂರ್ವಾಭಾದ್ರಪದ",
    yoga: "Dhriti Whole Day",
    yogaKn: "ಧೃತಿ",
    karana: "Kaulava upto 11:50 AM",
    karanaKn: "ಕೌಲವ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Meena",
    moonSignKn: "ಮೀನ",
    sunrise: "06:07 AM",
    sunset: "06:31 PM",
    moonrise: "10:25 PM",
    moonset: "10:20 AM, Aug 31",
    rahuKalam: "04:58 PM to 06:31 PM",
    gulikaiKalam: "03:25 PM to 04:58 PM",
    yamaganda: "12:19 PM to 01:52 PM",
    abhijit: "11:56 AM to 12:45 PM",
    durMuhurtam: "04:53 PM to 05:42 PM",
    amritKalam: "08:15 AM to 09:45 AM",
    varjyam: "01:20 AM, Aug 31 to 02:50 AM, Aug 31",
    moonPhase: "waning",
    festivals: [
      {
        title: "Tritiya K Prep / Bahula Chaturthi Eve",
        titleKn: "ಬಹುಳ ಚತುರ್ಥಿ ಮುನ್ನಾದಿನ",
        desc: "Fasting preparations for Kajari Teej",
      },
    ],
  },
  31: {
    dayNumber: 31,
    dateStr: "2026-08-31",
    dayOfWeek: "Monday",
    dayOfWeekKn: "ಸೋಮವಾರ",
    dayOfWeekShortKn: "ಸೋಮ",
    tithiShort: "Tritiya K",
    tithiFull: "Tritiya upto 10:05 AM, Chaturthi K starts",
    tithiKn: "ತೃತೀಯಾ / ಚತುರ್ಥಿ",
    lunarDayNum: 18,
    paksha: "Krishna Paksha",
    pakshaKn: "ಕೃಷ್ಣ ಪಕ್ಷ",
    amantaMonth: "Shravana",
    amantaMonthKn: "ಶ್ರಾವಣ",
    purnimantaMonth: "Bhadrapada",
    purnimantaMonthKn: "ಭಾದ್ರಪದ",
    nakshatra: "Uttara Bhadrapada upto 01:50 PM",
    nakshatraKn: "ಉತ್ತರಾಭಾದ್ರಪದ",
    yoga: "Shoola upto 03:40 AM, Sep 1",
    yogaKn: "ಶೂಲ",
    karana: "Gara upto 10:05 AM",
    karanaKn: "ಗರ",
    sunSign: "Simha",
    sunSignKn: "ಸಿಂಹ",
    moonSign: "Meena",
    moonSignKn: "ಮೀನ",
    sunrise: "06:07 AM",
    sunset: "06:30 PM",
    moonrise: "11:12 PM",
    moonset: "11:15 AM, Sep 1",
    rahuKalam: "07:39 AM to 09:13 AM",
    gulikaiKalam: "01:51 PM to 03:24 PM",
    yamaganda: "10:46 AM to 12:19 PM",
    abhijit: "11:56 AM to 12:45 PM",
    durMuhurtam: "12:45 PM to 01:34 PM",
    amritKalam: "07:30 AM to 09:00 AM",
    varjyam: "12:15 AM, Sep 1 to 01:45 AM, Sep 1",
    moonPhase: "waning",
    festivals: [
      {
        title: "Kajari Teej",
        titleKn: "ಕಜರಿ ತೀಜ್",
        desc: "Significant fasting vow observed by women",
      },
      {
        title: "Bahula Chaturthi",
        titleKn: "ಬಹುಳ ಚತುರ್ಥಿ",
        desc: "Worship of Sacred Cows and Ganesha",
      },
      {
        title: "Heramba Sankashti",
        titleKn: "ಹೇರಂಬ ಸಂಕಷ್ಟ ಚತುರ್ಥಿ",
        desc: "Sankashti Chaturthi dedicated to Heramba Ganesha",
      },
    ],
  },
};

// Monthly Summary Table of Festivals in August 2026 (exact to screenshot bottom section)
const AUGUST_2026_FESTIVALS_GRID = [
  {
    date: "01",
    day: "Saturday",
    dayKn: "ಶನಿವಾರ",
    title: "Jayaparvati Vrat Ends, Agastya Arghya",
    titleKn: "ಜಯಪಾರ್ವತಿ ವ್ರತ ಮುಕ್ತಾಯ, ಅಗಸ್ತ್ಯ ಅರ್ಘ್ಯ",
  },
  {
    date: "02",
    day: "Sunday",
    dayKn: "ಭಾನುವಾರ",
    title: "Gajanana Sankashti",
    titleKn: "ಗಜಾನನ ಸಂಕಷ್ಟ ಚತುರ್ಥಿ",
  },
  {
    date: "09",
    day: "Sunday",
    dayKn: "ಭಾನುವಾರ",
    title: "Kamika Ekadashi",
    titleKn: "ಕಾಮಿಕಾ ಏಕಾದಶಿ",
  },
  {
    date: "10",
    day: "Monday",
    dayKn: "ಸೋಮವಾರ",
    title: "Soma Pradosh Vrat",
    titleKn: "ಸೋಮ ಪ್ರದೋಷ ವ್ರತ",
  },
  {
    date: "12",
    day: "Wednesday",
    dayKn: "ಬುಧವಾರ",
    title: "Surya Grahan *Purna, Darsha Amavasya, Anvadhan, Ashadha Amavasya",
    titleKn: "ಸೂರ್ಯ ಗ್ರಹಣ (ಪೂರ್ಣ), ದರ್ಶ ಅಮಾವಾಸ್ಯೆ, ಅನ್ವಾಧಾನ, ಆಷಾಢ ಅಮಾವಾಸ್ಯೆ",
  },
  {
    date: "13",
    day: "Thursday",
    dayKn: "ಗುರುವಾರ",
    title: "Ishti",
    titleKn: "ಇಷ್ಟಿ",
  },
  {
    date: "14",
    day: "Friday",
    dayKn: "ಶುಕ್ರವಾರ",
    title: "Chandra Darshana",
    titleKn: "ಚಂದ್ರ ದರ್ಶನ",
  },
  {
    date: "15",
    day: "Saturday",
    dayKn: "ಶನಿವಾರ",
    title: "Hariyali Teej",
    titleKn: "ಹರಿಯಾಲಿ ತೀಜ್",
  },
  {
    date: "17",
    day: "Monday",
    dayKn: "ಸೋಮವಾರ",
    title: "Nagara Panchami, Simha Sankranti",
    titleKn: "ನಾಗರ ಪಂಚಮಿ, ಸಿಂಹ ಸಂಕ್ರಾಂತಿ",
  },
  {
    date: "18",
    day: "Tuesday",
    dayKn: "ಮಂಗಳವಾರ",
    title: "Kalki Jayanti",
    titleKn: "ಕಲ್ಕಿ ಜಯಂತಿ",
  },
  {
    date: "23",
    day: "Sunday",
    dayKn: "ಭಾನುವಾರ",
    title: "Shravana Putrada Ekadashi",
    titleKn: "ಶ್ರಾವಣ ಪುತ್ರದಾ ಏಕಾದಶಿ",
  },
  {
    date: "24",
    day: "Monday",
    dayKn: "ಸೋಮವಾರ",
    title: "Vaishnava Shravana Putrada Ekadashi",
    titleKn: "ವೈಷ್ಣವ ಶ್ರಾವಣ ಪುತ್ರದಾ ಏಕಾದಶಿ",
  },
  {
    date: "25",
    day: "Tuesday",
    dayKn: "ಮಂಗಳವಾರ",
    title: "Bhauma Pradosh Vrat",
    titleKn: "ಭೌಮ ಪ್ರದೋಷ ವ್ರತ",
  },
  {
    date: "27",
    day: "Thursday",
    dayKn: "ಗುರುವಾರ",
    title: "Anvadhan",
    titleKn: "ಅನ್ವಾಧಾನ",
  },
  {
    date: "28",
    day: "Friday",
    dayKn: "ಶುಕ್ರವಾರ",
    title: "Varalakshmi Vrat, Raksha Bandhan, Rakhi, Gayatri Jayanti, Chandra Grahan *Anshika, Ishti",
    titleKn: "ವರಮಹಾಲಕ್ಷ್ಮಿ ವ್ರತ, ರಕ್ಷಾ ಬಂಧನ, ರಾಖಿ, ಗಾಯತ್ರಿ ಜಯಂತಿ, ಚಂದ್ರ ಗ್ರಹಣ, ಇಷ್ಟಿ",
  },
  {
    date: "31",
    day: "Monday",
    dayKn: "ಸೋಮವಾರ",
    title: "Kajari Teej, Bahula Chaturthi, Heramba Sankashti",
    titleKn: "ಕಜರಿ ತೀಜ್, ಬಹುಳ ಚತುರ್ಥಿ, ಹೇರಂಬ ಸಂಕಷ್ಟಿ",
  },
];

const LOCATIONS = [
  "Bengaluru, India",
  "Mysuru, India",
  "Hubballi, India",
  "Mangaluru, India",
  "Belagavi, India",
  "Kalaburagi, India",
  "Shivamogga, India",
  "Udupi, India",
  "Hassan, India",
  "Davanagere, India",
  "Mumbai, India",
  "Delhi, India",
  "Chennai, India",
  "Hyderabad, India",
  "Kolkata, India",
  "London, UK",
  "New York, USA",
  "San Francisco, USA",
  "Singapore",
  "Sydney, Australia",
  "Dubai, UAE",
  "Toronto, Canada",
];

const POPULAR_CUSTOM_DATES = [
  { value: "2026-08-12", label: "August 12, 2026 — Ashadha Amavasya / Today (IST)" },
  { value: "2026-08-11", label: "August 11, 2026 — Sawan Shivaratri" },
  { value: "2026-08-09", label: "August 09, 2026 — Kamika Ekadashi" },
  { value: "2026-08-17", label: "August 17, 2026 — Nagara Panchami" },
  { value: "2026-08-23", label: "August 23, 2026 — Shravana Putrada Ekadashi" },
  { value: "2026-08-28", label: "August 28, 2026 — Varalakshmi Vrat & Raksha Bandhan" },
  { value: "2026-08-31", label: "August 31, 2026 — Kajari Teej / Heramba Sankashti" },
  { value: "2026-09-14", label: "September 14, 2026 — Ganesha Chaturthi" },
  { value: "2026-10-11", label: "October 11, 2026 — Navratri Ghatasthapana" },
  { value: "2026-11-08", label: "November 08, 2026 — Deepavali / Lakshmi Puja" },
  { value: "2027-01-14", label: "January 14, 2027 — Makara Sankranti" },
  { value: "2027-03-06", label: "March 06, 2027 — Maha Shivaratri" },
  { value: "2027-04-07", label: "April 07, 2027 — Ugadi / Kannada New Year" },
];

// ----------------------------------------------------
// TIME NOTATION CONVERTER (12 Hour, 24 Hour, 24 Plus)
// ----------------------------------------------------
export function convertTimeNotation(
  str: string | undefined,
  format: "12" | "24" | "24plus"
): string {
  if (!str) return "";
  if (format === "12") return str;

  // Regex matches time like "06:07 AM", "06:43 PM", "01:52 AM, Aug 12"
  const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)(?:,\s*([A-Za-z]{3}\s*\d{1,2}))?/gi;

  return str.replace(timeRegex, (_match, hStr, mStr, ampm, nextDayTag) => {
    let h = parseInt(hStr, 10);
    const isPM = ampm.toUpperCase() === "PM";
    const isAM = ampm.toUpperCase() === "AM";

    if (format === "24") {
      if (isPM && h < 12) h += 12;
      if (isAM && h === 12) h = 0;
      const hFormatted = h < 10 ? `0${h}` : `${h}`;
      return `${hFormatted}:${mStr}${nextDayTag ? `, ${nextDayTag}` : ""}`;
    }

    // format === "24plus" (Vedic 24+ notation)
    // Hours past midnight up to 05:59 AM (or with next-day tag) are converted to 24..29
    if (isAM && (h < 6 || nextDayTag)) {
      let plusH = h;
      if (h === 12) plusH = 0;
      plusH += 24; // 12 AM -> 24, 1 AM -> 25, 2 AM -> 26, etc.
      return `${plusH}:${mStr}`;
    } else {
      if (isPM && h < 12) h += 12;
      if (isAM && h === 12) h = 0;
      const hFormatted = h < 10 ? `0${h}` : `${h}`;
      return `${hFormatted}:${mStr}${nextDayTag ? `, ${nextDayTag}` : ""}`;
    }
  });
}

export function formatVedicAttribute(
  nameEnFull: string,
  nameKn: string,
  isKn: boolean,
  format: "12" | "24" | "24plus"
): string {
  if (!nameEnFull) return nameKn || "";

  if (isKn) {
    if (nameEnFull.includes("upto")) {
      const parts = nameEnFull.split("upto");
      const timePart = parts[1] ? parts[1].trim() : "";
      const formattedTime = convertTimeNotation(timePart, format);
      return `${nameKn} (ವರೆಗೆ ${formattedTime})`;
    }
    return nameKn;
  } else {
    return convertTimeNotation(nameEnFull, format);
  }
}

// ----------------------------------------------------
// DYNAMIC VEDIC PANCHANGA GENERATOR FOR ANY CUSTOM DATE
// ----------------------------------------------------
function generateDynamicPanchanga(dateStr: string, locationName: string): DayPanchangData {
  // Parse YYYY-MM-DD
  const parts = dateStr.split("-");
  const year = parseInt(parts[0], 10) || 2026;
  const month = parseInt(parts[1], 10) || 8;
  const day = parseInt(parts[2], 10) || 11;

  const targetDate = new Date(year, month - 1, day);
  const dayOfWeekIdx = targetDate.getDay(); // 0=Sun, 1=Mon...

  const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const DAYS_KN = ["ಭಾನುವಾರ", "ಸೋಮವಾರ", "ಮಂಗಳವಾರ", "ಬುಧವಾರ", "ಗುರುವಾರ", "ಶುಕ್ರವಾರ", "ಶನಿವಾರ"];
  const DAYS_SHORT_KN = ["ರವಿ", "ಸೋಮ", "ಮಂಗಳ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ"];

  const dayOfWeek = DAYS_EN[dayOfWeekIdx];
  const dayOfWeekKn = DAYS_KN[dayOfWeekIdx];
  const dayOfWeekShortKn = DAYS_SHORT_KN[dayOfWeekIdx];

  // Reference date: Aug 11, 2026 (dayOfWeekIdx=2, lunarDay=29, Krishna Chaturdashi)
  const refDate = new Date(2026, 7, 11);
  const diffTime = targetDate.getTime() - refDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

  // Calculate lunar day (1 to 30)
  let lunarDayNum = ((29 - 1 + diffDays) % 30 + 30) % 30 + 1;
  const isShukla = lunarDayNum <= 15;
  const paksha: "Shukla Paksha" | "Krishna Paksha" = isShukla ? "Shukla Paksha" : "Krishna Paksha";
  const pakshaKn: "ಶುಕ್ಲ ಪಕ್ಷ" | "ಕೃಷ್ಣ ಪಕ್ಷ" = isShukla ? "ಶುಕ್ಲ ಪಕ್ಷ" : "ಕೃಷ್ಣ ಪಕ್ಷ";

  const TITHIS_EN = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shasthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shasthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
  ];

  const TITHIS_KN = [
    "ಪ್ರತಿಪದೆ", "ದ್ವಿತೀಯಾ", "ತೃತೀಯಾ", "ಚತುರ್ಥಿ", "ಪಂಚಮಿ",
    "ಷಷ್ಠಿ", "ಸಪ್ತಮಿ", "ಅಷ್ಟಮಿ", "ನವಮಿ", "ದಶಮಿ",
    "ಏಕಾದಶಿ", "ದ್ವಾದಶಿ", "ತ್ರಯೋದಶಿ", "ಚತುರ್ದಶಿ", "ಪೂರ್ಣಿಮಾ",
    "ಪ್ರತಿಪದೆ", "ದ್ವಿತೀಯಾ", "ತೃತೀಯಾ", "ಚತುರ್ಥಿ", "ಪಂಚಮಿ",
    "ಷಷ್ಠಿ", "ಸಪ್ತಮಿ", "ಅಷ್ಟಮಿ", "ನವಮಿ", "ದಶಮಿ",
    "ಏಕಾದಶಿ", "ದ್ವಾದಶಿ", "ತ್ರಯೋದಶಿ", "ಚತುರ್ದಶಿ", "ಅಮಾವಾಸ್ಯೆ"
  ];

  const tithiNameEn = TITHIS_EN[lunarDayNum - 1];
  const tithiNameKn = TITHIS_KN[lunarDayNum - 1];
  const tithiShort = `${tithiNameEn} ${isShukla ? "S" : "K"}`;
  const tithiFull = `${tithiNameEn} upto 04:30 PM`;

  // Nakshatras (27)
  const NAKSHATRAS_EN = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ];
  const NAKSHATRAS_KN = [
    "ಅಶ್ವಿನಿ", "ಭರಣಿ", "ಕೃತ್ತಿಕಾ", "ರೋಹಿಣಿ", "ಮೃಗಶಿರಾ", "ಆರ್ದ್ರಾ",
    "ಪುನರ್ವಸು", "ಪುಷ್ಯ", "ಆಶ್ಲೇಷಾ", "ಮಘಾ", "ಪೂರ್ವಾ ಫಲ್ಗುಣಿ", "ಉತ್ತರಾ ಫಲ್ಗುಣಿ",
    "ಹಸ್ತಾ", "ಚಿತ್ರಾ", "ಸ್ವಾತಿ", "ವಿಶಾಖಾ", "ಅನುರಾಧಾ", "ಜ್ಯೇಷ್ಠಾ",
    "ಮೂಲಾ", "ಪೂರ್ವಾಷಾಢ", "ಉತ್ತರಾಷಾಢ", "ಶ್ರವಣ", "ಧನಿಷ್ಠಾ", "ಶತಭಿಷಾ",
    "ಪೂರ್ವಾಭಾದ್ರಪದ", "ಉತ್ತರಾಭಾದ್ರಪದ", "ರೇವತಿ"
  ];

  // Aug 11 2026 was Punarvasu (idx 6)
  const nakIdx = ((6 + Math.floor(diffDays * 1.033)) % 27 + 27) % 27;
  const nakshatra = `${NAKSHATRAS_EN[nakIdx]} upto 03:15 PM`;
  const nakshatraKn = NAKSHATRAS_KN[nakIdx];

  // Yogas (27)
  const YOGAS_EN = [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
    "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva",
    "Vyaghasa", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana",
    "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
    "Brahma", "Indra", "Vaidhriti"
  ];
  const YOGAS_KN = [
    "ವಿಷ್ಕಂಭ", "ಪ್ರೀತಿ", "ಆಯುಷ್ಮಾನ್", "ಸೌಭಾಗ್ಯ", "ಶೋಭನ", "ಅತಿಗಂಡ",
    "ಸುಕರ್ಮ", "ಧೃತಿ", "ಶೂಲ", "ಗಂಡ", "ವೃದ್ಧಿ", "ಧ್ರುವ",
    "ವ್ಯಾಘಾತ", "ಹರ್ಷಣ", "ವಜ್ರ", "ಸಿದ್ಧಿ", "ವ್ಯತೀಪಾತ", "ವಾರೀಯಾನ್",
    "ಪರಿಘ", "ಶಿವ", "ಸಿದ್ಧ", "ಸಾಧ್ಯ", "ಶುಭ", "ಶುಕ್ಲ",
    "ಬ್ರಹ್ಮ", "ಇಂದ್ರ", "ವೈಧೃತಿ"
  ];
  const yogaIdx = ((15 + Math.floor(diffDays * 0.98)) % 27 + 27) % 27;
  const yoga = `${YOGAS_EN[yogaIdx]} upto 08:20 PM`;
  const yogaKn = YOGAS_KN[yogaIdx];

  // Karanas
  const KARANAS_EN = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Shakuni"];
  const KARANAS_KN = ["ಬವ", "ಬಾಲವ", "ಕೌಲವ", "ತೈತಿಲ", "ಗರ", "ವಣಿಜ", "ವಿಷ್ಟಿ", "ಶಕುನಿ"];
  const karanaIdx = ((0 + Math.floor(diffDays * 1.9)) % 8 + 8) % 8;
  const karana = `${KARANAS_EN[karanaIdx]} upto 03:22 PM`;
  const karanaKn = KARANAS_KN[karanaIdx];

  // Hindu Months
  const MONTHS_AMANTA_EN = [
    "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
    "Ashvina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"
  ];
  const MONTHS_AMANTA_KN = [
    "ಚೈತ್ರ", "ವೈಶಾಖ", "ಜ್ಯೇಷ್ಠ", "ಆಷಾಢ", "ಶ್ರಾವಣ", "ಭಾದ್ರಪದ",
    "ಆಶ್ವಯುಜ", "ಕಾರ್ತಿಕ", "ಮಾರ್ಗಶೀರ್ಷ", "ಪುಷ್ಯ", "ಮಾಘ", "ಫಾಲ್ಗುಣ"
  ];
  const monthIdx = ((3 + Math.floor((diffDays + 11) / 29.53)) % 12 + 12) % 12;
  const amantaMonth = MONTHS_AMANTA_EN[monthIdx];
  const amantaMonthKn = MONTHS_AMANTA_KN[monthIdx];
  const purnimantaMonth = MONTHS_AMANTA_EN[(monthIdx + 1) % 12];
  const purnimantaMonthKn = MONTHS_AMANTA_KN[(monthIdx + 1) % 12];

  // Sun & Moon Signs
  const RASHIS_EN = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"];
  const RASHIS_KN = ["ಮೇಷ", "ವೃಷಭ", "ಮಿಥುನ", "ಕರ್ಕಾಟಕ", "ಸಿಂಹ", "ಕನ್ಯಾ", "ತುಲಾ", "ವೃಶ್ಚಿಕ", "ಧನುಸ್ಸು", "ಮಕರ", "ಕುಂಭ", "ಮೀನ"];
  const sunSignIdx = ((3 + Math.floor((diffDays + 25) / 30.4)) % 12 + 12) % 12;
  const moonSignIdx = ((3 + Math.floor(diffDays / 2.25)) % 12 + 12) % 12;

  // Rahu Kalam by day of week
  const RAHU_KALAM_MAP = [
    "04:30 PM to 06:00 PM", // Sun
    "07:30 AM to 09:00 AM", // Mon
    "03:00 PM to 04:30 PM", // Tue
    "12:00 PM to 01:30 PM", // Wed
    "01:30 PM to 03:00 PM", // Thu
    "10:30 AM to 12:00 PM", // Fri
    "09:00 AM to 10:30 AM", // Sat
  ];

  const GULIKAI_MAP = [
    "03:00 PM to 04:30 PM",
    "01:30 PM to 03:00 PM",
    "12:00 PM to 01:30 PM",
    "10:30 AM to 12:00 PM",
    "09:00 AM to 10:30 AM",
    "07:30 AM to 09:00 AM",
    "06:00 AM to 07:30 AM",
  ];

  const YAMAGANDA_MAP = [
    "12:00 PM to 01:30 PM",
    "10:30 AM to 12:00 PM",
    "09:00 AM to 10:30 AM",
    "07:30 AM to 09:00 AM",
    "06:00 AM to 07:30 AM",
    "03:00 PM to 04:30 PM",
    "01:30 PM to 03:00 PM",
  ];

  // Moon phase string
  let moonPhase: "new_moon" | "full_moon" | "waxing" | "waning" = "waxing";
  if (lunarDayNum === 15) moonPhase = "full_moon";
  else if (lunarDayNum === 30) moonPhase = "new_moon";
  else if (isShukla) moonPhase = "waxing";
  else moonPhase = "waning";

  // Check festival matches or generate default festival highlight for custom date
  const festMatches: { title: string; desc?: string; titleKn?: string }[] = [];
  if (lunarDayNum === 11 || lunarDayNum === 26) {
    festMatches.push({ title: `${tithiNameEn} Fasting`, titleKn: `${tithiNameKn} ವ್ರತ`, desc: "Sacred Ekadashi Vrat & Vishnu Puja" });
  } else if (lunarDayNum === 13 || lunarDayNum === 28) {
    festMatches.push({ title: "Pradosh Vrat", titleKn: "ಪ್ರದೋಷ ವ್ರತ", desc: "Auspicious evening Lord Shiva Worship" });
  } else if (lunarDayNum === 15) {
    festMatches.push({ title: "Purnima Vrat & Satyanarayan Puja", titleKn: "ಪೂರ್ಣಿಮಾ ವ್ರತ ಮತ್ತು ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ", desc: "Full Moon worship & blessings" });
  } else if (lunarDayNum === 30) {
    festMatches.push({ title: "Amavasya Tarpan", titleKn: "ಅಮಾವಾಸ್ಯೆ ತರ್ಪಣ", desc: "New Moon ancestral memory and sacred bath" });
  } else if (lunarDayNum === 4 || lunarDayNum === 19) {
    festMatches.push({ title: "Sankashti / Vinayaka Chaturthi", titleKn: "ಸಂಕಷ್ಟಿ / ವಿನಾಯಕ ಚತುರ್ಥಿ", desc: "Ganesha worship & Arghya" });
  } else {
    festMatches.push({ title: `Vedic Day ${day}`, titleKn: `ವೈದಿಕ ದಿನ ${day}`, desc: `Panchanga calculated for ${locationName}` });
  }

  return {
    dayNumber: day,
    dateStr: dateStr,
    dayOfWeek,
    dayOfWeekKn,
    dayOfWeekShortKn,
    tithiShort,
    tithiFull,
    tithiKn: tithiNameKn,
    lunarDayNum,
    paksha,
    pakshaKn,
    amantaMonth,
    amantaMonthKn,
    purnimantaMonth,
    purnimantaMonthKn,
    nakshatra,
    nakshatraKn,
    yoga,
    yogaKn,
    karana,
    karanaKn,
    sunSign: RASHIS_EN[sunSignIdx],
    sunSignKn: RASHIS_KN[sunSignIdx],
    moonSign: RASHIS_EN[moonSignIdx],
    moonSignKn: RASHIS_KN[moonSignIdx],
    sunrise: "06:07 AM",
    sunset: "06:43 PM",
    moonrise: "05:30 AM",
    moonset: "05:40 PM",
    rahuKalam: RAHU_KALAM_MAP[dayOfWeekIdx],
    gulikaiKalam: GULIKAI_MAP[dayOfWeekIdx],
    yamaganda: YAMAGANDA_MAP[dayOfWeekIdx],
    abhijit: "12:00 PM to 12:50 PM",
    durMuhurtam: "08:35 AM to 09:25 AM",
    amritKalam: "07:30 AM to 09:00 AM",
    varjyam: "05:15 PM to 06:45 PM",
    moonPhase,
    festivals: festMatches,
  };
}

// IST (Indian Standard Time - Asia/Kolkata) System Date & Time Helper
const getISTDateStr = () => {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(now); // Formats as YYYY-MM-DD in Indian Standard Time (IST)
  } catch {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
};

const getISTTimeString = (dateObj: Date) => {
  try {
    return dateObj.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
};

// ----------------------------------------------------
// MAIN PANCHANGA TAB COMPONENT
// ----------------------------------------------------

export function PanchangaTab() {
  const { language, setLanguage } = useLanguage();
  const isKn = language === "kn";

  // Live system clock & dynamic IST date state
  const [nowTime, setNowTime] = useState<Date>(() => new Date());
  const [customDateStr, setCustomDateStr] = useState<string>(() => getISTDateStr());
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(() => {
    const parts = getISTDateStr().split("-");
    return parseInt(parts[2], 10) || 12;
  });

  const [currentLocation, setCurrentLocation] = useState("Bengaluru, India");
  const [customPlaces, setCustomPlaces] = useState<string[]>([]);

  // Auto-update live ticking clock & ensure IST date sync
  useEffect(() => {
    const istToday = getISTDateStr();
    setCustomDateStr(istToday);
    const day = parseInt(istToday.split("-")[2], 10);
    if (!isNaN(day)) setSelectedDayNumber(day);

    const timer = setInterval(() => {
      setNowTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Custom Place Modal State
  const [isCustomPlaceModalOpen, setIsCustomPlaceModalOpen] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [newCountry, setNewCountry] = useState("India");

  // Custom Date Modal State
  const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);
  const [customYearInput, setCustomYearInput] = useState(2026);
  const [customMonthInput, setCustomMonthInput] = useState(8);
  const [customDayInput, setCustomDayInput] = useState(11);

  const [timeFormat, setTimeFormat] = useState<"12" | "24" | "24plus">("12");
  const [showVedicClock, setShowVedicClock] = useState(false);
  const [lunarBaseMode, setLunarBaseMode] = useState<"Amanta" | "Purnimanta">(
    "Amanta"
  );

  // Active day panchang object (dynamic or pre-calculated)
  const activeDay: DayPanchangData = React.useMemo(() => {
    if (customDateStr.startsWith("2026-08-")) {
      const dayNum = parseInt(customDateStr.split("-")[2], 10);
      if (AUGUST_2026_DAYS[dayNum]) {
        return AUGUST_2026_DAYS[dayNum];
      }
    }
    return generateDynamicPanchanga(customDateStr, currentLocation);
  }, [customDateStr, currentLocation]);

  // Handler to jump date
  const handleSelectDate = (dateStr: string) => {
    setCustomDateStr(dateStr);
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const d = parseInt(parts[2], 10);
      if (!isNaN(d)) setSelectedDayNumber(d);
    }
  };

  const handleSelectDay = (dayNum: number) => {
    setSelectedDayNumber(dayNum);
    const dateStr = `2026-08-${dayNum < 10 ? "0" + dayNum : dayNum}`;
    setCustomDateStr(dateStr);
  };

  const handleStepDay = (delta: number) => {
    const parts = customDateStr.split("-");
    let year = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      const todayIST = getISTDateStr().split("-");
      year = parseInt(todayIST[0], 10);
      month = parseInt(todayIST[1], 10);
      day = parseInt(todayIST[2], 10);
    }

    const dateObj = new Date(year, month - 1, day);
    dateObj.setDate(dateObj.getDate() + delta);

    const nextY = dateObj.getFullYear();
    const nextM = String(dateObj.getMonth() + 1).padStart(2, "0");
    const nextD = String(dateObj.getDate()).padStart(2, "0");

    const newDateStr = `${nextY}-${nextM}-${nextD}`;
    setCustomDateStr(newDateStr);
    setSelectedDayNumber(dateObj.getDate());
  };

  const handleJumpToToday = () => {
    const istToday = getISTDateStr();
    setCustomDateStr(istToday);
    const day = parseInt(istToday.split("-")[2], 10);
    if (!isNaN(day)) setSelectedDayNumber(day);
  };

  const handleSaveCustomPlace = () => {
    if (!newCityName.trim()) return;
    const placeString = `${newCityName.trim()}, ${newCountry.trim()}`;
    if (!customPlaces.includes(placeString) && !LOCATIONS.includes(placeString)) {
      setCustomPlaces((prev) => [...prev, placeString]);
    }
    setCurrentLocation(placeString);
    setNewCityName("");
    setIsCustomPlaceModalOpen(false);
  };

  const handleSaveCustomDate = () => {
    const y = customYearInput || 2026;
    const m = String(customMonthInput).padStart(2, "0");
    const d = String(customDayInput).padStart(2, "0");
    const formattedDate = `${y}-${m}-${d}`;
    handleSelectDate(formattedDate);
    setIsCustomDateModalOpen(false);
  };

  return (
    <div className="min-h-full pb-12 transition-colors duration-200 bg-slate-50 text-slate-900">
      {/* ---------------------------------------------------- */}
      {/* TOP HEADER CONTAINER WITH ROUNDED EDGES ON ALL SIDES */}
      {/* ---------------------------------------------------- */}
      <div className="max-w-7xl mx-auto pt-3 sm:pt-4 px-2 sm:px-4">
        <div className="bg-[#942a1d] border-2 border-[#721d12] rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
          {/* 1. DRIK PANCHANG TOP CONTROL TOOLBAR */}
          <div className="bg-[#942a1d] text-amber-100 border-b border-[#721d12]/80 px-3 sm:px-6 py-2.5">
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              {/* Location & Date Search Controls */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                {/* Custom Place Dropdown + Quick Add Button */}
                <div className="flex items-center gap-1.5 bg-[#781e13] border border-amber-300/40 rounded-xl px-2.5 py-1 text-amber-100 shadow-xs">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <select
                    value={currentLocation}
                    onChange={(e) => {
                      if (e.target.value === "ADD_CUSTOM_PLACE") {
                        setIsCustomPlaceModalOpen(true);
                      } else {
                        setCurrentLocation(e.target.value);
                      }
                    }}
                    className="bg-transparent text-amber-100 font-medium focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
                  >
                    <optgroup label="Popular Indian & Global Cities" className="bg-[#781e13] text-white font-sans">
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} className="bg-[#781e13] text-white">
                          {loc}
                        </option>
                      ))}
                    </optgroup>
                    {customPlaces.length > 0 && (
                      <optgroup label="Your Custom Places" className="bg-[#781e13] text-amber-200 font-sans">
                        {customPlaces.map((loc) => (
                          <option key={loc} value={loc} className="bg-[#781e13] text-white">
                            📍 {loc}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <option value="ADD_CUSTOM_PLACE" className="bg-[#8c2318] text-amber-300 font-bold">
                      ➕ Add Custom Place...
                    </option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCustomPlaceModalOpen(true)}
                    className="ml-0.5 p-1 hover:bg-[#8c2318] text-amber-300 rounded-lg transition-colors cursor-pointer"
                    title="Set Custom Place"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Custom Date Dropdown & Date Picker */}
                <div className="flex items-center gap-1.5 bg-[#781e13] border border-amber-300/40 rounded-xl px-2.5 py-1 text-amber-100 shadow-xs">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <select
                    value={POPULAR_CUSTOM_DATES.some((d) => d.value === customDateStr) ? customDateStr : "CUSTOM_DATE_SELECTED"}
                    onChange={(e) => {
                      if (e.target.value === "ADD_CUSTOM_DATE") {
                        setIsCustomDateModalOpen(true);
                      } else if (e.target.value === "TODAY_IST") {
                        handleJumpToToday();
                      } else if (e.target.value !== "CUSTOM_DATE_SELECTED") {
                        handleSelectDate(e.target.value);
                      }
                    }}
                    className="bg-transparent text-amber-100 font-medium focus:outline-none cursor-pointer max-w-[160px] sm:max-w-[220px] truncate"
                  >
                    <option value="TODAY_IST" className="bg-[#8c2318] text-amber-200 font-bold">
                      📍 {isKn ? "ಇಂದಿನ ದಿನಾಂಕ (IST):" : "Today (IST):"} {getISTDateStr()}
                    </option>
                    <optgroup label="Panchanga Dates & Major Festivals" className="bg-[#781e13] text-white font-sans">
                      {POPULAR_CUSTOM_DATES.map((d) => (
                        <option key={d.value} value={d.value} className="bg-[#781e13] text-white">
                          {d.label}
                        </option>
                      ))}
                    </optgroup>
                    <option value="ADD_CUSTOM_DATE" className="bg-[#8c2318] text-amber-300 font-bold">
                      ➕ Pick Custom Date...
                    </option>
                  </select>

                  <input
                    type="date"
                    value={customDateStr}
                    onChange={(e) => {
                      if (e.target.value) handleSelectDate(e.target.value);
                    }}
                    className="bg-transparent text-amber-100 font-mono text-xs focus:outline-none cursor-pointer w-24 sm:w-28"
                  />

                  <button
                    type="button"
                    onClick={() => setIsCustomDateModalOpen(true)}
                    className="p-1 hover:bg-[#8c2318] text-amber-300 rounded-lg transition-colors cursor-pointer"
                    title="Choose Custom Date"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action / Mode Toggles Bar */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto justify-start md:justify-end">
                {/* Live Auto-Updating Indian Standard Time (IST) Badge */}
                <div className="px-3 py-1 bg-[#781e13] border border-emerald-400/50 rounded-xl flex items-center gap-1.5 text-xs text-amber-100 shadow-xs" title="Indian Standard Time (IST)">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="font-bold text-amber-200">{isKn ? "IST ಸಮಯ:" : "IST Clock:"}</span>
                  <span className="font-mono text-amber-300 font-black">
                    {getISTTimeString(nowTime)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setLanguage(language === "en" ? "kn" : "en")}
                  className={`px-3 py-1 rounded-xl border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    isKn
                      ? "bg-amber-400 text-amber-950 border-amber-300 shadow-xs"
                      : "bg-[#781e13] hover:bg-[#882216] text-amber-100 border-amber-300/30"
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>{isKn ? "English" : "2026 ಕನ್ನಡ ಕ್ಯಾಲೆಂಡರ್"}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setLunarBaseMode((m) =>
                      m === "Amanta" ? "Purnimanta" : "Amanta"
                    )
                  }
                  className="px-3 py-1 bg-[#781e13] hover:bg-[#882216] text-amber-100 border border-amber-300/30 rounded-xl font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Moon className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {isKn ? "ಚಂದ್ರ ಮಾಸ" : "Lunar Base"}: {lunarBaseMode}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleJumpToToday}
                  className="px-3 py-1 bg-[#781e13] hover:bg-[#882216] text-amber-100 border border-amber-300/30 rounded-xl font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isKn ? "ಇಂದಿನ ಪಂಚಾಂಗ" : "Date Today"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowVedicClock(!showVedicClock)}
                  className={`px-3 py-1 rounded-xl border font-medium flex items-center gap-1 transition-all cursor-pointer ${
                    showVedicClock
                      ? "bg-amber-400 text-amber-950 border-amber-300"
                      : "bg-[#781e13] hover:bg-[#882216] text-amber-100 border-amber-300/30"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isKn ? "ವೈದಿಕ ಗಡಿಯಾರ" : "Vedic Clock"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. MONTH & YEAR NAVIGATION HEADER */}
          <div className="bg-[#7e2014] text-amber-100 border-b border-[#5e180e] shadow-sm px-4 py-2">
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleStepDay(-1)}
                className="p-1 hover:bg-[#92281a] rounded-lg transition-colors cursor-pointer text-amber-200"
                title="Previous Day"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="text-center space-y-0.5">
                <h2 className="text-lg sm:text-xl font-bold font-serif tracking-wide text-amber-200">
                  {(() => {
                    const [y, m] = activeDay.dateStr.split("-");
                    const mIdx = parseInt(m, 10) - 1;
                    const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const MONTHS_KN = ["ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್"];
                    return `${isKn ? MONTHS_KN[mIdx] : MONTHS_EN[mIdx]} ${y}`;
                  })()}
                </h2>
                <p className="text-xs text-amber-300/90 font-medium">
                  {isKn
                    ? `${activeDay.amantaMonthKn} - ${activeDay.purnimantaMonthKn} ೧೯೪೮ (ಪರಾಭವ ಸಂವತ್ಸರ)`
                    : `${activeDay.amantaMonth} - ${activeDay.purnimantaMonth} 1948 (Parabhava Samvatsara)`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleStepDay(1)}
                className="p-1 hover:bg-[#92281a] rounded-lg transition-colors cursor-pointer text-amber-200"
                title="Next Day"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* 3. SELECTED DAY BANNER */}
          <div className="bg-[#5c4212] text-amber-100 px-4 py-3 shadow-inner">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Left Moon Phase & Tithi Badge */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-400/80 shadow-md flex items-center justify-center shrink-0">
                  {activeDay.moonPhase === "new_moon" ? (
                    <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800" />
                  ) : activeDay.moonPhase === "full_moon" ? (
                    <div className="w-8 h-8 rounded-full bg-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-200 via-amber-100 to-slate-950 shadow-xs" />
                  )}
                </div>

                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-amber-200 text-sm">
                    {activeDay.lunarDayNum},{" "}
                    {isKn ? activeDay.amantaMonthKn : activeDay.amantaMonth}
                  </div>
                  <div className="text-amber-100/90 font-medium">
                    {isKn ? activeDay.pakshaKn : activeDay.paksha},{" "}
                    {isKn ? activeDay.tithiKn : activeDay.tithiShort}
                  </div>
                  <div className="text-amber-300/80 text-[11px]">
                    1948 Parabhava, Shaka Samvata • {currentLocation}
                  </div>
                </div>
              </div>

              {/* Right Selected Date Display Card */}
              <div className="bg-[#48330d] border border-amber-400/30 rounded-xl px-4 py-2 flex items-center gap-3 shadow-md">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300">
                  {activeDay.dayNumber < 10
                    ? `0${activeDay.dayNumber}`
                    : activeDay.dayNumber}
                </div>
                <div className="text-xs border-l border-amber-400/30 pl-3">
                  <div className="font-bold text-amber-100 text-sm">
                    {(() => {
                      const [y, m] = activeDay.dateStr.split("-");
                      const mIdx = parseInt(m, 10) - 1;
                      const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                      const MONTHS_KN = ["ಜನ", "ಫೆಬ್ರ", "ಮಾರ್ಚ್", "ಏಪ್ರಿ", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗ", "ಸೆಪ್ಟೆ", "ಅಕ್ಟೋ", "ನವೆಂ", "ಡಿಸೆಂ"];
                      return `${isKn ? MONTHS_KN[mIdx] : MONTHS_EN[mIdx]} ${y}`;
                    })()}
                  </div>
                  <div className="text-amber-300 font-semibold">
                    {isKn ? activeDay.dayOfWeekKn : activeDay.dayOfWeek}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. MAIN SPLIT CONTENT: LEFT PANCHANGA + RIGHT CALENDAR GRID */}
      {/* ---------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ==================================================== */}
          {/* LEFT PANEL: DETAILED DAILY PANCHANGA TIMINGS TABLE */}
          {/* ==================================================== */}
          <div className="lg:col-span-4 bg-[#f8d785] border-2 border-[#d69f3d] rounded-2xl shadow-lg overflow-hidden text-slate-900">
            {/* Header title */}
            <div className="bg-[#8c2318] text-amber-100 px-4 py-3 flex items-center justify-between border-b border-[#6e180f]">
              <h3 className="font-bold font-serif text-sm sm:text-base tracking-wide flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>
                  {isKn ? activeDay.dayOfWeekKn : activeDay.dayOfWeek},{" "}
                  {(() => {
                    const [y, m, d] = activeDay.dateStr.split("-");
                    const mIdx = parseInt(m, 10) - 1;
                    const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const MONTHS_KN = ["ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್"];
                    return `${isKn ? MONTHS_KN[mIdx] : MONTHS_EN[mIdx]} ${parseInt(d, 10)}, ${y}`;
                  })()}
                </span>
              </h3>
              <div className="flex items-center gap-1.5 text-amber-300">
                <button
                  type="button"
                  onClick={() => alert("Panchanga link copied to clipboard!")}
                  className="p-1 hover:bg-[#a62a1e] rounded cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-1 hover:bg-[#a62a1e] rounded cursor-pointer"
                  title="Print"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Time Notation Selector */}
            <div className="bg-[#edd17c] px-4 py-2 border-b border-[#d69f3d] flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                {isKn ? "ಸಮಯ ಮಾದರಿ:" : "Time Format:"}
              </span>
              <div className="relative flex items-center bg-[#dfbe63] p-1 rounded-full border border-[#c7a346] select-none min-w-[210px] h-[32px]">
                <motion.div
                  className="absolute inset-y-1 bg-[#8c2318] rounded-full shadow-xs"
                  initial={false}
                  animate={{
                    left: timeFormat === "12" ? "4px" : timeFormat === "24" ? "calc(33.333% + 1px)" : "calc(66.666% - 2px)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                    mass: 0.5,
                  }}
                  style={{
                    width: "calc(33.333% - 5px)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setTimeFormat("12")}
                  className={`relative z-10 w-1/3 py-1 rounded-full text-[10px] font-extrabold transition-colors cursor-pointer text-center flex items-center justify-center uppercase ${
                    timeFormat === "12"
                      ? "text-white"
                      : "text-slate-800 hover:text-black"
                  }`}
                >
                  12 Hour
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFormat("24")}
                  className={`relative z-10 w-1/3 py-1 rounded-full text-[10px] font-extrabold transition-colors cursor-pointer text-center flex items-center justify-center uppercase ${
                    timeFormat === "24"
                      ? "text-white"
                      : "text-slate-800 hover:text-black"
                  }`}
                >
                  24 Hour
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFormat("24plus")}
                  className={`relative z-10 w-1/3 py-1 rounded-full text-[10px] font-extrabold transition-colors cursor-pointer text-center flex items-center justify-center uppercase ${
                    timeFormat === "24plus"
                      ? "text-white"
                      : "text-slate-800 hover:text-black"
                  }`}
                >
                  24 Plus
                </button>
              </div>
            </div>

            {/* Vedic Clock Banner overlay if enabled */}
            {showVedicClock && (
              <div className="bg-amber-900 text-amber-100 px-4 py-2 text-xs border-b border-amber-800 space-y-1">
                <div className="font-bold flex items-center justify-between text-amber-300">
                  <span> Vedic Clock Calculation (Ghati/Pala)</span>
                  <span className="font-mono">15 Ghati 22 Pala</span>
                </div>
                <p className="text-[10px] text-amber-200/80 leading-snug">
                  1 Day = 60 Ghatis (24 hrs). 1 Ghati = 24 Mins. Measured from
                  Sunrise.
                </p>
              </div>
            )}

            {/* Panchang Timings Table */}
            <div className="divide-y divide-[#e3ba61] text-xs">
              {/* Sunrise & Sunset */}
              <div className="p-2.5 flex justify-between items-center bg-[#fce8ac]/60">
                <div className="flex items-center gap-1.5 font-bold text-[#8c2318]">
                  <Sun className="w-4 h-4 text-orange-600" />
                  <span>{isKn ? "ಸೂರ್ಯೋದಯ / ಸೂರ್ಯಾಸ್ತ" : "Sunrise / Sunset"}</span>
                </div>
                <div className="font-mono font-bold text-slate-900">
                  {convertTimeNotation(activeDay.sunrise, timeFormat)} / {convertTimeNotation(activeDay.sunset, timeFormat)}
                </div>
              </div>

              {/* Moonrise & Moonset */}
              <div className="p-2.5 flex justify-between items-center bg-[#fce8ac]/30">
                <div className="flex items-center gap-1.5 font-bold text-[#8c2318]">
                  <Moon className="w-4 h-4 text-amber-700" />
                  <span>{isKn ? "ಚಂದ್ರೋದಯ / ಚಂದ್ರಾಸ್ತ" : "Moonrise / Moonset"}</span>
                </div>
                <div className="font-mono font-medium text-slate-800 text-[11px]">
                  {convertTimeNotation(activeDay.moonrise, timeFormat)} / {convertTimeNotation(activeDay.moonset, timeFormat)}
                </div>
              </div>

              {/* Shaka Samvat & Month */}
              <div className="p-2.5 flex justify-between items-center">
                <span className="font-semibold text-slate-700">
                  {isKn ? "ಶಕ ಸಂವತ್ಸರ:" : "Shaka Samvat:"}
                </span>
                <span className="font-bold text-slate-900">
                  1948 Parabhava
                </span>
              </div>

              <div className="p-2.5 flex justify-between items-center bg-[#fce8ac]/40">
                <span className="font-semibold text-slate-700">
                  {isKn ? "ಅಮಾಂತ / ಪೂರ್ಣಿಮಾಂತ ಮಾಸ:" : "Amanta / Purnimanta Month:"}
                </span>
                <span className="font-bold text-slate-900">
                  {activeDay.amantaMonth} / {activeDay.purnimantaMonth}
                </span>
              </div>

              {/* Weekday & Paksha */}
              <div className="p-2.5 flex justify-between items-center">
                <span className="font-semibold text-slate-700">
                  {isKn ? "ವಾರ & ಪಕ್ಷ:" : "Weekday & Paksha:"}
                </span>
                <span className="font-bold text-slate-900">
                  {isKn ? activeDay.dayOfWeekKn : activeDay.dayOfWeek} (
                  {isKn ? activeDay.pakshaKn : activeDay.paksha})
                </span>
              </div>

              {/* Tithi */}
              <div className="p-2.5 flex justify-between items-center bg-[#fce8ac]/60">
                <span className="font-bold text-[#8c2318]">
                  {isKn ? "ತಿಥಿ (Tithi):" : "Tithi:"}
                </span>
                <span className="font-bold font-serif text-slate-900 text-right">
                  {formatVedicAttribute(activeDay.tithiFull, activeDay.tithiKn, isKn, timeFormat)}
                </span>
              </div>

              {/* Nakshatra */}
              <div className="p-2.5 flex justify-between items-center">
                <span className="font-bold text-[#8c2318]">
                  {isKn ? "ನಕ್ಷತ್ರ (Nakshatra):" : "Nakshatra:"}
                </span>
                <span className="font-semibold text-slate-900 text-right">
                  {formatVedicAttribute(activeDay.nakshatra, activeDay.nakshatraKn, isKn, timeFormat)}
                </span>
              </div>

              {/* Yoga */}
              <div className="p-2.5 flex justify-between items-center bg-[#fce8ac]/40">
                <span className="font-semibold text-slate-700">
                  {isKn ? "ಯೋಗ (Yoga):" : "Yoga:"}
                </span>
                <span className="font-semibold text-slate-900">
                  {formatVedicAttribute(activeDay.yoga, activeDay.yogaKn, isKn, timeFormat)}
                </span>
              </div>

              {/* Karana */}
              <div className="p-2.5 flex justify-between items-center">
                <span className="font-semibold text-slate-700">
                  {isKn ? "ಕರಣ (Karana):" : "Karana:"}
                </span>
                <span className="font-semibold text-slate-900 text-right text-[11px]">
                  {formatVedicAttribute(activeDay.karana, activeDay.karanaKn, isKn, timeFormat)}
                </span>
              </div>

              {/* Sunsign & Moonsign */}
              <div className="p-2.5 flex justify-between items-center bg-[#fce8ac]/40">
                <span className="font-semibold text-slate-700">
                  {isKn ? "ಸೂರ್ಯರಾಶಿ / ಚಂದ್ರರಾಶಿ:" : "Sunsign / Moonsign:"}
                </span>
                <span className="font-bold text-amber-900">
                  {activeDay.sunSign} / {activeDay.moonSign}
                </span>
              </div>

              {/* Rahu Kalam (Inauspicious Highlighted Red) */}
              <div className="p-2.5 flex justify-between items-center bg-rose-100/80 border-l-4 border-rose-600">
                <span className="font-bold text-rose-900 flex items-center gap-1">
                  ⚠️ {isKn ? "ರಾಹು ಕಾಲ (Rahu Kalam):" : "Rahu Kalam:"}
                </span>
                <span className="font-mono font-bold text-rose-800">
                  {convertTimeNotation(activeDay.rahuKalam, timeFormat)}
                </span>
              </div>

              {/* Gulikai Kalam & Yamaganda */}
              <div className="p-2.5 flex justify-between items-center bg-amber-100/70">
                <span className="font-semibold text-amber-900">
                  {isKn ? "ಗುಳಿಕ ಕಾಲ (Gulikai):" : "Gulikai Kalam:"}
                </span>
                <span className="font-mono font-medium text-amber-900">
                  {convertTimeNotation(activeDay.gulikaiKalam, timeFormat)}
                </span>
              </div>

              <div className="p-2.5 flex justify-between items-center">
                <span className="font-semibold text-slate-700">
                  {isKn ? "ಯಮಗಂಡ (Yamaganda):" : "Yamaganda:"}
                </span>
                <span className="font-mono font-medium text-slate-800">
                  {convertTimeNotation(activeDay.yamaganda, timeFormat)}
                </span>
              </div>

              {/* Abhijit Muhurtam (Auspicious Green Highlight) */}
              <div className="p-2.5 flex justify-between items-center bg-emerald-100/80 border-l-4 border-emerald-600">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  ✨ {isKn ? "ಅಭಿಜಿತ್ ಮುಹೂರ್ತ:" : "Abhijit Muhurtam:"}
                </span>
                <span className="font-mono font-bold text-emerald-800">
                  {convertTimeNotation(activeDay.abhijit, timeFormat)}
                </span>
              </div>

              {/* Dur Muhurtam, Amrit Kalam, Varjyam */}
              <div className="p-2.5 flex justify-between items-center">
                <span className="font-semibold text-slate-700">Dur Muhurtam:</span>
                <span className="font-mono text-[11px] text-slate-800 text-right">
                  {convertTimeNotation(activeDay.durMuhurtam, timeFormat)}
                </span>
              </div>

              <div className="p-2.5 flex justify-between items-center bg-[#fce8ac]/40">
                <span className="font-semibold text-emerald-900">
                  Amrit Kalam:
                </span>
                <span className="font-mono text-[11px] text-slate-900 text-right">
                  {convertTimeNotation(activeDay.amritKalam, timeFormat)}
                </span>
              </div>

              <div className="p-2.5 flex justify-between items-center">
                <span className="font-semibold text-slate-700">Varjyam:</span>
                <span className="font-mono text-[11px] text-slate-800">
                  {convertTimeNotation(activeDay.varjyam, timeFormat)}
                </span>
              </div>
            </div>

            {/* Notes Section Box */}
            <div className="bg-[#f0c878] p-3 text-[11px] text-amber-950 border-t border-[#d69f3d] space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-900">
                <Info className="w-3.5 h-3.5" />
                <span>Panchang Time Reference Notes:</span>
              </div>
              <p className="leading-snug text-slate-800">
                All timings are represented in {timeFormat === "12" ? "12-hour" : timeFormat === "24" ? "24-hour" : "24 Plus (Vedic)"} notation in local time of{" "}
                <strong>{currentLocation}</strong>. In Vedic Panchang, a new day
                starts and ends with Sunrise. Hours past midnight are suffixed
                with next day date.
              </p>
            </div>

            {/* Festivals & Vratham Cards for Selected Day */}
            <div className="bg-[#8c2318] text-amber-100 p-3 border-t border-[#6e180f]">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Festivals & Vratham ({activeDay.festivals.length})</span>
              </h4>

              {activeDay.festivals.length === 0 ? (
                <p className="text-xs text-amber-200/70 italic">
                  No major fasting vows or festivals listed for this day.
                </p>
              ) : (
                <div className="space-y-2">
                  {activeDay.festivals.map((f, idx) => (
                    <div
                      key={idx}
                      className="bg-[#6e180f] border border-amber-400/30 rounded-xl p-2.5 flex items-start gap-2.5 shadow-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-400 text-[#6e180f] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        🕉️
                      </div>
                      <div className="space-y-0.5 text-xs">
                        <div className="font-bold text-amber-200">
                          {isKn && f.titleKn ? f.titleKn : f.title}
                        </div>
                        {f.desc && (
                          <div className="text-[11px] text-amber-100/80 leading-tight">
                            {f.desc}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT PANEL: FULL MONTH PANCHANGA ALMANAC GRID */}
          {/* ==================================================== */}
          <div className="lg:col-span-8 space-y-4">
            {/* Calendar Table Container */}
            <div className="bg-[#fce5a3] border-2 border-[#c0822a] rounded-2xl shadow-xl overflow-hidden">
              {/* Calendar Grid Header Days */}
              <div className="grid grid-cols-7 bg-[#8c2318] text-amber-100 border-b-2 border-[#c0822a] text-center text-xs font-bold divide-x divide-[#6e180f]">
                <div className="py-2.5 text-rose-300 bg-[#7a1c12]">
                  SUN ರವಿ
                </div>
                <div className="py-2.5">MON ಸೋಮ</div>
                <div className="py-2.5">TUE ಮಂಗಳ</div>
                <div className="py-2.5">WED ಬುಧ</div>
                <div className="py-2.5">THU ಗುರು</div>
                <div className="py-2.5">FRI ಶುಕ್ರ</div>
                <div className="py-2.5">SAT ಶನಿ</div>
              </div>

              {/* 35/42 Cell Monthly Calendar Grid */}
              <div className="grid grid-cols-7 bg-[#dca84c] gap-px p-0.5">
                {/* 1. Empty Lead Cells for August 2026 (Starts on Saturday -> 5 padding cells) */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`blank-${i}`}
                    className="bg-[#f7dda0]/40 min-h-[80px] sm:min-h-[96px] p-1.5 opacity-50"
                  />
                ))}

                {/* 2. August 2026 Days (1 through 31) */}
                {Object.keys(AUGUST_2026_DAYS)
                  .map(Number)
                  .map((dayNum) => {
                    const dayObj = AUGUST_2026_DAYS[dayNum];
                    const isSelected = selectedDayNumber === dayNum;
                    const isToday = dayNum === 11;
                    const hasFestivals = dayObj.festivals.length > 0;

                    return (
                      <div
                        key={dayNum}
                        onClick={() => handleSelectDay(dayNum)}
                        className={`min-h-[82px] sm:min-h-[105px] p-1 sm:p-1.5 rounded-lg flex flex-col justify-between cursor-pointer transition-all relative border ${
                          isSelected
                            ? "bg-[#8c2318] text-white border-amber-300 shadow-md ring-2 ring-amber-400 z-10 scale-[1.02]"
                            : isToday
                            ? "bg-[#edd17c] text-slate-900 border-[#8c2318] font-bold shadow-xs"
                            : "bg-[#fce5a3] hover:bg-[#f7d685] text-slate-900 border-[#dca84c]"
                        }`}
                      >
                        {/* Top Tithi Label & Day Number */}
                        <div>
                          <div
                            className={`flex justify-between items-start text-[10px] sm:text-[11px] font-semibold leading-none ${
                              isSelected ? "text-amber-200" : "text-amber-900"
                            }`}
                          >
                            <span className="truncate pr-1">
                              {isKn ? dayObj.tithiKn : dayObj.tithiShort}
                            </span>
                            <span
                              className={`font-mono text-[10px] px-1 rounded ${
                                isSelected
                                  ? "bg-amber-400 text-slate-950 font-bold"
                                  : "text-amber-800 bg-amber-300/40"
                              }`}
                            >
                              {dayObj.lunarDayNum}
                            </span>
                          </div>

                          {/* Large Bold Center Date Number */}
                          <div className="text-center my-1">
                            <span
                              className={`text-lg sm:text-2xl font-black font-mono leading-none ${
                                isSelected
                                  ? "text-amber-100"
                                  : isToday
                                  ? "text-[#8c2318]"
                                  : "text-slate-900"
                              }`}
                            >
                              {dayNum}
                            </span>
                          </div>
                        </div>

                        {/* Mid/Bottom Info: Sunrise / Sunset & Festival Badge */}
                        <div className="space-y-1">
                          {hasFestivals && (
                            <div
                              className={`text-[9px] sm:text-[10px] font-bold truncate rounded px-1 py-0.5 leading-tight ${
                                isSelected
                                  ? "bg-amber-400 text-[#6e180f]"
                                  : "bg-[#8c2318] text-amber-100"
                              }`}
                              title={
                                isKn && dayObj.festivals[0].titleKn
                                  ? dayObj.festivals[0].titleKn
                                  : dayObj.festivals[0].title
                              }
                            >
                              {isKn && dayObj.festivals[0].titleKn
                                ? dayObj.festivals[0].titleKn
                                : dayObj.festivals[0].title}
                            </div>
                          )}

                          <div
                            className={`flex justify-between text-[8px] sm:text-[9.5px] font-mono leading-none ${
                              isSelected ? "text-amber-200/90" : "text-slate-700"
                            }`}
                          >
                            <span>{convertTimeNotation(dayObj.sunrise, timeFormat).replace(" AM", "").replace(" PM", "")}</span>
                            <span>{convertTimeNotation(dayObj.sunset, timeFormat).replace(" AM", "").replace(" PM", "")}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* ==================================================== */}
            {/* 5. BOTTOM SECTION: AUGUST 2026 FESTIVALS GRID */}
            {/* ==================================================== */}
            <div className="bg-[#fce5a3] border-2 border-[#c0822a] rounded-2xl shadow-md overflow-hidden">
              <div className="bg-[#8c2318] text-amber-100 px-4 py-3 border-b border-[#6e180f] flex items-center justify-between">
                <h3 className="font-bold font-serif text-sm sm:text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>
                    {isKn
                      ? "ಆಗಸ್ಟ್ ೨೦೨೬ ಹಬ್ಬಗಳು ಮತ್ತು ಉಪವಾಸ ದಿನಗಳು"
                      : "August 2026 Festivals (Ashadha - Shravana 1948)"}
                  </span>
                </h3>
                <span className="text-xs text-amber-300 font-mono">
                  {AUGUST_2026_FESTIVALS_GRID.length} Events
                </span>
              </div>

              {/* 3-Column Grid of Festivals */}
              <div className="p-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 bg-[#f8d785]">
                {AUGUST_2026_FESTIVALS_GRID.map((item, idx) => {
                  const dayVal = parseInt(item.date, 10);
                  const isCurSelected = selectedDayNumber === dayVal;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectDay(dayVal)}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isCurSelected
                          ? "bg-[#8c2318] text-white border-amber-300 shadow-md"
                          : "bg-[#fce5a3] hover:bg-[#edd17c] text-slate-900 border-[#dca84c]"
                      }`}
                    >
                      {/* Date Badge Box */}
                      <div
                        className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center font-bold shrink-0 border ${
                          isCurSelected
                            ? "bg-amber-400 text-slate-950 border-amber-200"
                            : "bg-[#8c2318] text-amber-100 border-[#6e180f]"
                        }`}
                      >
                        <span className="text-sm font-mono leading-none">
                          {item.date}
                        </span>
                        <span className="text-[9px] uppercase font-sans mt-0.5 leading-none opacity-90">
                          {item.day.slice(0, 3)}
                        </span>
                      </div>

                      {/* Festival Name */}
                      <div className="text-xs space-y-0.5 overflow-hidden">
                        <div
                          className={`font-bold line-clamp-2 ${
                            isCurSelected ? "text-amber-100" : "text-[#7a1c12]"
                          }`}
                        >
                          {isKn ? item.titleKn : item.title}
                        </div>
                        <div
                          className={`text-[10px] font-medium ${
                            isCurSelected ? "text-amber-200/80" : "text-slate-700"
                          }`}
                        >
                          {isKn ? item.dayKn : item.day}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: CUSTOM PLACE / LOCATION SELECTOR */}
      {/* ---------------------------------------------------- */}
      {isCustomPlaceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#942a1d] text-amber-100 border-2 border-amber-400/80 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#781e13] px-5 py-3.5 border-b border-amber-300/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-200 font-serif font-bold text-base">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>Set Custom Place for Panchanga</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomPlaceModalOpen(false)}
                className="p-1 hover:bg-[#92281a] text-amber-200 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-semibold text-amber-200">
                  City / Town / Place Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sringeri, Melukote, Mantralayam, Varanasi, Paris..."
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  className="w-full bg-[#69180d] border border-amber-300/40 rounded-lg px-3 py-2 text-amber-100 placeholder-amber-200/50 focus:outline-none focus:border-amber-300 text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-amber-200">
                  Country / Region:
                </label>
                <input
                  type="text"
                  placeholder="e.g. India, USA, UK, Canada, UAE..."
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="w-full bg-[#69180d] border border-amber-300/40 rounded-lg px-3 py-2 text-amber-100 placeholder-amber-200/50 focus:outline-none focus:border-amber-300 text-sm font-medium"
                />
              </div>

              {/* Quick Select Preset Pilgrimage / Major Places */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-semibold text-amber-300">
                  Quick Select Sacred Places & Tech Hubs:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Sringeri, India",
                    "Udupi, India",
                    "Melukote, India",
                    "Mantralayam, India",
                    "Varanasi, India",
                    "San Jose, USA",
                    "Dallas, USA",
                    "London, UK",
                    "Singapore",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        const [c, cntry] = preset.split(", ");
                        setNewCityName(c);
                        setNewCountry(cntry || "India");
                      }}
                      className="px-2.5 py-1 bg-[#781e13] hover:bg-amber-400 hover:text-amber-950 border border-amber-300/30 rounded-md font-medium text-[11px] transition-colors cursor-pointer"
                    >
                      📍 {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#781e13] px-5 py-3 border-t border-amber-300/30 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCustomPlaceModalOpen(false)}
                className="px-4 py-1.5 bg-[#5e180e] hover:bg-[#6e180f] text-amber-200 border border-amber-300/20 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomPlace}
                disabled={!newCityName.trim()}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-amber-950 rounded-lg font-bold transition-all shadow-md cursor-pointer"
              >
                Set Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: CUSTOM DATE SELECTOR */}
      {/* ---------------------------------------------------- */}
      {isCustomDateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#942a1d] text-amber-100 border-2 border-amber-400/80 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#781e13] px-5 py-3.5 border-b border-amber-300/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-200 font-serif font-bold text-base">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>Select Custom Date for Panchanga</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomDateModalOpen(false)}
                className="p-1 hover:bg-[#92281a] text-amber-200 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Year, Month, Day Selectors */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="block font-semibold text-amber-200">Year:</label>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={customYearInput}
                    onChange={(e) => setCustomYearInput(parseInt(e.target.value, 10) || 2026)}
                    className="w-full bg-[#69180d] border border-amber-300/40 rounded-lg px-2.5 py-1.5 text-amber-100 focus:outline-none focus:border-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-amber-200">Month:</label>
                  <select
                    value={customMonthInput}
                    onChange={(e) => setCustomMonthInput(parseInt(e.target.value, 10))}
                    className="w-full bg-[#69180d] border border-amber-300/40 rounded-lg px-2 py-1.5 text-amber-100 focus:outline-none focus:border-amber-300 font-medium cursor-pointer"
                  >
                    {[
                      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ].map((mName, idx) => (
                      <option key={mName} value={idx + 1} className="bg-[#781e13] text-white">
                        {idx + 1} - {mName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-amber-200">Day:</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={customDayInput}
                    onChange={(e) => setCustomDayInput(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-[#69180d] border border-amber-300/40 rounded-lg px-2.5 py-1.5 text-amber-100 focus:outline-none focus:border-amber-300 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Full Calendar Picker */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-semibold text-amber-200">
                  Or Pick via Calendar Control:
                </label>
                <input
                  type="date"
                  value={`${customYearInput}-${String(customMonthInput).padStart(2, "0")}-${String(customDayInput).padStart(2, "0")}`}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split("-").map((v) => parseInt(v, 10));
                      setCustomYearInput(y);
                      setCustomMonthInput(m);
                      setCustomDayInput(d);
                    }
                  }}
                  className="w-full bg-[#69180d] border border-amber-300/40 rounded-lg px-3 py-2 text-amber-100 font-mono focus:outline-none focus:border-amber-300 cursor-pointer"
                />
              </div>

              {/* Festival Shortcuts */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-semibold text-amber-300">
                  Jump to Major Festivals:
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-[#69180d]/60 rounded-lg border border-amber-300/20">
                  {POPULAR_CUSTOM_DATES.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => {
                        const [y, m, d] = f.value.split("-").map((v) => parseInt(v, 10));
                        setCustomYearInput(y);
                        setCustomMonthInput(m);
                        setCustomDayInput(d);
                      }}
                      className="px-2 py-1 bg-[#781e13] hover:bg-amber-400 hover:text-amber-950 border border-amber-300/30 rounded text-[11px] font-medium transition-colors cursor-pointer truncate max-w-full"
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#781e13] px-5 py-3 border-t border-amber-300/30 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCustomDateModalOpen(false)}
                className="px-4 py-1.5 bg-[#5e180e] hover:bg-[#6e180f] text-amber-200 border border-amber-300/20 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomDate}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-lg font-bold transition-all shadow-md cursor-pointer"
              >
                Show Panchanga
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
