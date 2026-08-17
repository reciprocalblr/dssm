/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Comprehensive English <-> Kannada Transliteration and Name Converter
 * Supports instant offline transliteration of names, titles, initials, and arbitrary words.
 */

// Dictionary for common names, honorifics, titles, and terms
const DICTIONARY_EN_TO_KN: Record<string, string> = {
  // Roles & system terms
  "administrator": "ಅಡ್ಮಿನಿಸ್ಟ್ರೇಟರ್",
  "admin": "ಅಡ್ಮಿನ್",
  "operator": "ಆಪರೇಟರ್",
  "desk operator": "ಡೆಸ್ಕ್ ಆಪರೇಟರ್",
  "cashier": "ಕ್ಯಾಷಿಯರ್",
  "chief cashier": "ಮುಖ್ಯ ಕ್ಯಾಷಿಯರ್",
  "pujari": "ಪೂಜಾರಿ",
  "poojari": "ಪೂಜಾರಿ",
  "priest": "ಅರ್ಚಕರು",
  "clerk": "ಕ್ಲರ್ಕ್",
  "staff": "ಸಿಬ್ಬಂದಿ",
  "billing staff": "ಬಿಲ್ಲಿಂಗ್ ಸಿಬ್ಬಂದಿ",
  "super user": "ಸೂಪರ್ ಯೂಸರ್",
  "superuser": "ಸೂಪರ್ ಯೂಸರ್",
  "godmode": "ಗಾಡ್‌ಮೋಡ್",
  "developer": "ಡೆವಲಪರ್",
  "developer & service superuser": "ಡೆವಲಪರ್ ಮತ್ತು ಸರ್ವಿಸ್ ಸೂಪರ್‌ಯೂಸರ್",
  "service superuser": "ಸರ್ವಿಸ್ ಸೂಪರ್‌ಯೂಸರ್",
  "guest": "ಅತಿಥಿ",
  "manager": "ವ್ಯವಸ್ಥಾಪಕರು",
  "trustee": "ಟ್ರಸ್ಟಿ",

  // Honorifics & titles
  "sri": "ಶ್ರೀ",
  "shree": "ಶ್ರೀ",
  "shri": "ಶ್ರೀ",
  "smt": "ಶ್ರೀಮತಿ",
  "shrimati": "ಶ್ರೀಮತಿ",
  "dr": "ಡಾ.",
  "guruji": "ಗುರೂಜಿ",
  "guru": "ಗುರು",
  "swami": "ಸ್ವಾಮಿ",
  "swamy": "ಸ್ವಾಮಿ",
  "pandit": "ಪಂಡಿತ್",
  "acharya": "ಆಚಾರ್ಯ",
  "bhat": "ಭಟ್",
  "bhatt": "ಭಟ್",

  // Common Names & Surnames
  "achutha": "ಅಚ್ಯುತ",
  "achyuth": "ಅಚ್ಯುತ್",
  "achutha murthy": "ಅಚ್ಯುತ ಮೂರ್ತಿ",
  "murthy": "ಮೂರ್ತಿ",
  "moorthy": "ಮೂರ್ತಿ",
  "rashmi": "ರಶ್ಮಿ",
  "chandrashekar": "ಚಂದ್ರಶೇಖರ್",
  "chandrasekhar": "ಚಂದ್ರಶೇಖರ್",
  "raghunandan": "ರಘುನಂದನ್",
  "raghunandhan": "ರಘುನಂದನ್",
  "raghunandan guruji": "ರಘುನಂದನ್ ಗುರೂಜಿ",
  "raghunandhan guruji": "ರಘುನಂದನ್ ಗುರೂಜಿ",
  "ramesh": "ರಮೇಶ್",
  "suresh": "ಸುರೇಶ್",
  "ganesh": "ಗಣೇಶ್",
  "mahesh": "ಮಹೇಶ್",
  "dinesh": "ದಿನೇಶ್",
  "rajesh": "ರಾಜೇಶ್",
  "prasad": "ಪ್ರಸಾದ್",
  "anand": "ಆನಂದ್",
  "manjunath": "ಮಂಜುನಾಥ್",
  "manjunatha": "ಮಂಜುನಾಥ",
  "venkatesh": "ವೆಂಕಟೇಶ್",
  "venkataramana": "ವೆಂಕಟರಮಣ",
  "nagaraj": "ನಾಗರಾಜ್",
  "nagaraja": "ನಾಗರಾಜ",
  "raghavendra": "ರಾಘವೇಂದ್ರ",
  "shankar": "ಶಂಕರ್",
  "shankara": "ಶಂಕರ",
  "krishna": "ಕೃಷ್ಣ",
  "sai": "ಸಾಯಿ",
  "baba": "ಬಾಬಾ",
  "rama": "ರಾಮ",
  "ram": "ರಾಮ್",
  "shiva": "ಶಿವ",
  "vishnu": "ವಿಷ್ಣು",
  "subrahmanya": "ಸುಬ್ರಹ್ಮಣ್ಯ",
  "dattatreya": "ದತ್ತಾತ್ರೇಯ",
  "hanumantha": "ಹನುಮಂತ",
  "harish": "ಹರೀಶ್",
  "girish": "ಗಿರೀಶ್",
  "satish": "ಸತೀಶ್",
  "santosh": "ಸಂತೋಷ್",
  "praveen": "ಪ್ರವೀಣ್",
  "prashanth": "ಪ್ರಶಾಂತ್",
  "naveen": "ನವೀನ್",
  "vinay": "ವಿನಯ್",
  "vijay": "ವಿಜಯ್",
  "vijaya": "ವಿಜಯ",
  "kumar": "ಕುಮಾರ್",
  "kumara": "ಕುಮಾರ",
  "sharma": "ಶರ್ಮಾ",
  "rao": "ರಾವ್",
  "gowda": "ಗೌಡ",
  "patil": "ಪಾಟೀಲ್",
  "hegde": "ಹೆಗಡೆ",
  "shetty": "ಶೆಟ್ಟಿ",
  "kamath": "ಕಾಮತ್",
  "pai": "ಪೈ",
  "joshi": "ಜೋಷಿ",
  "kulkarni": "ಕುಲಕರ್ಣಿ",
  "deshpande": "ದೇಶಪಾಂಡೆ",
  "naik": "ನಾಯ್ಕ್",
  "reddy": "ರೆಡ್ಡಿ",
  "iyer": "ಅಯ್ಯರ್",
  "iyengar": "ಅಯ್ಯಂಗಾರ್",
  "pooja": "ಪೂಜಾ",
  "priya": "ಪ್ರಿಯಾ",
  "kavitha": "ಕವಿತಾ",
  "ananya": "ಅನನ್ಯಾ",
  "sneha": "ಸ್ನೇಹಾ",
  "divya": "ದಿವ್ಯಾ",
  "shwetha": "ಶ್ವೇತಾ",
  "geetha": "ಗೀತಾ",
  "sumathi": "ಸುಮತಿ",
  "lakshmi": "ಲಕ್ಷ್ಮಿ",
  "saraswathi": "ಸರಸ್ವತಿ",
  "parvathi": "ಪಾರ್ವತಿ",
  "bhavani": "ಭವಾನಿ",
  "shobha": "ಶೋಭಾ",
  "rohan": "ರೋಹನ್",
  "deepak": "ದೀಪಕ್",
  "sunil": "ಸುನಿಲ್",
  "anil": "ಅನಿಲ್",
  "kiran": "ಕಿರಣ್",
  "varun": "ವರುಣ್",
  "tarun": "ತರುಣ್",
  "chetan": "ಚೇತನ್",
  "ashok": "ಅಶೋಕ್",
  "bharath": "ಭರತ್",
  "chaitra": "ಚೈತ್ರಾ",
  "madhu": "ಮಧು",
};

// Inverted map for Kannada -> English exact terms
const DICTIONARY_KN_TO_EN: Record<string, string> = {
  "ಅಡ್ಮಿನಿಸ್ಟ್ರೇಟರ್": "Administrator",
  "ಅಡ್ಮಿನ್": "Admin",
  "ಆಪರೇಟರ್": "Operator",
  "ಡೆಸ್ಕ್ ಆಪರೇಟರ್": "Desk Operator",
  "ಕ್ಯಾಷಿಯರ್": "Cashier",
  "ಮುಖ್ಯ ಕ್ಯಾಷಿಯರ್": "Chief Cashier",
  "ಪೂಜಾರಿ": "Pujari",
  "ಅರ್ಚಕರು": "Priest",
  "ಕ್ಲರ್ಕ್": "Clerk",
  "ಸಿಬ್ಬಂದಿ": "Staff",
  "ಬಿಲ್ಲಿಂಗ್ ಸಿಬ್ಬಂದಿ": "Billing Staff",
  "ಗಾಡ್‌ಮೋಡ್": "Godmode",
  "ಡೆವಲಪರ್": "Developer",
  "ಡೆವಲಪರ್ ಮತ್ತು ಸರ್ವಿಸ್ ಸೂಪರ್‌ಯೂಸರ್": "Developer & Service Superuser",
  "ಶ್ರೀ": "Sri",
  "ಶ್ರೀಮತಿ": "Smt",
  "ಡಾ.": "Dr",
  "ಗುರೂಜಿ": "Guruji",
  "ಗುರುಜಿ": "Guruji",
  "ಗುರು": "Guru",
  "ಸ್ವಾಮಿ": "Swami",
  "ಭಟ್": "Bhat",
  "ಅಚ್ಯುತ": "Achutha",
  "ಅಚ್ಯುತ್": "Achyuth",
  "ಅಚ್ಯುತ ಮೂರ್ತಿ": "Achutha Murthy",
  "ಮೂರ್ತಿ": "Murthy",
  "ರಶ್ಮಿ": "Rashmi",
  "ಚಂದ್ರಶೇಖರ್": "Chandrashekar",
  "ರಘುನಂದನ್": "Raghunandan",
  "ರಘುನಂಧನ್": "Raghunandan",
  "ರಘುನಂದನ್ ಗುರೂಜಿ": "Raghunandan Guruji",
  "ರಘುನಂಧನ್ ಗುರುಜಿ": "Raghunandan Guruji",
  "ರಮೇಶ್": "Ramesh",
  "ಸುರೇಶ್": "Suresh",
  "ಗಣೇಶ್": "Ganesh",
  "ಪ್ರಸಾದ್": "Prasad",
  "ಆನಂದ್": "Anand",
  "ಮಂಜುನಾಥ್": "Manjunath",
  "ವೆಂಕಟೇಶ್": "Venkatesh",
  "ನಾಗರಾಜ್": "Nagaraj",
  "ರಾಘವೇಂದ್ರ": "Raghavendra",
  "ಶಂಕರ್": "Shankar",
  "ಕೃಷ್ಣ": "Krishna",
  "ಸಾಯಿ": "Sai",
  "ಕುಮಾರ್": "Kumar",
  "ಶರ್ಮಾ": "Sharma",
  "ರಾವ್": "Rao",
  "ಗೌಡ": "Gowda",
  "ಪಾಟೀಲ್": "Patil",
  "ಹೆಗಡೆ": "Hegde",
  "ಶೆಟ್ಟಿ": "Shetty",
  "ಕಾಮತ್": "Kamath",
  "ಪೈ": "Pai",
  "ಜೋಷಿ": "Joshi",
  "ರೆಡ್ಡಿ": "Reddy",
};

// Check if string has Kannada Unicode characters
export function hasKannadaChars(str: string): boolean {
  return /[\u0C80-\u0CFF]/.test(str);
}

// Check if string has English/Latin characters
export function hasEnglishChars(str: string): boolean {
  return /[a-zA-Z]/.test(str);
}

// Phonetic Single Word Transliteration: English -> Kannada
export function transliterateWordEnToKn(word: string): string {
  const cleanWord = word.trim();
  if (!cleanWord) return "";

  // Check dictionary
  const lower = cleanWord.toLowerCase();
  if (DICTIONARY_EN_TO_KN[lower]) {
    return DICTIONARY_EN_TO_KN[lower];
  }

  // Handle single-letter initials with or without dot (e.g., "K", "K.", "K.R.", "R.")
  const initialMap: Record<string, string> = {
    "a": "ಎ.", "b": "ಬಿ.", "c": "ಸಿ.", "d": "ಡಿ.", "e": "ಇ.", "f": "ಎಫ್.",
    "g": "ಜಿ.", "h": "ಹೆಚ್.", "i": "ಐ.", "j": "ಜೆ.", "k": "ಕೆ.", "l": "ಎಲ್.",
    "m": "ಎಂ.", "n": "ಎನ್.", "o": "ಒ.", "p": "ಪಿ.", "q": "ಕ್ಯೂ.", "r": "ಆರ್.",
    "s": "ಎಸ್.", "t": "ಟಿ.", "u": "ಯು.", "v": "ವಿ.", "w": "ಡಬ್ಲ್ಯೂ.", "x": "ಎಕ್ಸ್.",
    "y": "ವೈ.", "z": "ಝಡ್."
  };

  if (/^[a-zA-Z]\.?$/.test(cleanWord)) {
    const char = cleanWord[0].toLowerCase();
    return initialMap[char] || cleanWord;
  }

  // Handle composite initials like "K.R" or "K.R."
  if (/^([a-zA-Z]\.)+[a-zA-Z]?\.?$/.test(cleanWord)) {
    return cleanWord
      .split(".")
      .filter(Boolean)
      .map(ch => initialMap[ch.toLowerCase()] || ch)
      .join("");
  }

  // Phonetic rule-based translation for general English word to Kannada
  const vowels: Record<string, string> = {
    "aa": "ಾ", "ee": "ೀ", "ii": "ೀ", "oo": "ೂ", "uu": "ೂ", "ai": "ೈ", "au": "ೌ", "ou": "ೌ",
    "ae": "ೇ", "a": "", "e": "ೆ", "i": "ಿ", "o": "ೊ", "u": "ು"
  };

  const initialVowels: Record<string, string> = {
    "aa": "ಆ", "ee": "ಈ", "ii": "ಈ", "oo": "ಊ", "uu": "ಊ", "ai": "ಐ", "au": "ಔ", "ou": "ಔ",
    "ae": "ಏ", "a": "ಅ", "e": "ಎ", "i": "ಇ", "o": "ಒ", "u": "ಉ"
  };

  const consonants: Record<string, string> = {
    "ksh": "ಕ್ಷ", "jny": "ಜ್ಞ", "gny": "ಜ್ಞ",
    "chh": "ಛ", "kh": "ಖ", "gh": "ಘ", "ch": "ಚ", "jh": "ಝ",
    "th": "ತ", "dh": "ಧ", "ph": "ಫ", "bh": "ಭ", "sh": "ಶ", "shh": "ಷ",
    "k": "ಕ", "g": "ಗ", "c": "ಕ", "j": "ಜ", "t": "ತ", "d": "ದ",
    "n": "ನ", "p": "ಪ", "f": "ಫ", "b": "ಬ", "m": "ಮ", "y": "ಯ",
    "r": "ರ", "l": "ಲ", "v": "ವ", "w": "ವ", "s": "ಸ", "h": "ಹ", "z": "ಜ಼"
  };

  let result = "";
  let i = 0;
  const len = lower.length;
  let isStartOfSyllable = true;

  while (i < len) {
    // 1. Check multi-char consonants
    let matchedConsonant = "";
    let matchedConsonantLen = 0;

    for (const key of ["ksh", "jny", "gny", "chh", "kh", "gh", "ch", "jh", "th", "dh", "ph", "bh", "sh", "shh", "k", "g", "c", "j", "t", "d", "n", "p", "f", "b", "m", "y", "r", "l", "v", "w", "s", "h", "z"]) {
      if (lower.startsWith(key, i)) {
        matchedConsonant = consonants[key];
        matchedConsonantLen = key.length;
        break;
      }
    }

    if (matchedConsonant) {
      i += matchedConsonantLen;
      isStartOfSyllable = false;

      // Check following vowel
      let matchedVowel = "";
      let matchedVowelLen = 0;

      for (const vKey of ["aa", "ee", "ii", "oo", "uu", "ai", "au", "ou", "ae", "a", "e", "i", "o", "u"]) {
        if (lower.startsWith(vKey, i)) {
          matchedVowel = vowels[vKey];
          matchedVowelLen = vKey.length;
          break;
        }
      }

      if (matchedVowelLen > 0) {
        result += matchedConsonant + matchedVowel;
        i += matchedVowelLen;
      } else {
        // End of word or followed by consonant -> add virama unless end of word 'a' implied
        if (i < len && /[a-z]/.test(lower[i])) {
          result += matchedConsonant + "್";
        } else {
          result += matchedConsonant;
        }
      }
      continue;
    }

    // 2. Check initial/standalone vowels
    let matchedInitVowel = "";
    let matchedInitVowelLen = 0;

    for (const vKey of ["aa", "ee", "ii", "oo", "uu", "ai", "au", "ou", "ae", "a", "e", "i", "o", "u"]) {
      if (lower.startsWith(vKey, i)) {
        matchedInitVowel = isStartOfSyllable ? initialVowels[vKey] : vowels[vKey];
        matchedInitVowelLen = vKey.length;
        break;
      }
    }

    if (matchedInitVowelLen > 0) {
      result += matchedInitVowel;
      i += matchedInitVowelLen;
      isStartOfSyllable = false;
      continue;
    }

    // Unrecognized character (punctuation, space, digit)
    result += cleanWord[i];
    isStartOfSyllable = true;
    i++;
  }

  return result || cleanWord;
}

// Phonetic Single Word Transliteration: Kannada -> English
export function transliterateWordKnToEn(word: string): string {
  const cleanWord = word.trim();
  if (!cleanWord) return "";

  // Check dictionary
  if (DICTIONARY_KN_TO_EN[cleanWord]) {
    return DICTIONARY_KN_TO_EN[cleanWord];
  }

  const baseConsonants: Record<string, string> = {
    'ಕ': 'k', 'ಖ': 'kh', 'ಗ': 'g', 'ಘ': 'gh', 'ಙ': 'ng',
    'ಚ': 'ch', 'ಛ': 'chh', 'ಜ': 'j', 'ಝ': 'jh', 'ಞ': 'ny',
    'ಟ': 't', 'ಠ': 'th', 'ಡ': 'd', 'ಢ': 'dh', 'ಣ': 'n',
    'ತ': 't', 'ಥ': 'th', 'ದ': 'd', 'ಧ': 'dh', 'ನ': 'n',
    'ಪ': 'p', 'ಫ': 'ph', 'ಬ': 'b', 'ಭ': 'bh', 'ಮ': 'm',
    'ಯ': 'y', 'ರ': 'r', 'ಲ': 'l', 'ವ': 'v', 'ಶ': 'sh', 'ಷ': 'sh', 'ಸ': 's', 'ಹ': 'h', 'ಳ': 'l',
    'ಕ್ಷ': 'ksh', 'ಜ್ಞ': 'jny'
  };

  const vowelSigns: Record<string, string> = {
    'ಾ': 'a', 'ಿ': 'i', 'ೀ': 'ee', 'ು': 'u', 'ೂ': 'oo', 'ೃ': 'ru',
    'ೆ': 'e', 'ೇ': 'e', 'ೈ': 'ai', 'ೊ': 'o', 'ೋ': 'o', 'ೌ': 'au',
    'ಂ': 'm', 'ಃ': 'h'
  };

  const pureVowels: Record<string, string> = {
    'ಅ': 'a', 'ಆ': 'aa', 'ಇ': 'i', 'ಈ': 'ee', 'ಉ': 'u', 'ಊ': 'oo', 'ಋ': 'ru',
    'ಎ': 'e', 'ಏ': 'e', 'ಐ': 'ai', 'ಒ': 'o', 'ಓ': 'o', 'ಔ': 'au'
  };

  let res = '';
  let i = 0;
  while (i < cleanWord.length) {
    const char = cleanWord[i];
    if (pureVowels[char] !== undefined) {
      res += pureVowels[char];
      i++;
    } else if (baseConsonants[char] !== undefined) {
      const cons = baseConsonants[char];
      i++;
      if (i < cleanWord.length && cleanWord[i] === '್') {
        res += cons;
        i++;
      } else if (i < cleanWord.length && vowelSigns[cleanWord[i]] !== undefined) {
        res += cons + vowelSigns[cleanWord[i]];
        i++;
      } else {
        // Ending consonant without virama often has short 'a' or clean ending
        if (i >= cleanWord.length) {
          res += cons;
        } else {
          res += cons + 'a';
        }
      }
    } else if (vowelSigns[char] !== undefined) {
      res += vowelSigns[char];
      i++;
    } else {
      res += char;
      i++;
    }
  }

  // Capitalize first letter of word
  if (res.length > 0) {
    return res.charAt(0).toUpperCase() + res.slice(1);
  }
  return res || cleanWord;
}

/**
 * Main Bidirectional Transliterate Function for Operator Names and Phrases
 * Converts to Kannada when targetLang is 'kn', converts to English when targetLang is 'en'
 */
export function transliterateOperatorName(name: string | undefined | null, targetLang: 'en' | 'kn'): string {
  if (!name || !name.trim()) {
    return targetLang === 'kn' ? "ಆಪರೇಟರ್" : "Operator";
  }

  const trimmed = name.trim();

  // Full phrase lookup in dictionary first
  const lowerTrimmed = trimmed.toLowerCase();
  if (targetLang === 'kn') {
    if (DICTIONARY_EN_TO_KN[lowerTrimmed]) {
      return DICTIONARY_EN_TO_KN[lowerTrimmed];
    }
    // If it is already purely Kannada, preserve with standard honorific fixes
    if (hasKannadaChars(trimmed) && !hasEnglishChars(trimmed)) {
      return trimmed
        .replace("ರಘುನಂಧನ್ ಗುರೂಜಿ", "ರಘುನಂದನ್ ಗುರೂಜಿ")
        .replace("ರಘುನಂಧನ್ ಗುರುಜಿ", "ರಘುನಂದನ್ ಗುರೂಜಿ");
    }
    // Split into tokens (preserving spaces and punctuation) and transliterate each word
    const words = trimmed.split(/(\s+|[.,\-_/()]+)/);
    return words.map(part => {
      if (/^\s+$/.test(part) || /^[.,\-_/()]+$/.test(part)) {
        return part;
      }
      return transliterateWordEnToKn(part);
    }).join("").trim();
  } else {
    // Target is English
    if (DICTIONARY_KN_TO_EN[trimmed]) {
      return DICTIONARY_KN_TO_EN[trimmed];
    }
    if (!hasKannadaChars(trimmed)) {
      return trimmed;
    }
    // Split Kannada words and convert each to English
    const words = trimmed.split(/(\s+|[.,\-_/()]+)/);
    return words.map(part => {
      if (/^\s+$/.test(part) || /^[.,\-_/()]+$/.test(part)) {
        return part;
      }
      return transliterateWordKnToEn(part);
    }).join("").trim();
  }
}

/**
 * Complete Dynamic Greeting Generator with Language Mode & Name Transliteration
 * - In English: "Good Morning, [Name]" / "Good Afternoon, [Name]" / "Good Evening, [Name]" / "Good Night, [Name]"
 * - In Kannada: "ಶುಭೋದಯ, [ಕನ್ನಡ ಹೆಸರು]" / "ಶುಭ ಮಧ್ಯಾಹ್ನ, [ಕನ್ನಡ ಹೆಸರು]" / "ಶುಭ ಸಾಯಂಕಾಲ, [ಕನ್ನಡ ಹೆಸರು]" / "ಶುಭ ರಾತ್ರಿ, [ಕನ್ನಡ ಹೆಸರು]"
 */
export function getWelcomeGreeting(
  rawName: string | undefined | null,
  language: 'en' | 'kn',
  date: Date = new Date()
): string {
  const name = transliterateOperatorName(rawName, language);
  const hours = date.getHours();

  if (language === "en") {
    if (hours >= 4 && hours < 12) {
      return `Good Morning, ${name}`;
    } else if (hours >= 12 && hours < 16) {
      return `Good Afternoon, ${name}`;
    } else if (hours >= 16 && hours < 24) {
      return `Good Evening, ${name}`;
    } else {
      return `Good Night, ${name}`;
    }
  } else {
    if (hours >= 4 && hours < 12) {
      return `ಶುಭೋದಯ, ${name}`;
    } else if (hours >= 12 && hours < 16) {
      return `ಶುಭ ಮಧ್ಯಾಹ್ನ, ${name}`;
    } else if (hours >= 16 && hours < 24) {
      return `ಶುಭ ಸಾಯಂಕಾಲ, ${name}`;
    } else {
      return `ಶುಭ ರಾತ್ರಿ, ${name}`;
    }
  }
}
